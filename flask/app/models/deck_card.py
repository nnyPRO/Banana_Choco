# lib from py
from sqlalchemy_serializer import SerializerMixin

# my lib
from app import db


class DeckCard(db.Model, SerializerMixin):
    __tablename__ = "deck_card"

    card_id = db.Column(db.Integer, db.ForeignKey(
        "cards.id"), primary_key=True)
    deck_id = db.Column(db.Integer, db.ForeignKey(
        "decks.id"), primary_key=True)

    def __init__(self, card_id, deck_id):
        self.card_id = card_id
        self.deck_id = deck_id

    def update(self, card_id):
        self.card_id = card_id
