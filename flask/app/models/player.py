# lib from py
from sqlalchemy_serializer import SerializerMixin
from bcrypt import gensalt, hashpw
from datetime import datetime, timezone

# my lib
from app import db

# Model of User
class Player(db.Model, SerializerMixin):
    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(100))
    password = db.Column(db.String(255))
    avatar_url = db.Column(db.String(255))
    create_at = db.Column(db.DateTime())
    update_at = db.Column(db.DateTime())

    def __init__(self, email:str, username:str, password:str):
        self.email = email
        self.name = username
        self.password = hashpw(password.encode(), gensalt()).decode()
        self.avatar_url = f'https://ui-avatars.com/api/?name={email[0]}+{email[1]}&background=f6d394&color=725c3a'
        self.create_at = datetime.now(timezone.utc)
    
    def updateAVT(self, avatar_url):
        self.avatar_url = avatar_url
        self.update_at = datetime.now(timezone.utc)
    
    def updateName(self, name:str):
        self.name = name
        self.update_at = datetime.now(timezone.utc)

    def updatePass(self, password:str, _bycrypt=True):
        if _bycrypt:
            self.password = hashpw(password.encode(), gensalt()).decode()
        else:
            self.password = password
    