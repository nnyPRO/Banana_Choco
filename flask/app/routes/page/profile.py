# python lib
from flask import render_template 

# my lib
from app.routes.page import main
from app.lib.token import getDataFromSession
from app.models.player import Player

@main.route("/profile")
def profile():
    user_data = getDataFromSession()
    user_data = Player.query.get(user_data["id"])
    if user_data:
        return render_template("profile.html", user_data={ "username": user_data.name, "avatar_url": user_data.avatar_url })
    else:
        return render_template("login.html")