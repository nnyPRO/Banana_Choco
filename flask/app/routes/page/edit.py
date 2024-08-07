# python lib
from flask import render_template
from json import dumps

# my lib
from app.routes.page import main
from app.models.deck import Deck
from app.models.deck_card import DeckCard
from app.models.card import Card
from app.models.deck_tag import DeckTag
from app.models.tag import Tag
from app.lib.token import getDataFromSession

# Written by Auttakorn Camsoi
# edit deck page
@main.route("/edit/<path:path>")
def edit_deck(path):
    user_data = getDataFromSession()

    # deck_id is invalid
    if not path.isnumeric():
        return render_template("notfound.html")
    deck_id = int(path)
    deck_detail = Deck.query.get(deck_id)

    # this deck id doesn't exit
    if not deck_detail or deck_detail.player_id!=user_data["id"]:
        return render_template("notfound.html")

    result = {}
    result["deck_id"] = deck_detail.id
    result["name"] = deck_detail.name
    result["is_public"] = deck_detail.is_public
    
    # query Card
    card_in_deck = DeckCard.query.filter_by(deck_id=deck_detail.id).order_by(DeckCard.card_id)
    card_id = list(map(lambda x: x.to_dict()["card_id"], card_in_deck))
    all_card_in_deck = Card.query.filter(Card.id.in_(card_id), Card.is_deleted == False)
    result["cards"] = list(map(lambda x: { **x.to_dict(), "is_own": x.player_id==user_data["id"] }, all_card_in_deck))

    # query Tag
    tag_in_deck = DeckTag.query.filter_by(deck_id=deck_detail.id).order_by(DeckTag.tag_id)
    tag_id = list(map(lambda x: x.to_dict()["tag_id"], tag_in_deck))
    all_tag_in_deck = Tag.query.filter(Tag.id.in_(tag_id), Tag.is_deleted == False)
    result["tags"] = list(map(lambda x: x.to_dict(), all_tag_in_deck))

    # print(result)

    return render_template("edit.html", deck_data=result)

# schema = {
#     "deck_id": str,
#     "name": str,
#     "is_public": bool
#     "cards": [
#         {
#             "id": int,
#             "question": str,
#             "answer": str
#             "player_id": int,
#             "form_dict": bool
#         } #...
#     ],
#     "tags": [
#         {
#             "id": int,
#             "name": str
#         }
#     ]
# }