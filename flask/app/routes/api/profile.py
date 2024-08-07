# python lib
from flask import request, redirect, url_for
from os import path

# my lib
from app import app, db
from app.routes.api import api
from app.lib.token import getDataFromSession
from app.models.player import Player
from app.lib.request import badRequest, success, internalErr
from app.lib.validate import formatNumAndChar, USERNAME_LEN, USERNAME_INVALID, FILE_SIZE

# Written By Auttakorn Camsoi
# Route for change player info
@api.route("/profile", methods=["POST"])
def profile():
    user = getDataFromSession()
    user_data = Player.query.get(user["id"])
    if not user_data:
        return redirect(url_for("login.login"))
    err_list = []
    new_username = ""
    file = None

    # validate username
    if "new_username" in request.form:
        new_username = request.form["new_username"]
        if len(new_username) <= 8 or len(new_username) > 255:
            err_list.append(USERNAME_LEN)
        elif not formatNumAndChar(new_username):
            err_list.append(USERNAME_INVALID)
    
    # validate file
    if "img" in request.files:
        file = request.files["img"]
        if file.content_length > 52428800:
            err_list.append(FILE_SIZE)

    # check validate all
    if len(err_list) != 0:
        return badRequest(err_list)
    
    try:
        if file:
            # save file
            filename = f"{user['id']}.{file.filename.split('.')[-1]}"
            new_url = f"/static/image/avatar/{filename}"
            file.save(path.join(app.config["APP_PATH"], "static", "image", "avatar", filename))
            user_data.updateAVT(new_url)
        if new_username != "":
            user_data.updateName(new_username)
            
        db.session.commit()
        return success()
    except Exception as err:
        app.logger.debug(err)
        return internalErr()
        