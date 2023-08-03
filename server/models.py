from ipdb import set_trace
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property

db = SQLAlchemy()

class Binder(db.Model, SerializerMixin):
    __tablename__ = 'binders'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    # card_id = db.Column(db.Integer)

    serialize_rules = ('-created_at', '-updated_at', '-user_id')

# class BinderCards(db.Model, SerializerMixin):


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    _password_hash = db.Column(db.String)     

    serialize_rules = ("-_password_hash","-admin", "-created_at", "-updated_at")     

    @hybrid_property
    def password_hash(self):
        return self._password_hash 
    
    @password_hash.setter
    def password_hash(self, password):
        from app import bcrypt
        pw_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = pw_hash.decode("utf-8")

    def authenticate(self, password):
        from app import bcrypt
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))



