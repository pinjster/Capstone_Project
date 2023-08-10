from flask import jsonify, request
from flask_jwt_extended import create_access_token, unset_jwt_cookies, jwt_required, set_access_cookies
from app.models import User
from . import bp as api

@api.route('/signin', methods = ['POST'])
def signin():
    username, password = request.json.get('username'), request.json.get('password')
    user = User.query.filter_by(username = username).first()
    if user and user.check_password(password):
        response = jsonify({"msg": "signin successful"})
        access_token = create_access_token(identity= username, fresh=True)
        set_access_cookies(response, access_token)
        return jsonify({'access_token' : access_token}), 200
    else:
        return jsonify({'message': "Invalid Username or Password / Try Again"}), 400

@api.route('/signup', methods = ['POST'])
def signup():
    info = request.json
    response = {}
    if User.query.filter_by(username = info['username']).first():
        response['username error'] = f"{info['username']} is already in use" 
    if User.query.filter_by(email = info['email']).first():
        response['email error'] = f"{info['email']} is already in use" 
    if 'password' not in info:
        response['password error'] = 'please include password'
    try:
        u = User()
        u.from_dict(info)
        new_response = jsonify({"msg": "signup successful"})
        access_token = create_access_token(identity= u.username, fresh=True)
        set_access_cookies(new_response, access_token)
        u.commit()
        return jsonify({'update' : f'{u.username} has been registered', 'access_token' : access_token}), 200
    except:
        return jsonify(response), 400

@api.route('/signout', methods = ['POST'])
def signout():
    response = jsonify({'msg' : 'signout successful'})
    return response, 200

@api.delete('/delete-user/<username>')
@jwt_required(fresh= True)
def delete_user(username):
    password = request.json.get('password')
    user = User.query.filter_by(username = username).first()
    if user and user.check_password(password):
        user.delete_user()
        return jsonify(status= f'User deleted'), 200
    return jsonify(status= 'Invalid Username/Password'), 400