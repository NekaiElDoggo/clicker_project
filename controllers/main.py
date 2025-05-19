from flask import Flask, Blueprint
from sqlalchemy import create_engine
main = Blueprint('main', __name__)

class player:
    def __init__(self, name, age):
        self.name = name


