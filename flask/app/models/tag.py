# lib from py
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone

# my lib
from app import db

class Tag(db.Model, SerializerMixin):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    create_at = db.Column(db.DateTime())
    is_deleted = db.Column(db.Boolean, default=False)
    delete_at = db.Column(db.DateTime())

    def __init__(self, name):
        self.name = name
        self.is_deleted = False
        self.create_at = datetime.now(timezone.utc)
        self.delete_at = None
    
    def update(self, name):
        self.name = name
    
    def delete(self):
        self.is_deleted = True
        self.delete_at = datetime.now(timezone.utc)