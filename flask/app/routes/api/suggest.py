# python lib
from flask import request
from sqlalchemy import func
from urllib.request import urlopen
from json import load

# my lib
from app import db
from app.routes.api import api
from app.models.card import Card
from app.models.deck import Deck
from app.models.deck_card import DeckCard
from app.lib.token import getDataFromSession
from app.lib.request import successBody

# Written by Auttakorn Camsoi
# route for get a suggest
@api.route("/suggest")
def suggest():
    user_data = getDataFromSession()
    # print(user_data.id)
    word = request.args.get("search")

    result = {"owner": [], "other": [], "dict": []}

    # select our
    own_card = Card.query.filter(func.lower(Card.question) == func.lower(word), Card.player_id == user_data["id"], Card.is_deleted == False)
    result["owner"] = list(map(lambda x: x.to_dict(), own_card))

    # select dict
    try:
        dict_res = urlopen(f"https://api.dictionaryapi.dev/api/v2/entries/en/{str(word).lower()}")
        dict_json = load(dict_res)
    except:
        dict_json = []

    # print(dict_json)
    list_word = []
    for word_detail in dict_json:
        list_word+=dictAPIParse(word_detail)
    # print(list_word)
    all_dict_card = Card.query.filter(func.lower(Card.question) == func.lower(word), Card.form_dict == True)
    all_dict_card = list(map(lambda x: x.to_dict()["answer"], all_dict_card))
    list_word = list(filter(lambda x: x["answer"] not in all_dict_card, list_word))
    for new_word in list_word:
        if len(new_word["answer"]) > 300:
            continue
        db.session.add(Card(new_word["question"], new_word["answer"], None, True))
    db.session.commit()

    all_dict_card = Card.query.filter(func.lower(Card.question) == func.lower(word), Card.form_dict == True)
    result["dict"] = list(map(lambda x: x.to_dict(), all_dict_card))

    # select other
    all_card = Card.query.filter(func.lower(Card.question) == func.lower(word), Card.player_id != user_data["id"], Card.is_deleted == False)
    all_card = list(map(lambda x: x.to_dict(), all_card))
    for card_info in all_card:
        deck_card = DeckCard.query.filter_by(card_id=card_info["id"])
        all_decks = list(map(lambda x: x.to_dict()["deck_id"], deck_card))
        for deck_id in all_decks:
            deck_info = Deck.query.get(deck_id)
            if deck_info.is_public:
                result["other"].append(card_info)
                break

    return successBody(result)

def dictAPIParse(word_detail):
    word = word_detail["word"]
    
    list_word = []

    for meaning in word_detail["meanings"]:
        list_word += list(map(lambda x: { "question": word, "answer": f"({meaning['partOfSpeech']}) {x['definition']}" }, meaning["definitions"]))
        
    return list_word