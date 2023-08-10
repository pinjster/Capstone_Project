from flask_jwt_extended import get_jwt, get_jwt_identity, create_access_token
from flask import jsonify
from datetime import datetime, timezone , timedelta
from app import app

@app.after_request
def refresh_expiring_jwts(response):
    expiration = get_jwt()['exp']
    current = datetime.now(timezone.utc)
    future_half_hour = datetime.timestamp(current + timedelta(minutes = 30))
    if future_half_hour > expiration:
        access_token = create_access_token(identity = get_jwt_identity())
        data = response.get_json()
        data['access token'] = access_token
        response.data = jsonify(data)
    return response