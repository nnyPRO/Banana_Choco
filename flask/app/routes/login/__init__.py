# python lib
from flask import Blueprint

login_b = Blueprint("login", __name__, url_prefix="/api")

from app.routes.login import fb_login, \
    google_login, \
    login, \
    logout, \
    register