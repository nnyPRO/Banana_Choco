# lib from py
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone

# my lib
from app import db

class Card(db.Model, SerializerMixin):
    __tablename__ = "cards"
    
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String())
    answer = db.Column(db.String())
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
    form_dict = db.Column(db.Boolean, default=False)
    create_at = db.Column(db.DateTime())
    update_at = db.Column(db.DateTime())
    is_deleted = db.Column(db.Boolean, default=False)
    delete_at = db.Column(db.DateTime())

    def __init__(self, question, answer, player_id, form_dict=False):
        self.question = question
        self.answer = answer
        self.player_id = player_id
        self.is_deleted = False
        self.delete_at = None
        self.update_at = None
        self.form_dict = form_dict
        self.create_at = datetime.now(timezone.utc)
    
    def update(self, question, answer):
        self.update_at = datetime.now(timezone.utc)
        self.question = question
        self.answer = answer
    
    def delete(self):
        self.is_deleted = True
        self.delete_at = datetime.now(timezone.utc)