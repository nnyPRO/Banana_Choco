# lib from py
from flask import render_template

# my lib
from app.routes.page import main
# from app.lib.token import getDataFromSession
# from app.models.player import Player


@main.route("/")
def home():
    return render_template("home.html")
