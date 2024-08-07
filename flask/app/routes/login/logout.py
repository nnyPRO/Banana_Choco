# lib from py
from flask import session, redirect, url_for

# my lib
from app.routes.login import login_b

@login_b.route("/logout")
def api_logout():
    session.clear()
    return redirect(url_for("main.home"))