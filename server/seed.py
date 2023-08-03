from app import app
from models import db, User, Binder

with app.app_context():
    User.query.delete()
    Binder.query.delete()

    b1 = Binder(name="1st Edition Base set")
    
    db.session.add(b1)
    db.session.commit()