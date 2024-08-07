# lib from py
from flask import redirect, url_for
from datetime import datetime, timezone, timedelta

# my lib
from app.routes.login import login_b
from app import oauth, app, db
from app.models.player import Player
from app.lib.token import encodeJWT

@login_b.route("/login/fb")
def login_fb():
    print(app.config["FB_CLIENT_ID"])
    oauth.register(
        "facebook",
        client_id=app.config["FB_CLIENT_ID"],
        client_secret=app.config["FB_CLIENT_SECRET"],
        access_token_url='https://graph.facebook.com/oauth/access_token',
        access_token_params=None,
        authorize_url='https://www.facebook.com/dialog/oauth',
        authorize_params=None,
        api_base_url='https://graph.facebook.com/',
        client_kwargs={'scope': 'email'},
    )
    
    redirected_uri = url_for("login.login_fb_auth", _external=True)
    # print("https"+redirected_uri[4:])
    # return oauth.facebook.authorize_redirect("https"+redirected_uri[4:])
    return oauth.facebook.authorize_redirect(redirected_uri)

@login_b.route("/login/fb/auth")
def login_fb_auth():
    token = oauth.facebook.authorize_access_token()
    resp = oauth.facebook.get('https://graph.facebook.com/me?fields=id,name,email,picture{url}')
    user_info = resp.json() # { "email": "", "id": 0, "name": "", "picture": { "data": { "url": "" } } }

    try:
        name = user_info["name"]
        email = user_info["email"]
        picture = user_info["picture"]["data"]["url"]
    except:
        return redirect(url_for("main.home"))

    user = Player.query.filter_by(email=email).first()

    if not user:
        new_user = Player(email, name, "-")
        new_user.updateAVT(picture)
        new_user.updatePass("-", False)
        db.session.add(new_user)
        db.session.commit()
    
    user = Player.query.filter_by(email=email).first()

    # encode with jwt (json web token)
    exp = int((datetime.now(timezone.utc)+timedelta(days=1)).timestamp())
    data = { "id": user.id, "email": user.email, "username": user.name, "exp": exp }
    encodeJWT(data)
    
    return redirect(url_for("main.home"))