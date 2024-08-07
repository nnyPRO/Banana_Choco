# lib from py
from flask import request

# my lib
from app.routes.login import login_b
from app.models.player import Player
from app import db
from app.lib.validate import emailValidate, lengthCheck, EMAIL_ERR, PASS_LEN, USERNAME_LEN, PASS_NOT_EQUAL, BODY_NOT_CORRECT, EMAIL_ALREADY
from app.lib.request import badRequest, success

@login_b.route("/register", methods=["POST"])
def register():
    # check form body
    try:
        body = request.get_json()
        username, email, password, c_password = body["username"], body["email"], body["password"], body["c_password"]
    except Exception as err:
        print(err)
        return badRequest([BODY_NOT_CORRECT])
    
    user = Player.query.filter_by(email=email).first()
    
    if not user:
        # validate form
        fail_form = []
        if not emailValidate(email):
            fail_form.append(EMAIL_ERR)
        if not lengthCheck(password):
            fail_form.append(PASS_LEN)
        if not lengthCheck(username):
            fail_form.append(USERNAME_LEN)
        if password != c_password:
            fail_form.append(PASS_NOT_EQUAL)
        if len(fail_form) != 0:
            return badRequest(fail_form)

        db.session.add(Player(email, username, password))
        db.session.commit()
        return success()
    else:
        return badRequest([EMAIL_ALREADY])