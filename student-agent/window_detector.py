import platform
import subprocess
import psutil


def get_active_window():

    system = platform.system()


    if system == "Linux":

        try:
            window = subprocess.check_output(
                ["xdotool", "getactivewindow", "getwindowname"],
                text=True
            ).strip()

            return {
                "app": window,
                "process": "Linux"
            }

        except Exception:

            return {
                "app": "Unknown",
                "process": "Unknown"
            }



    return {
        "app":"Unknown",
        "process":"Unknown"
    }
