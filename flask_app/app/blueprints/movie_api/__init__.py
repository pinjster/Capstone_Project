from flask import Blueprint

bp = Blueprint('movie-api', __name__, url_prefix='/movie-api')

from . import routes