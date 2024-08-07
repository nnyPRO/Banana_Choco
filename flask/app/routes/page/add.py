# py lib
from flask import redirect, render_template

# my lib
from app.routes.page import main
from app.lib.token import getDataFromSession
from app.models.deck import Deck
from app.models.card import Card

@main.route("/create_deck")
def create_deck():
    # check for authen
    data = getDataFromSession()
    if not data:
        return redirect("/api/logout")

    return render_template("add.html")