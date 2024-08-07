# lib from py
from flask import session
from datetime import datetime, timezone
from jwt import decode
from os import getenv

# my lib
from app.lib.request import unauthen

def authen_api():
    # check for token in session
    if "token" not in session:
        return unauthen

    current = datetime.now(timezone.utc)
    try:
        payload = decode(session["token"], getenv("SECRET_KEY"), "HS256")
        
        # check for exp
        if "exp" not in payload or payload["exp"] <= int(current.timestamp()):
            session.clear()
            return unauthen
    except:
        return unauthen
