from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Rmend, Genre
from . import bp_rmnd as rmnd

@rmnd.post('/add-rmend')
@jwt_required()
def add_rmend():
    info = request.json
    user = User.query.filter_by(username = get_jwt_identity()).first()
    if user:
        try:
            new_rmend = Rmend()
            new_rmend.user_id = user.user_id
            new_rmend.from_dict(info)
            new_rmend.handle_genres(info['genres'])
            if not new_rmend.is_duplicate():
                new_rmend.commit()
                return jsonify({
                    'success' : True,
                    'status' : 'rmend has been added',
                    'rmend_id' : new_rmend.rmend_id
                }), 200
            else:
                return jsonify({
                'success' : False,
                'status' : 'you have already recommended this'}), 409
        except:
            return jsonify({
                'success' : False,
                'status' : 'unable to add rmend'}), 409
    else:
        return jsonify({
            'success' : False,
            'status' : 'user does not exist'}), 409
    

@rmnd.post('/edit-rmend')
@jwt_required()
def edit_rmend():
    info = request.json
    rmend = Rmend.query.filter_by(rmend_id = info['rmend_id']).first()
    if not rmend:
        return jsonify({
            'success' : False,
            'status' : "rmend does not exist"
        }), 409
    elif rmend.rmender.username != get_jwt_identity():
        return jsonify({
            'success' : False,
            'status' : 'cannot edit an rmend that is not yours'
        }), 409
    else:
        try:
            if 'user_rating' in info:
                rmend.user_rating = info['user_rating']
            if 'body' in info:
                rmend.body = info['body']
            if 'rmend_for_title' in info:
                rmend.rmend_for_title = info['rmend_for_title']
            if 'rmend_for_type' in info:
                rmend.rmend_for_type = info['rmend_for_type']
            rmend.update_rmend()
            return jsonify({
                'success' : True,
                'status' : "Edited rmend"
            }), 200
        except:
            return jsonify({
                'success' : False,
                'status' : "Unable to edit rmend"
            })
        

@rmnd.delete("/delete-rmend/<rmend_id>")
@jwt_required()
def delete_recommend(rmend_id):
    rmend = Rmend.query.filter_by(rmend_id = rmend_id).first()
    if not rmend:
        return jsonify({
            'success' : False,
            'status' : 'rmend does not exist'
        }), 409
    if rmend.rmender.username != get_jwt_identity():
        return jsonify({
            'success' : False,
            'status' : 'cannot delete an rmend that is not yours'
        }), 409
    else:
        rmend.delete_rmend()
        return jsonify({
            'success' : True,
            'status' : 'rmend deleted'
        }), 200
    

@rmnd.get("/like/<rmend_id>")
@jwt_required()
def like_rmend(rmend_id):
    rmend = Rmend.query.filter_by(rmend_id = rmend_id).first()
    if not rmend:
        return jsonify({
            'success' : False,
            'status' : 'rmend does not exist'
        }), 409
    curr = User.query.filter_by(username = get_jwt_identity()).first()
    if curr.like_rmend(rmend_id):
        return jsonify({
            'success' : True,
            'status' : 'liked rmend'
        }), 200
    else:
        return jsonify({
            'success' : False,
            'status' : 'already liked rmend'
        }), 409


@rmnd.delete("/unlike/<rmend_id>")
@jwt_required()
def unlike_rmend(rmend_id):
    rmend = Rmend.query.filter_by(rmend_id = rmend_id).first()
    if not rmend:
        return jsonify({
            'success' : False,
            'status' : 'rmend does not exist'
        }), 409
    curr = User.query.filter_by(username = get_jwt_identity()).first()
    if curr.unlike_rmend(rmend_id):
        return jsonify({
            'success' : True,
            'status' : 'unliked rmend'
        }), 200
    else:
        return jsonify({
            'success' : False,
            'status' : 'cannot unlike this rmend as it has never been initially liked'
        }), 409
    
@rmnd.get('/media-rmends/<type>/<id>')
def media_rmends(type, id):
    rmends = Rmend.query.filter(Rmend.type == type, Rmend.media_id == id).all()
    return jsonify({ 'rmends': [rmend.to_dict() for rmend in rmends] }), 200

@rmnd.get('/genre-rmends/<title>')
def genre_rmends(title):
    genre = Genre.query.filter_by(title = title).first()
    if genre:
        return jsonify({ 'rmends': [rmend.to_dict() for rmend in genre.rmends] }), 200
    else:
        return jsonify({
            'success' : False,
            'status' : 'genre does not exist'
        }), 409