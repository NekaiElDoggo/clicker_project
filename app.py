from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def index():
    score = int(request.cookies.get('score', 0))
    return render_template('main.html', score=score)

if __name__ == '__main__':
    app.run()