from flask import Flask, request, render_template
import json

app = Flask(__name__)

@app.route('/')
def index():
    click_upgrades = [
        {"level": 1, "cost": 100, "multiplier": 2, "condition": 0},
        {"level": 2, "cost": 1000, "multiplier": 2, "condition": 0},
        {"level": 3, "cost": 10000, "multiplier": 2, "condition": 0}
    ]
    items = [
        {
            "name": "Slime vert",
            "type": "building",
            "baseCost": 25,
            "baseProd": 0.1,
            "count": 0,
            "cost": 25,
            "upgrade": [
                {"level": 1, "cost": 500, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 10000, "multiplier": 2, "condition": 50},
                {"level": 3, "cost": 1000000, "multiplier": 2, "condition": 100}
            ]
        },
        {
            "name": "Slime bleu",
            "type": "building",
            "baseCost": 100,
            "baseProd": 1,
            "count": 0,
            "cost": 100,
            "upgrade": [
                {"level": 1, "cost": 5000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 100000, "multiplier": 2, "condition": 50},
                {"level": 3, "cost": 10000000, "multiplier": 2, "condition": 100}
            ]
        },
        {
            "name": "Slime rouge",
            "type": "building",
            "baseCost": 1000,
            "baseProd": 5,
            "count": 0,
            "cost": 1000,
            "upgrade": [
                {"level": 1, "cost": 50000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 1000000, "multiplier": 2, "condition": 50},
                {"level": 3, "cost": 100000000, "multiplier": 2, "condition": 100}
            ]
        }
    ]
    return render_template('main.html',
                           items=json.dumps(items),
                           click_upgrades=json.dumps(click_upgrades))

if __name__ == '__main__':
    app.run()