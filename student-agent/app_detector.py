BLACKLIST = [
    "code",
    "visual studio",
    "discord",
    "telegram",
    "whatsapp",
    "calculator"
]


def check_app(app):

    app_name = app.lower()


    for blocked in BLACKLIST:

        if blocked in app_name:

            return {
                "type":"UNAUTHORIZED_APP",
                "app":app
            }


    return None
