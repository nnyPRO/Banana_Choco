# my lib
from app import db
from app.models.deck import Deck
from app.models.deck_card import DeckCard
from app.models.deck_tag import DeckTag
from app.models.card import Card
from app.models.tag import Tag
from app.lib.request import badRequest, successBody
from app.lib.check import checkDictKey, checkListDictKey
from app.lib.validate import BODY_NOT_CORRECT

# Written By Auttakorn Camsoi
# Function for create deck
def create_deck(body, user_data):
    # validate body
    if not body:
        return badRequest(BODY_NOT_CORRECT)
    body_keylist = ["title", "is_public", "tags", "cards"]
    tag_keylist = ["dbid", "tag"]
    card_keylist = ["is_recom", "own_recom", "edit_origin", "ref", "question", "answer"]
    if not checkDictKey(body, body_keylist) \
        or not checkListDictKey(body["tags"], tag_keylist) \
        or not checkListDictKey(body["cards"], card_keylist):
        return badRequest(BODY_NOT_CORRECT)
    
    # create Deck
    new_deck = Deck(body["title"], body["is_public"], user_data["id"])
    db.session.add(new_deck)
    
    # create Tag
    tag_list = []
    new_tag_list = []
    for tag in body["tags"]:
        if tag["dbid"] == 0:
            new_tag = Tag(tag["tag"])
            new_tag_list.append(new_tag)
            db.session.add(new_tag)
        else:
            tag_list.append(tag["dbid"])
    db.session.flush() # get all new tag and deck id
    tag_list += list(map(lambda x: x.id, new_tag_list))
    db.session.commit()
    for tag in tag_list:
        db.session.add(DeckTag(tag, new_deck.id))
    db.session.commit()

    # create Card
    card_list = []
    new_card_list = []

    ref_set = set()
    err_card = []

    for card in body["cards"]:
        # check for repeat card
        if card["is_recom"] and card["ref"] in ref_set:
            err_card.append(card)
            continue
        else:
            ref_set.add(card["ref"])
        
        if card["is_recom"]:
            if card["own_recom"] and card["edit_origin"]:
                to_edit = Card.query.get(card["ref"])
                if to_edit.player_id == user_data["id"]:
                    
                    # Select all deck that contain this card
                    all_deck_card = DeckCard.query.filter_by(card_id=to_edit.id)
                    all_deck_card_id = list(map(lambda x: x.to_dict()["deck_id"], all_deck_card))
                    
                    # Select all deck that contain this card and is owner
                    all_deck_data = Deck.query.filter(Deck.id.in_(all_deck_card_id), Deck.player_id==user_data["id"])
                    all_deck_data_id = list(map(lambda x: x.to_dict()["id"], all_deck_data))
                    all_deck_data_len = len(all_deck_data_id)
                    
                    # if not equal so it going to duplicate new for our.
                    if len(all_deck_card_id) != all_deck_data_len:
                        new_card = Card(card["question"], card["answer"], user_data["id"])
                        db.session.add(new_card)
                        db.session.flush()
                        db.session.commit()
                        deck_card_owner = DeckCard.query.filter(DeckCard.deck_id.in_(all_deck_data_id), DeckCard.card_id == to_edit.id)
                        card_list.append(new_card.id)
                        for i in deck_card_owner:
                            i.update(new_card.id)
                    else:
                        card_list.append(card["ref"])
                        to_edit.update(card["question"], card["answer"])
                    
                    db.session.commit()
            elif not card["own_recom"] and not card["edit_origin"]:
                new_card = Card(card["question"], card["answer"], user_data["id"])
                new_card_list.append(new_card)
                db.session.add(new_card)
            elif card["ref"] == -1:
                new_card = Card(card["question"], card["answer"], None, True)
                new_card_list.append(new_card)
                db.session.add(new_card)
            else:
                card_list.append(card["ref"])
        else:
            new_card = Card(card["question"], card["answer"], user_data["id"])
            new_card_list.append(new_card)    
            db.session.add(new_card)

    db.session.flush()
    card_list += list(map(lambda x: x.id, new_card_list))
    
    for card in card_list:
        db.session.add(DeckCard(card, new_deck.id))
    db.session.commit()
    return successBody(err_card)

# Schema

# body = {
#     "title": str,
#     "is_public": bool,
#     "tags": [
#         {
#             "dbid": int, # 0 if new
#             "tag": str # tagname
#         }, #...
#     ],
#     "cards": [
#         {
#             "is_recom": bool,
#             "own_recom": bool,
#             "edit_origin": bool,
#             "ref": int # card id
#             "question": str
#             "answer": str
#         }, # ...
#     ]
# }