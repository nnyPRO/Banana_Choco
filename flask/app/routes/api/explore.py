# write by Mesanee Laihueang 650510676


# python lib
from flask import jsonify, request

from app.routes.api import api
from app.models.deck import Deck
from app import app, db
from app.models.player import Player
from app.models.deck_card import DeckCard
from app.models.card import Card
from app.lib.token import getDataFromSession
from app.lib.request import badRequest, successBody
from app.models.tag import Tag
from app.models.deck_tag import DeckTag


@api.route("/explore/decks")
def explore_db_decks():
    decks = []
    db_decks = Deck.query.all()

    decks = list(map(lambda x: x.to_dict(), db_decks))
    app.logger.debug("DB decks: " + str(decks))

    return jsonify(decks)
    # return decks
    
    
# @api.route("/explore/tags")
# def explore_db_tags():
#     tags = []
#     db_tags = Tag.query.all()
#     tags = list(map(lambda x: x.to_dict(), db_tags))
#     # app.logger.debug("DB cards: " + str(cards))

#     return jsonify(decks_cards)
    # return tags


# @api.route("/explore/players")
def explore_db_player():
    players = []
    db_players = Player.query.all()

    players = list(map(lambda x: x.to_dict(), db_players))
    # app.logger.debug("DB players: " + str(players))

    # return jsonify(players)
    return players


# @api.route("/explore/decks/cards")
def explore_db_decks_cards():
    decks_cards = []
    db_decks_cards = DeckCard.query.all()
    # app.logger.debug("db_decks_cards:", db_decks_cards)
    decks_cards = list(map(lambda x: x.to_dict(), db_decks_cards))
    # app.logger.debug("DB decks_cards: " + str(decks_cards))

    # return jsonify(decks_cards)
    return decks_cards


# @api.route("/explore/cards")
def explore_db_cards():
    cards = []
    db_cards = Card.query.all()
    # app.logger.debug("db_decks_cards:", db_decks_cards)
    cards = list(map(lambda x: x.to_dict(), db_cards))
    # app.logger.debug("DB cards: " + str(cards))

    # return jsonify(decks_cards)
    return cards


# @api.route("/explore/decks/tags")
def explore_db_decks_tags():
    decks_tags = []
    db_decks_tags = DeckTag.query.all()
    # app.logger.debug("db_decks_cards:", db_decks_cards)
    decks_tags = list(map(lambda x: x.to_dict(), db_decks_tags))
    # app.logger.debug("DB decks_cards: " + str(decks_cards))

    # return jsonify(decks_cards)
    return decks_tags


@api.route("/explore/all/decks/cards")
def get_card_deck():
    deck_id = request.args.get("id")
    if not deck_id:
        return badRequest(["ID_NOT_FOUND"])

    if not deck_id.isnumeric():
        return badRequest(["VALID_ID"])

    deck_id = int(deck_id)
    all_card_id = DeckCard.query.filter(DeckCard.deck_id==deck_id)
    all_card_id = list(map(lambda x: x.to_dict()["card_id"], all_card_id))
    all_card = Card.query.filter(Card.id.in_(all_card_id), Card.is_deleted==False)
    return successBody(list(map(lambda x: x.to_dict(), all_card)))
    
@api.route("/explore/copy")
def copy_deck():
    user_data = getDataFromSession()
    deck_id = request.args.get("id")
    if not deck_id:
        return badRequest(["ID_NOT_FOUND"])

    if not deck_id.isnumeric():
        return badRequest(["VALID_ID"])

    deck_id = int(deck_id)
    deck_data = Deck.query.filter(Deck.id==deck_id, Deck.is_public==True, Deck.is_deleted==False).first()
    if not deck_data:
        return badRequest(["ID_NOT_FOUND"])
    
    my_deck = Deck(deck_data.name, False, user_data["id"])
    db.session.add(my_deck)
    db.session.flush()
    db.session.commit()

    deck_card = DeckCard.query.filter_by(deck_id=deck_id)
    cards_id = list(map(lambda x: x.to_dict()["card_id"], deck_card))

    for card_id in cards_id:
        db.session.add(DeckCard(card_id, my_deck.id))
    db.session.commit()
    return successBody(my_deck.id)
    

@api.route("/explore/all/decks")
def check_card_in_deck():
    user_data = getDataFromSession()
    all_public_deck = Deck.query.filter(Deck.player_id!=user_data["id"], Deck.is_public==True, Deck.is_deleted==False)
    
    
    # decks = []
    # db_decks = Deck.query.all()
    # decks = list(map(lambda x: x.to_dict(), db_decks))
    # tags = []
    # db_tags = Tag.query.all()
    # tags = list(map(lambda x: x.to_dict(), db_tags))
    
    # players = explore_db_player()
    # decks_cards = explore_db_decks_cards()
    # cards = explore_db_cards()
    # decks_tags = explore_db_decks_tags()

    # each_deck = []
    # # ลูปแต่ละ deck
    # for i in range(len(decks)):
    #     id_deck = decks[i]['id']
    #     dict_deck = {}
    #     card_in_deck = {}
    #     tag_in_deck = {}
    #     num_card = 0
    #     # ดูแต่ละคู่ของ deck และ card
    #     for j in decks_cards:
    #         # ดูว่าใน deck นี้มี card อะไรบ้างจาก decks_cards
    #         if j['deck_id'] == id_deck:
    #             num_card += 1
    #             for k in cards:
    #                 if k['id'] == j['card_id']:
    #                     question = k['question']
    #                     answer = k['answer']
    #                     card_in_deck[question] = answer
    #                     # card_in_deck['answer'] = answer
        
    #     dict_deck['cards'] = card_in_deck
    #     dict_deck['num_card'] = num_card
    #     dict_deck['name'] = decks[i]['name']

    #     for j in players:
    #         if decks[i]['player_id'] == j['id']:
    #             dict_deck['player_name'] = j['name']
    #             dict_deck['avatar_url'] = j['avatar_url']
                
    #     index = 0
    #     # ดูแต่ละคู่ของ deck และ tag
    #     for j in decks_tags:
            
    #         # ดูว่าใน deck นี้มี tag อะไรบ้างจาก decks_tags
    #         if j['deck_id'] == id_deck:
    #             for k in tags:
    #                 if k['id'] == j['tag_id']:
    #                     tag_in_deck[index] = k['name']
    #                     index+=1
    #                     # card_in_deck['answer'] = answer
                        
    #     dict_deck['tags'] = tag_in_deck       

    #     each_deck.append(dict_deck)

    # app.logger.debug("decks:", each_deck)
    return jsonify(list(map(getDeckDetail, all_public_deck)))

def getDeckDetail(deck:Deck):
    player = Player.query.get(deck.player_id)
    if not player:
        return None
    
    cards = DeckCard.query.filter(DeckCard.deck_id==deck.id)
    tags = DeckTag.query.filter(DeckTag.deck_id==deck.id)
    tags = list(map(lambda x: x.to_dict()["tag_id"], tags))
    tags_name = Tag.query.filter(Tag.id.in_(tags))

    result = {
        "id": deck.id,
        "avatar_url": player.avatar_url,
        "player_name": player.name,
        "name": deck.name,
        "tags": list(map(lambda x: x.to_dict()["name"], tags_name)),
        "num_card": len(list(map(lambda x: x.to_dict(), cards)))
    }

    return result