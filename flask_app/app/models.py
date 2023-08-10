from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date, datetime
from app import db

#USER: ID, username, email, password, joined, post relationship, vote relationship 
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(50), nullable = False, unique = True)
    email = db.Column(db.String(80), nullable = False, unique = True)
    pass_hash = db.Column(db.String(), nullable = False)
    joined = db.Column(db.DateTime, default = date.today())
    suggestions = db.relationship('Suggest', backref = 'author', lazy = True)
    #moods = db.relationship('Mood', backref = 'creator', lazy = True)
    

    def __repr__(self):
        return f'USER: {self.username}'
    
    def commit(self):
        db.session.add(self)
        db.session.commit()

    def delete_user(self):
        db.session.delete(self)
        db.session.commit()
    
    def get_id(self):
        return str(self.user_id)
    
    def hash_password(self, password):
        self.pass_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.pass_hash, password)
    
    def from_dict(self, d):
        self.username  = d['username']
        self.email  = d['email']
        self.pass_hash  = d['password']
        self.hash_password(self.pass_hash)  

    def to_dict(self):
        d = {
            'user_id' : self.user_id,
            'username' : self.username,
            'email' : self.email,
            'joined' : self.joined
        }
        return d

#POST: ID, user Relationship, body, title, media_type, year, img, rated, date added
class Suggest(db.Model):
    suggest_id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable = False)
    title = db.Column(db.String(), nullable = False)
    year = db.Column(db.String(4), nullable = False)
    rated = db.Column(db.Integer, nullable = False)
    body = db.Column(db.String(), nullable = False)
    media_type = db.Column(db.String(), nullable = False)
    date_added = db.Column(db.DateTime, default = datetime.utcnow)
    img = db.Column(db.String(), nullable = True)
    
#COLLECTION: ID, user Relationship,
#class Mood(db.Model):
#    mood_id = db.Column(db.Integer, primary_key = True)
#    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable = False)
