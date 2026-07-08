import io

try:
    import mss  # type: ignore
except ImportError:  # pragma: no cover - optional dependency
    mss = None

from PIL import Image, ImageDraw, ImageGrab


def capture_screen():
    if mss is not None:
        try:
            with mss.mss() as sct:
                screenshot = sct.grab(sct.monitors[1])
                image = Image.frombytes("RGB", screenshot.size, screenshot.rgb)
                buffer = io.BytesIO()
                image.save(buffer, format="JPEG", quality=50)
                return buffer.getvalue()
        except Exception:
            # Fall through to the Pillow-based fallback below.
            pass

    try:
        image = ImageGrab.grab()
    except Exception:
        # Headless fallback: generate a lightweight placeholder frame so the
        # agent keeps running even when desktop capture is unavailable.
        image = Image.new("RGB", (1280, 720), color=(240, 244, 250))
        draw = ImageDraw.Draw(image)
        draw.rectangle((40, 40, 1240, 680), outline=(37, 99, 235), width=4)
        draw.text((64, 64), "LMSGuard screen capture fallback", fill=(15, 23, 42))

    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=50)
    return buffer.getvalue()
