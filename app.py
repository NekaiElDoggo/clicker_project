from flask import Flask, Blueprint

from controllers import main

app = Flask(__name__)
app.register_blueprint(main)
@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
