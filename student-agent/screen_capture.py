# pyrefly: ignore [missing-import]
import mss
import io
from PIL import Image


def capture_screen():

    with mss.mss() as sct:

        screenshot = sct.grab(
            sct.monitors[1]
        )

        image = Image.frombytes(
            "RGB",
            screenshot.size,
            screenshot.rgb
        )


        buffer = io.BytesIO()

        image.save(
            buffer,
            format="JPEG",
            quality=50
        )


        return buffer.getvalue()
