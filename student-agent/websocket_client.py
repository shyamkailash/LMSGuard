import base64
import hashlib
import os
import secrets
import socket
import ssl
import struct
import time
from dataclasses import dataclass
from urllib.parse import urlparse


class WebSocketError(RuntimeError):
    pass


@dataclass
class _ParsedURL:
    scheme: str
    host: str
    port: int
    path: str


def _parse_url(url: str) -> _ParsedURL:
    parsed = urlparse(url)
    if parsed.scheme not in {"ws", "wss"}:
        raise WebSocketError(f"Unsupported WebSocket scheme: {parsed.scheme!r}")

    host = parsed.hostname
    if not host:
        raise WebSocketError(f"Invalid WebSocket URL: {url!r}")

    if parsed.port:
        port = parsed.port
    else:
        port = 443 if parsed.scheme == "wss" else 80

    path = parsed.path or "/"
    if parsed.query:
        path = f"{path}?{parsed.query}"

    return _ParsedURL(parsed.scheme, host, port, path)


class WebSocketClient:
    """
    Minimal WebSocket client for the student agent.

    The previous implementation relied on the third-party `websocket-client`
    package. This version uses the Python standard library only, so the agent
    can run with plain `python3 main.py` as long as the backend is reachable.
    """

    def __init__(self, url=None, reconnect_delay=3):
        self.url = url or os.getenv(
            "AGENT_WS_URL",
            "ws://127.0.0.1:8000/ws/student-agent",
        )
        self.reconnect_delay = reconnect_delay
        self.ws = None
        self._sock = None
        self._url = None

    def _open_socket(self):
        parsed = _parse_url(self.url)
        self._url = parsed

        raw_sock = socket.create_connection((parsed.host, parsed.port), timeout=10)
        if parsed.scheme == "wss":
          # Keep the secure path available for future deployments.
            context = ssl.create_default_context()
            sock = context.wrap_socket(raw_sock, server_hostname=parsed.host)
        else:
            sock = raw_sock

        key = base64.b64encode(secrets.token_bytes(16)).decode("ascii")
        request = (
            f"GET {parsed.path} HTTP/1.1\r\n"
            f"Host: {parsed.host}:{parsed.port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n"
            "\r\n"
        )
        sock.sendall(request.encode("ascii"))

        response = self._read_http_response(sock)
        if b" 101 " not in response.split(b"\r\n", 1)[0]:
            raise WebSocketError(f"WebSocket handshake failed: {response!r}")

        expected_accept = base64.b64encode(
            hashlib.sha1(
                (key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").encode("ascii")
            ).digest()
        ).decode("ascii")

        if f"Sec-WebSocket-Accept: {expected_accept}".encode("ascii") not in response:
            raise WebSocketError("WebSocket handshake validation failed.")

        self._sock = sock
        self.ws = sock

    def _read_http_response(self, sock):
        data = b""
        while b"\r\n\r\n" not in data:
            chunk = sock.recv(4096)
            if not chunk:
                break
            data += chunk
        return data

    def _send_frame(self, payload: bytes, opcode: int = 0x1):
        if not self._sock:
            raise WebSocketError("WebSocket is not connected.")

        fin_and_opcode = 0x80 | opcode
        mask_bit = 0x80
        length = len(payload)
        header = bytearray([fin_and_opcode])

        if length < 126:
            header.append(mask_bit | length)
        elif length < (1 << 16):
            header.append(mask_bit | 126)
            header.extend(struct.pack("!H", length))
        else:
            header.append(mask_bit | 127)
            header.extend(struct.pack("!Q", length))

        mask = os.urandom(4)
        masked = bytes(byte ^ mask[i % 4] for i, byte in enumerate(payload))
        self._sock.sendall(bytes(header) + mask + masked)

    def _recv_frame(self):
        if not self._sock:
            raise WebSocketError("WebSocket is not connected.")

        header = self._sock.recv(2)
        if len(header) < 2:
            raise WebSocketError("WebSocket connection closed.")

        fin = header[0] & 0x80
        opcode = header[0] & 0x0F
        masked = header[1] & 0x80
        length = header[1] & 0x7F

        if length == 126:
            length = struct.unpack("!H", self._sock.recv(2))[0]
        elif length == 127:
            length = struct.unpack("!Q", self._sock.recv(8))[0]

        mask = self._sock.recv(4) if masked else None
        payload = b""
        while len(payload) < length:
            chunk = self._sock.recv(length - len(payload))
            if not chunk:
                break
            payload += chunk

        if mask:
            payload = bytes(byte ^ mask[i % 4] for i, byte in enumerate(payload))

        return fin, opcode, payload

    def connect(self):
        while True:
            try:
                self._open_socket()
                print("[WS] Connected")
                return True
            except Exception as e:
                print(f"[WS] Connection failed: {e}. Retrying in {self.reconnect_delay}s")
                time.sleep(self.reconnect_delay)

    def send(self, data):
        if self.ws is None:
            self.connect()

        payload = data if isinstance(data, bytes) else str(data).encode("utf-8")

        try:
            self._send_frame(payload)
            return True
        except (BrokenPipeError, ConnectionResetError, OSError, WebSocketError) as e:
            print(f"[WS] Send failed: {e}")
            print("[WS] Reconnecting...")

            try:
                if self.ws:
                    self.close()
            except Exception:
                pass

            self.ws = None
            self.connect()

            try:
                self._send_frame(payload)
                return True
            except Exception as retry_error:
                print(f"[WS] Retry send failed: {retry_error}")
                return False

    def close(self):
        try:
            if self._sock:
                try:
                    self._send_frame(b"", opcode=0x8)
                except Exception:
                    pass
                self._sock.close()
        finally:
            self._sock = None
            self.ws = None


# Alias for main.py compatibility
AgentWebSocketClient = WebSocketClient
