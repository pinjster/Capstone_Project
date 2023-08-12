from flask import Blueprint

bp = Blueprint('api', __name__, url_prefix='/api')
bp_auth = Blueprint('auth', __name__, url_prefix='/auth')
bp_user = Blueprint('user', __name__, url_prefix='/user')
bp_rcmd = Blueprint('rcmd', __name__, url_prefix='/rcmd')

from . import auth_routes, rcmd_routes, rcmd_routes, user_routes