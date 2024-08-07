
from flask import render_template, jsonify
from app.routes.page import main
from app.models.player import Player
from app import app


# lib from py
from flask import render_template, jsonify

# my lib
from app.routes.page import main
from app.models.deck import Deck
from app.models.deck_card import DeckCard
from app.models.card import Card 

@main.route("/play/<path:path>")
def play(path):
    if not path.isnumeric():
        return render_template("notfound.html")
    deck_id = int(path)
    deck_data = Deck.query.get(deck_id)
    if not deck_data:
        return render_template("notfound.html")
    
    result = {}
    result["deck_id"] = deck_id
    result["name"] = deck_data.name
    
    # query cards
    deck_card = DeckCard.query.filter_by(deck_id=deck_id)
    card_id = list(map(lambda x: x.to_dict()["card_id"], deck_card))
    card_in_deck = Card.query.filter(Card.id.in_(card_id), Card.is_deleted == False)
    result["cards"] = list(map(lambda x: x.to_dict(), card_in_deck))
    
    return render_template("play.html", deck_data=result)
#     # return render_template("play.html", deck_detail={"deck": "Hello","word":"Dog"})
#     # return "hello"

# schema = {
#     "deck_id": str,
#     "name": str,
#     "cards": [
#         {
#             "id": str,
#             "question": str,
#             "answer": str
#         }...
#     ]
# }
