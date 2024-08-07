# lib from py
from flask import url_for, redirect
from datetime import datetime, timezone, timedelta

# my lib
from app import app, oauth, db
from app.routes.login import login_b
from app.models.player import Player
from app.lib.token import encodeJWT

@login_b.route("/login/google")
def login_google():

    oauth.register(
        "google",
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        server_metadata_url=app.config['GOOGLE_DISCOVERY_URL'],
        client_kwargs={
            'scope': 'openid email profile'
        }
    )

    # url to redirect to
    redirect_url = url_for("login.login_google_auth", _external=True)
    # return oauth.google.authorize_redirect("https"+redirect_url[4:])
    return oauth.google.authorize_redirect(redirect_url)

@login_b.route("/login/google/auth")
def login_google_auth():
    token = oauth.google.authorize_access_token()

    user_info = token['userinfo']
    user = Player.query.filter_by(email=user_info["email"]).first()
    if not user:
        name = user_info.get('given_name','') + " " + user_info.get('family_name','')
        new_user = Player(user_info["email"], name, "-")
        new_user.updatePass("-", False)
        new_user.updateAVT(user_info["picture"])
        db.session.add(new_user)
        db.session.commit()

    user = Player.query.filter_by(email=user_info["email"]).first()
    exp = int((datetime.now(timezone.utc)+timedelta(days=1)).timestamp())
    data = { "id": user.id, "email": user.email, "username": user.name, "exp": exp }
    encodeJWT(data)
    return redirect(url_for("main.home"))
    