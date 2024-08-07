# lib from py
from sqlalchemy_serializer import SerializerMixin

# my lib
from app import db

class DeckTag(db.Model, SerializerMixin):
    __tablename__ = "deck_tag"

    tag_id = db.Column(db.Integer, db.ForeignKey("tags.id"), primary_key=True)
    deck_id = db.Column(db.Integer, db.ForeignKey("decks.id"), primary_key=True)

    def __init__(self, tag_id, deck_id):
        self.tag_id = tag_id
        self.deck_id = deck_id