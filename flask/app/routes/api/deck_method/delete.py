
from app.models.deck import Deck
from app.models.deck_card import DeckCard
from app.models.deck_tag import DeckTag
from app.lib.request import badRequest, success
from app import db

def delete_deck(deck_id:str, user_data):
    if not deck_id.isnumeric():
        return badRequest("Not found deck")
    deck_id = int(deck_id)
    to_delete_deck = Deck.query.filter(Deck.id==deck_id,
                      Deck.is_deleted==False,
                      Deck.player_id==user_data["id"]).first()
    if not to_delete_deck:
        return badRequest("Not found deck")
    else:
        to_delete_deck.delete()
        db.session.commit()
        to_delete_deck_card = DeckCard.query.filter(DeckCard.deck_id==deck_id)
        for i in to_delete_deck_card:
            db.session.delete(i)
        db.session.commit()

        to_delete_deck_tag = DeckTag.query.filter(DeckTag.deck_id==deck_id)
        for i in to_delete_deck_tag:
            db.session.delete(i)
        db.session.commit()
        return success()
