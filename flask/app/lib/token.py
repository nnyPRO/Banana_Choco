# lib from py
from flask import session, render_template
from jwt import decode, encode
from os import getenv

def getDataFromSession():
    '''Function for get data from current session'''
    try:
        token = session["token"]
        data = decode(token, getenv("SECRET_KEY"), "HS256")
        return data
    except:
        return None

def encodeJWT(data):
    '''Function for encode data to token and set to session["token"]'''
    session["token"] = encode(data, getenv("SECRET_KEY"))
    # token schema { "id": int, "email": str, "username": str, "exp": timestamp (int) }