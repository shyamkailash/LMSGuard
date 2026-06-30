import time


last_activity = time.time()


def get_idle_time():

    return int(
        time.time() - last_activity
    )


def is_idle(limit=60):

    return get_idle_time() > limit
