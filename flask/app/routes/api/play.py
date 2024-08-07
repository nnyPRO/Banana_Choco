from flask import jsonify, render_template, redirect, url_for, flash, request, redirect
from app.routes.api import api
from app.models.deck import Deck
from app import app
from app.models.player import Player
from app.models.deck_card import DeckCard
from app.models.card import Card
# python lib
from sqlalchemy import func
from app.lib.token import getDataFromSession
from app.lib.request import successBody


@api.route("/play/decks")
def play_db_decks():
    decks = []
    db_decks = Deck.query.all()

    decks = list(map(lambda x: x.to_dict(), db_decks))
    app.logger.debug("DB decks: " + str(decks))

    # return jsonify(decks)
    return decks




@api.route("/play/decks/cards")
def play_db_decks_cards():
    decks_cards = []
    db_decks_cards = DeckCard.query.all()
    # app.logger.debug("db_decks_cards:", db_decks_cards)
    decks_cards = list(map(lambda x: x.to_dict(), db_decks_cards))
    # app.logger.debug("DB decks_cards: " + str(decks_cards))

    # return jsonify(decks_cards)
    return decks_cards


@api.route("/play/cards")
def play_db_cards():
    cards = []
    db_cards = Card.query.all()
    # app.logger.debug("db_decks_cards:", db_decks_cards)
    cards = list(map(lambda x: x.to_dict(), db_cards))
    # app.logger.debug("DB cards: " + str(cards))

    # return jsonify(decks_cards)
    return cards


@api.route("/play/all/decks")
def play_check_card_in_deck():

    decks = play_db_decks()
    decks_cards = play_db_decks_cards()
    cards = play_db_cards()

    each_deck = []
    # ลูปแต่ละ deck
    for i in range(len(decks)):
        id_deck = decks[i]['id']
        dict_deck = {}
        card_in_deck = {}
        num_card = 0
        # ดูแต่ละคู่ของ deck และ card
        for j in decks_cards:
            # ดูว่าใน deck นี้มี card อะไรบ้างจาก decks_cards
            if j['deck_id'] == id_deck:
                num_card += 1
                for k in cards:
                    if k['id'] == j['card_id']:
                        question = k['question']
                        answer = k['answer']
                        card_in_deck[question] = answer
                        # card_in_deck['answer'] = answer
        dict_deck['cards'] = card_in_deck
        dict_deck['num_card'] = num_card
        dict_deck['name'] = decks[i]['name']

        # for j in players:
        #     if decks[i]['player_id'] == j['id']:
        #         dict_deck['player_name'] = j['name']
        each_deck.append(dict_deck)

    app.logger.debug("decks:", each_deck)
    return jsonify(each_deck)