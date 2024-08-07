# lib from py
from flask import render_template

# my lib
from app import app

@app.route("/<path:path>")
def not_found(path):
    return render_template('notfound.html')