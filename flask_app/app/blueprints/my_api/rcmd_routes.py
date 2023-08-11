from flask import request, jsonify
from flask_jwt_extended import jwt_required
from app.models import User, Rmend
from . import bp_rcmd as rcmd

@rcmd.post('/add-recommend')
@jwt_required
def add_recommend():
    info = request.json
    user = User.query.filter_by(username = info['username']).first()
    if user:
        info['username'] = user.user_id
        new_rmend = Rmend()
        new_rmend.to_dict(info)
        new_rmend.commit()
        return jsonify({'status' : 'post has been added'}), 200
    else:
        return jsonify({'status' : 'user does not exist'}), 305
    
""" 
@rcmd.delete('/remove-recommend')
@jwt_required
def remove_recommend():
    pass
 """
