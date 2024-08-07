# lib from py
from os import getenv, path
from flask import Flask, session
from werkzeug.debug import DebuggedApplication
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_client import OAuth

# my lib
from app.middleware.page.authen import authen_page
from app.middleware.api.authen import authen_api

app = Flask(__name__, static_folder='static', template_folder='template')
app.url_map.strict_slashes = False

app.jinja_options = app.jinja_options.copy()
app.jinja_options.update({
    'trim_blocks': True,
    'lstrip_blocks': True
})

app.config['APP_PATH'] = path.dirname(path.realpath(__file__))
app.config['DEBUG'] = False
app.config['SECRET_KEY'] = getenv("SECRET_KEY", None)
app.config['JSON_AS_ASCII'] = False
app.config['GOOGLE_CLIENT_ID'] = getenv("GOOGLE_CLIENT_ID", None)
app.config['GOOGLE_CLIENT_SECRET'] = getenv("GOOGLE_CLIENT_SECRET", None)
app.config['GOOGLE_DISCOVERY_URL'] = getenv("GOOGLE_RECOVERY", None)
app.config['FB_CLIENT_ID']= getenv("FB_CLIENT_ID", None)
app.config['FB_CLIENT_SECRET'] = getenv("FB_CLIENT_SECRET", None)

app.config['SQLALCHEMY_DATABASE_URI'] = getenv("DATABASE_URL", "sqlite://")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

if app.debug:
    app.wsgi_app = DebuggedApplication(app.wsgi_app, evalex=True)

# Creating an SQLAlchemy instance
db = SQLAlchemy(app)
oauth = OAuth(app)

# from app import route  # noqa
from app.routes.page import notfound
from app.routes.page import main
from app.routes.api import api
from app.routes.login import login_b
app.before_request_funcs = {
    "main": [authen_page],
    "api": [authen_api]
}

app.register_blueprint(main)
app.register_blueprint(api)
app.register_blueprint(login_b)