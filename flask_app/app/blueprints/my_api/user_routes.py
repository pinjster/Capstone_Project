from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from app.models import User
from . import bp_user as user

@user.get('/profile/<username>')
def user_profile(username):
    user = User.query.filter_by(username = username).first()
    if user:
        return jsonify(user.user_profile_to_dict()), 200
    else:
        return jsonify({
            'success' : False,
            'status' : 'user does not exist'
        }), 409


@user.get('/follow/<username>')
@jwt_required()
def follow_user(username):
    curr = User.query.filter_by(username = get_jwt_identity()).first()
    if curr.follow_user(username):
        return jsonify({
            'success' : True,
            'status' : f"{curr.username} is now following {username}"
        }), 200
    else:
        return jsonify({
            'success' : False,
            'status' : f"You are already following {username}"
        }), 409


@user.delete('/unfollow/<username>')
@jwt_required()
def unfollow_user(username):
    curr = User.query.filter_by(username = get_jwt_identity()).first()
    if curr.unfollow_user(username):
        return jsonify({
            'success' : True,
            'status' : f"{curr.username} no longer follows {username}"
        }), 200
    else:
        return jsonify({
            'success' : False,
            'status' : f"You do not follow {username}. Cannot un-follow an un-followed user"
        }), 409


