# lib from py
from flask import session, render_template
from datetime import datetime, timezone
from jwt import decode
from os import getenv

def authen_page():
    # check for token in session
    if "token" not in session:
        return render_template("login.html")

    current = datetime.now(timezone.utc)
    try:
        payload = decode(session["token"], getenv("SECRET_KEY"), "HS256")
        
        # check for exp
        if "exp" not in payload or payload["exp"] <= int(current.timestamp()):
            session.clear()
            return render_template("login.html")
    except:
        return render_template("login.html")
