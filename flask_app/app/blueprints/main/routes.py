from flask import render_template
from . import bp as main


@main.route('/')
def home():
    return render_template('index.jinja')