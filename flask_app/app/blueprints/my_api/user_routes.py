from . import bp_user as user

@user.route('<username>/profile')
def user_profile(username):
    pass

