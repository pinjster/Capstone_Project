from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

jwt = JWTManager(app)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours = 1)

from app.blueprints.main import bp as main
app.register_blueprint(main)
from app.blueprints.my_api import bp as api
from app.blueprints.my_api import bp_auth, bp_rcmd, bp_user
api.register_blueprint(bp_auth)
api.register_blueprint(bp_user)
api.register_blueprint(bp_rcmd)
app.register_blueprint(api)
from app.blueprints.movie_api import bp as movie
app.register_blueprint(movie)

from app import models