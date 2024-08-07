from flask import Blueprint

main = Blueprint("main", __name__, url_prefix="/")

from app.routes.page import home, explore, add, play, profile, edit

