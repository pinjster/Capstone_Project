from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date, datetime
from app import db

rmend_genre_table = db.Table('rmend_genre_table',
    db.Column('genre_id', db.Integer, db.ForeignKey('genre.genre_id')),
    db.Column('rmend_id', db.Integer, db.ForeignKey('rmend.rmend_id'))  
)

all_likes = db.Table('all_likes',
    db.Column('user_liked', db.Integer, db.ForeignKey('user.user_id')),
    db.Column('liked_rmend', db.Integer, db.ForeignKey('rmend.rmend_id'))
)

follow_table = db.Table('follow_table',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.user_id')),
    db.Column('follows_id', db.Integer, db.ForeignKey('user.user_id'))
)


#USER: ID, username, email, password, joined, rmend relationship, vote relationship 
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(50), nullable = False, unique = True)
    email = db.Column(db.String(80), nullable = False, unique = True)
    pass_hash = db.Column(db.String(), nullable = False)
    joined = db.Column(db.DateTime, default = date.today())
    rmends = db.relationship('Rmend', backref = 'rmender', foreign_keys = "Rmend.user_id", lazy = True)
    liked_rmends = db.relationship('Rmend',
        secondary = all_likes,
        primaryjoin = ('User.user_id==all_likes.c.user_liked'),
        secondaryjoin = ('Rmend.rmend_id==all_likes.c.liked_rmend'),
        back_populates = 'liked_by',
        lazy = True
    )
    follows = db.relationship('User',
        secondary = follow_table,
        primaryjoin = ('User.user_id==follow_table.c.follower_id'),
        secondaryjoin = ('User.user_id==follow_table.c.follows_id'),
        backref = db.backref('followers', lazy = 'dynamic'),
        lazy = 'dynamic'
    )

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

#WIPE from SQL Browser: DELETE FROM alembic_version;

#RMEND: ID, user Relationship, body, title, media_type, year, img, rated, date added
class Rmend(db.Model):
    rmend_id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable = False)
    user_rating = db.Column(db.String(), nullable = True)
    body = db.Column(db.String(), nullable = True)
    media_id = db.Column(db.String(), nullable = False)
    title = db.Column(db.String(), nullable = False)
    year = db.Column(db.String(), nullable = False)
    type = db.Column(db.String(), nullable = False)
    description = db.Column(db.String(), nullable = True)
    author = db.Column(db.String(), nullable = False)
    img = db.Column(db.String(), nullable = False)
    date_added = db.Column(db.DateTime, default = datetime.utcnow)
    rmend_for_title = db.Column(db.String(), nullable = True)
    rmend_for_type = db.Column(db.String(), nullable = True)
    liked_by = db.relationship('User',
        secondary = all_likes, 
        primaryjoin = ('Rmend.rmend_id==all_likes.c.liked_rmend'), 
        secondaryjoin = ('User.user_id==all_likes.c.user_liked'), 
        back_populates = 'liked_rmends',
        lazy = True
    )
    genres = db.relationship('Genre', 
        secondary = rmend_genre_table, 
        primaryjoin = ("Rmend.rmend_id==rmend_genre_table.c.rmend_id"),
        secondaryjoin = ("Genre.genre_id==rmend_genre_table.c.genre_id"),
        back_populates = 'medias', 
        lazy = True
    )

    def fromDict(self, d):
        self.user_id = d['username']
        self.title = d['title']
        self.year = d['year']
        self.rated = d['rated']
        self.body = d['body']
        self.media_type = d['media_type']
        self.img = d['img'] 
        self.rmend_for_title = d['rmend_for']

    def totalLikes(self):
        return len(self.likes.likers)

    def to_dict(self):
        d = {
            'rmend_id' : self.rmend_id,
            'username' : self.rmender.username,
            'user_rating' : self.user_rating,
            'body' : self.body,
            'date_added' : self.date_added,
            'media' : {
                'media_id' : self.media_id,
                'title' : self.title, 
                'year' : self.year,
                'description' : self.description,
                'type' : self.type,
                'img' : self.img  
            },
            'rmend_for' : {
                'for_title' : self.rmend_for_title,
                'for_type' : self.rmend_for_type,
            },
            'total_likes' : self.totalLikes(),
        }
        return d
    
    def commit(self):
        db.session.add(self)
        db.session.commit()

    def update_body(self, body):
        self.body = body
        db.session.commit()

    def delete_rmend(self):
        db.session.delete(self)
        db.session.commit()


#GENRE
class Genre(db.Model):
    genre_id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(), nullable = False)
    medias = db.relationship('Rmend',
        secondary = rmend_genre_table,
        primaryjoin = ('Genre.genre_id==rmend_genre_table.c.genre_id'),
        secondaryjoin = ('Rmend.rmend_id==rmend_genre_table.c.rmend_id'),
        back_populates = 'genres',
        lazy = True
    )

    def commit(self):
        db.session.add(self)
        db.session.commit()

    def delete_genre(self):
        db.session.delete(self)
        db.session.commit()


#MEDIA:
""" class Media(db.Model):
    media_id = db.Column(db.Integer, primary_key = True)
    second_id = db.Column(db.String(), nullable = True)
    title = db.Column(db.String(), nullable = False)
    year = db.Column(db.String(), nullable = False)
    format_type = db.Column(db.String(), nullable = False)
    author = db.Column(db.String(), nullable = False)
    rating = db.Column(db.Integer, nullable = True)
    description = db.Column(db.String(), nullable = True)
    img = db.Column(db.String(), nullable = False)
    genres = db.relationship('Genre', secondary = media_genre_table, backref = 'medias', foreign_keys="Genre.genre_id")

    def commit(self):
        db.session.add(self)
        db.session.commit()

    def delete_media(self):
        db.session.delete(self)
        db.session.commit()

    def from_dict(self, d):
        self.media_id  = d['media_id']
        self.second_id  = d['second_id']
        self.title  = d['title']
        self.year = ['year']
        self.format_type = ['format_type']
        self.author = ['author']
        self.rating = ['rating']
        self.description = ['description']
        self.img = ['img']
        self.genres = ['genres']

    def to_dict(self):
        d = {
            'media_id' : self.media_id,
            'second_id' : self.second_id,
            'title' : self.title,
            'year' : self.year,
            'format_type' : self.format_type,
            'author' : self.author,
            'rating' : self.rating,
            'description' : self.description,
            'img' : self.img,
            'genres' : [genre for genre in self.genres],
        }
        return d """





#COLLECTION: ID, user Relationship,
#class Mood(db.Model):
#    mood_id = db.Column(db.Integer, primary_key = True)
#    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable = False)
