# my lib
from app import db
from app.models.deck_tag import DeckTag
from app.models.deck import Deck
from app.models.deck_card import DeckCard
from app.models.card import Card
from app.models.tag import Tag
from app.lib.request import badRequest, success

# Written By Auttakorn Camsoi
# function for Update Deck
def updateDeck(data, user_data):
    deck_data = Deck.query.get(data["id"])
    if not deck_data:
        return badRequest(["DECK_ID"])
    
    deck_data.public_status(data["is_public"])
    deck_data.update(data["title"])
    db.session.commit()

    # tag manage
    deck_tags = DeckTag.query.filter_by(deck_id=data["id"])
    tags_id = list(map(lambda x: x.to_dict()["tag_id"], deck_tags))

    new_tags = []
    ptr_tags = []
    old_tags = []
    for tag in data["tags"]:
        if tag["dbid"] == 0:
            new_tag = Tag(tag["tag"])
            new_tags.append(new_tag)
            db.session.add(new_tag)
        else:
            if tag["dbid"] not in tags_id:
                ptr_tags.append(tag["dbid"])
            else:
                old_tags.append(tag["dbid"])
    
    db.session.flush()
    # have delete old
    if len(old_tags) != len(tags_id):
        for tag in tags_id:
            if tag not in old_tags:
                deck_tag = DeckTag.query.filter(DeckTag.tag_id==tag, DeckTag.deck_id==data["id"]).first()
                db.session.delete(deck_tag)
    
    for ptr_tag in ptr_tags:
        db.session.add(DeckTag(ptr_tag, data["id"]))
    
    for new_tag in new_tags:
        db.session.add(DeckTag(new_tag.id, data["id"]))

    db.session.commit()

    for delete_card in data["deleted"]:
        delete_card_db = DeckCard.query.filter(DeckCard.card_id==delete_card, DeckCard.deck_id==deck_data.id).first()
        db.session.delete(delete_card_db)
    db.session.commit()

    # card manager
    new_cards = []
    for card in data["cards"]:
        if card["old_id"]!=0 and card["old_id"] != card["ref"]:
            to_delete = DeckCard.query.filter(DeckCard.card_id==card["old_id"], DeckCard.deck_id==deck_data.id).first()
            db.session.delete(to_delete)
            db.session.commit()
            if card["edit_origin"]:
                if card["own_recom"]:
                    # delete old form deck
                    
                    # check for other user use
                    decks = DeckCard.query.filter_by(card_id=card["ref"])
                    card_decks = list(map(lambda x: x.to_dict()["deck_id"], decks))
                    is_repeat = False
                    for deck in card_decks:
                        deck = Deck.query.get(deck)
                        if not deck or deck.player_id!=user_data["id"]:
                            new_card = Card(card["question"], card["answer"], user_data["id"])
                            db.session.add(new_card)
                            db.session.flush()
                            db.session.commit()
                            all_my_deck_card = Deck.query.filter(Deck.id.in_(card_decks), Deck.player_id==user_data["id"])
                            all_my_deck_card_id = list(map(lambda x: x.to_dict()["id"], all_my_deck_card))
                            for deck_id in all_my_deck_card_id:
                                deck_ = DeckCard.query.filter(DeckCard.card_id==card["ref"], DeckCard.deck_id==deck_id)
                                deck_.update(new_card.id)
                                db.session.commit()
                            is_repeat = True
                            break
                    if not is_repeat:
                        db_card = Card.query.get(card["ref"])
                        db_card.update(card["question"], card["answer"])
                        db.session.commit()
                else:
                    new_card = Card(card["question"], card["answer"], user_data["id"])
                    db.session.add(new_card)
                    new_cards.append(new_card)
            else:
                ptr = DeckCard(card["ref"], deck_data.id)
                db.session.add(ptr)
                db.session.commit()
        else:
            if card["is_edited"]=="t":
                if card["edit_origin"]:
                    if card["own_recom"]:
                        # check for other user use
                        decks = DeckCard.query.filter_by(card_id=card["ref"])
                        card_decks = list(map(lambda x: x.to_dict()["deck_id"], decks))
                        is_repeat = False
                        for deck in card_decks:
                            deck = Deck.query.get(deck)
                            if not deck or deck.player_id!=user_data["id"]:
                                new_card = Card(card["question"], card["answer"], user_data["id"])
                                db.session.add(new_card)
                                db.session.flush()
                                db.session.commit()
                                all_my_deck_card = Deck.query.filter(Deck.id.in_(card_decks), Deck.player_id==user_data["id"])
                                all_my_deck_card_id = list(map(lambda x: x.to_dict()["id"], all_my_deck_card))
                                for deck_id in all_my_deck_card_id:
                                    deck_ = DeckCard.query.filter(DeckCard.card_id==card["ref"], DeckCard.deck_id==deck_id)
                                    deck_.update(new_card.id)
                                    db.session.commit()
                                is_repeat = True
                                break
                        if not is_repeat:
                            db_card = Card.query.get(card["ref"])
                            db_card.update(card["question"], card["answer"])
                            db.session.commit()
                    else:
                        cur_card = DeckCard.query.filter(DeckCard.card_id==card["old_id"], DeckCard.deck_id==deck_data.id).first()
                        db.session.delete(cur_card)
                        db.session.commit()
                        new_card = Card(card["question"], card["answer"], user_data["id"])
                        db.session.add(new_card)
                        new_cards.append(new_card)
                else:
                    cur_card = DeckCard.query.filter(DeckCard.card_id==card["old_id"], DeckCard.deck_id==deck_data.id).first()
                    db.session.delete(cur_card)
                    db.session.commit()
                    new_card = Card(card["question"], card["answer"], user_data["id"])
                    db.session.add(new_card)
                    new_cards.append(new_card)
            else:
                if card["is_recom"]:
                    if card["edit_origin"]:
                        if card["own_recom"]:
                            # check for other user use
                            decks = DeckCard.query.filter_by(card_id=card["ref"])
                            card_decks = list(map(lambda x: x.to_dict()["deck_id"], decks))
                            is_repeat = False
                            for deck in card_decks:
                                deck = Deck.query.get(deck)
                                if not deck or deck.player_id!=user_data["id"]:
                                    new_card = Card(card["question"], card["answer"], user_data["id"])
                                    db.session.add(new_card)
                                    db.session.flush()
                                    db.session.commit()
                                    all_my_deck_card = Deck.query.filter(Deck.id.in_(card_decks), Deck.player_id==user_data["id"])
                                    all_my_deck_card_id = list(map(lambda x: x.to_dict()["id"], all_my_deck_card))
                                    for deck_id in all_my_deck_card_id:
                                        deck_ = DeckCard.query.filter(DeckCard.card_id==card["ref"], DeckCard.deck_id==deck_id)
                                        deck_.update(new_card.id)
                                        db.session.commit()
                                    is_repeat = True
                                    break
                            if not is_repeat:
                                db_card = Card.query.get(card["ref"])
                                db_card.update(card["question"], card["answer"])
                                db.session.commit()
                        else:
                            new_card = Card(card["question"], card["answer"], user_data["id"])
                            db.session.add(new_card)
                            new_cards.append(new_card)
                    else:
                        ptr = DeckCard(card["ref"], deck_data.id)
                        db.session.add(ptr)
                        db.session.commit()
                else:
                    print("Hello Im in.")
                    new_card = Card(card["question"], card["answer"], user_data["id"])
                    db.session.add(new_card)
                    new_cards.append(new_card)

    db.session.flush()
    db.session.commit()
    for new_card in new_cards:
        db.session.add(DeckCard(new_card.id, deck_data.id))
    db.session.commit()

    return success()


# schema = {
#     id: int
#     cards: [
#         {
#             answer: str,
#             question: str,
#             edit_origin: bool,
#             is_edited: "t", "n",
#             is_recom: bool,
#             own_recom: bool,
#             ref: int,
#             old_id: int,
#         }, ...   
#     ],
#     deleted: [int],
#     is_public: bool,
#     tags: [
#         {
#             dbid: int 0 if not in db,
#             tag: str
#         }...
#     ],
#     title: str
# }