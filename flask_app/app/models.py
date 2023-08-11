from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date, datetime
from app import db

media_genre_table = db.Table('media_genre_table',
    db.Column('genre_id', db.Integer, db.ForeignKey('genre.genre_id')),
    db.Column('media_id', db.Integer, db.ForeignKey('media.media_id'))  
)

all_likes = db.Table('all_likes',
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id')),
    db.Column('rmend_id', db.Integer, db.ForeignKey('rmend.rmend_id')),
    db.Column('liked', db.Boolean)
)

#USER: ID, username, email, password, joined, rmend relationship, vote relationship 
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(50), nullable = False, unique = True)
    email = db.Column(db.String(80), nullable = False, unique = True)
    pass_hash = db.Column(db.String(), nullable = False)
    joined = db.Column(db.DateTime, default = date.today())
    rmends = db.relationship('Rmend', backref = 'rmender', lazy = True)
    friends = db.Column(db.Integer, db.ForeignKey('friends.friends_id'), nullable = True)
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

class Friends(db.Model):
    friends_id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable = False)
    all_friends = db.relationship('User', backref = 'friendee', lazy = True)
    

#RMEND: ID, user Relationship, body, title, media_type, year, img, rated, date added
class Rmend(db.Model):
    rmend_id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable = False)
    title = db.Column(db.String(), nullable = False)
    year = db.Column(db.String(), nullable = False)
    rated = db.Column(db.String(), nullable = True)
    body = db.Column(db.String(), nullable = True)
    media_type = db.Column(db.String(), nullable = False)
    date_added = db.Column(db.DateTime, default = datetime.utcnow)
    img = db.Column(db.String(), nullable = True)
    rmend_for = db.Column(db.Integer, db.ForeignKey('media.media_id'), nullable = True)
    likes = db.relationship('User', secondary = all_likes, backref = 'liker')

    def fromDict(self, d):
        self.user_id = d['username']
        self.title = d['title']
        self.year = d['year']
        self.rated = d['rated']
        self.body = d['body']
        self.media_type = d['media_type']
        self.img = d['img'] 

    def to_dict(self):
        d = {
            'suggest_id' : self.suggest_id,
            'username' : self.author.username,
            'title' : self.title,
            'year' : self.year,
            'rated' : self.rated,
            'body' : self.body,
            'date_added' : self.date_added,
            'media_type' : self.media_type,
            'img' : self.img  
        }
        return d
    
    def commit(self):
        db.session.add(self)
        db.session.commit()

    def delete_suggest(self):
        db.session.delete(self)
        db.session.commit()

#MEDIA:
class Media(db.Model):
    media_id = db.Column(db.Integer, primary_key = True)
    second_id = db.Column(db.String(), nullable = True)
    title = db.Column(db.String(), nullable = False)
    year = db.Column(db.String(), nullable = False)
    format_type = db.Column(db.String(), nullable = False)
    author = db.Column(db.String(), nullable = False)
    rating = db.Column(db.Integer, nullable = True)
    description = db.Column(db.String(), nullable = True)
    img = db.Column(db.String(), nullable = False)
    genres = db.relationship('Genre', secondary = media_genre_table, backref = 'medias')

#GENRE
class Genre(db.Model):
    genre_id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(), nullable = False)



#COLLECTION: ID, user Relationship,
#class Mood(db.Model):
#    mood_id = db.Column(db.Integer, primary_key = True)
#    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable = False)
