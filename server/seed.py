from app import app
from models import db, User, Binder

with app.app_context():
    User.query.delete()
    Binder.query.delete()

    binders = []

    b1 = Binder(name="1st Edition Base set")
    binders.append(b1)

    b2 = Binder(name="Paldea Evolved Collection")
    binders.append(b2)

    b3 = Binder(name="Crown Zenith Rares")
    binders.append(b3)

    b4 = Binder(name="My random cards")
    binders.append(b4)

    db.session.add_all(binders)
    db.session.commit()