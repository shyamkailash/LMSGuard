from pynput import keyboard, mouse
import threading
import time

last_activity = time.time()


def update_activity(*args):
    global last_activity
    last_activity = time.time()


def start_listeners():
    keyboard.Listener(
        on_press=update_activity
    ).start()

    mouse.Listener(
        on_move=update_activity,
        on_click=update_activity,
        on_scroll=update_activity
    ).start()


threading.Thread(
    target=start_listeners,
    daemon=True
).start()


def get_idle_time():
    return int(time.time() - last_activity)


def is_idle(limit=60):
    return get_idle_time() >= limit
