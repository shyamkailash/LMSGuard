# Student Agent

Python monitoring agent for LMSGuard-style exam monitoring.

## Features

- Captures student screen
- Compresses screenshot to JPEG
- Sends screenshots to backend via WebSocket
- Detects active foreground window
- Detects blacklisted apps
- Detects idle status

## Folder

```text
student-agent/
├── screen_capture.py
├── window_detector.py
├── app_detector.py
├── idle_detector.py
├── websocket_client.py
├── main.py
├── requirements.txt
└── README.md
```

## Install

```bash
cd student-agent
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

For Linux/macOS development:

```bash
source venv/bin/activate
pip install -r requirements.txt
```

`pywin32` active-window and idle detection works on Windows. On Linux/macOS, the current fallback returns `Unknown` for active window and `0` idle seconds.

## Run

```bash
set AGENT_WS_URL=ws://127.0.0.1:8000/ws/student-agent
set STUDENT_ID=student-001
python main.py
```

PowerShell:

```powershell
$env:AGENT_WS_URL="ws://127.0.0.1:8000/ws/student-agent"
$env:STUDENT_ID="student-001"
python main.py
```

## Unauthorized app alert payload

```json
{
  "type": "UNAUTHORIZED_APP",
  "app": "VS Code",
  "window_title": "main.py - Visual Studio Code",
  "process_name": "Code.exe",
  "pid": 1234
}
```

## Backend events sent

- `SCREEN_CAPTURE`
- `ACTIVE_WINDOW`
- `UNAUTHORIZED_APP`
- `IDLE_STATUS`
