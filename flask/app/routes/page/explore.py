
from flask import jsonify, render_template, redirect, url_for, flash, request, redirect
from app.routes.page import main
from app.models.deck import Deck
from app import app


@main.route("/explore",  methods=('GET', 'POST'))
def explore():
    
    return render_template("explore.html")


