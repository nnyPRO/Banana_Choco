# lib from py
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone

# my lib
from app import db


class Deck(db.Model, SerializerMixin):
    __tablename__ = "decks"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    is_public = db.Column(db.Boolean, default=False)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
    create_at = db.Column(db.DateTime())
    update_at = db.Column(db.DateTime())
    is_deleted = db.Column(db.Boolean, default=False)
    delete_at = db.Column(db.DateTime())

    def __init__(self, name, is_public, user_id):

        self.name = name
        self.is_public = is_public
        self.player_id = user_id
        self.is_deleted = False
        self.delete_at = None
        self.update_at = None
        self.create_at = datetime.now(timezone.utc)

    def public_status(self, public):
        self.is_public = public
    
    def update(self, name):
        self.update_at = datetime.now(timezone.utc)
        self.name = name

    def delete(self):
        self.is_deleted = True
        self.delete_at = datetime.now(timezone.utc)
