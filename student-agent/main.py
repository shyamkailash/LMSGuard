from websocket_client import AgentWebSocketClient
from window_detector import get_active_window
from app_detector import check_app
from screen_capture import capture_screen
import base64
import time


client = AgentWebSocketClient()


client.connect()


while True:


    # Active window detection

    window = get_active_window()


    app_event = check_app(window)


    if app_event:

        client.send(app_event)

        print(app_event)



    # Screen capture

    image = capture_screen()


    data = {

        "type":"SCREEN_CAPTURE",

        "image":
        base64.b64encode(image)
        .decode()

    }


    client.send(data)


    print(
        "Screen sent"
    )


    time.sleep(5)
