from flask import Blueprint

bp = Blueprint('api', __name__, url_prefix='/api')
bp_auth = Blueprint('auth', __name__, url_prefix='/auth')
bp_user = Blueprint('user', __name__, url_prefix='/user')
bp_rmnd = Blueprint('rmnd', __name__, url_prefix='/rmnd')

from . import auth_routes, rmnd_routes, user_routes