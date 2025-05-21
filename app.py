from flask import Flask, request, render_template
import json

app = Flask(__name__)


@app.route('/')
def index():
    click_upgrades = [
        {"level": 1, "cost": 100, "multiplier": 2, "condition": 0},
        {"level": 2, "cost": 1000, "multiplier": 2, "condition": 0},
        {"level": 3, "cost": 10000, "multiplier": 2, "condition": 0},
        {"level": 4, "cost": 100000, "multiplier": 2, "condition": 0},
        {"level": 5, "cost": 1000000, "multiplier": 2, "condition": 0},
        {"level": 6, "cost": 10000000, "multiplier": 2, "condition": 0},
        {"level": 7, "cost": 100000000, "multiplier": 2, "condition": 0},
        {"level": 8, "cost": 1000000000, "multiplier": 2, "condition": 0},
        {"level": 9, "cost": 10000000000, "multiplier": 2, "condition": 0},
        {"level": 10, "cost": 100000000000, "multiplier": 2, "condition": 0}
    ]
    items = [
        {
            "name": "Slime vert",
            "type": "building",
            "baseCost": 15,
            "growthRate": 1.15,
            "baseProd": 0.1,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 150, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 1500, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 15000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 150000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 1500000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime bleu",
            "type": "building",
            "baseCost": 100,
            "growthRate": 1.15,
            "baseProd": 1,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 1000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 10000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 100000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 1000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 10000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime rouge",
            "type": "building",
            "baseCost": 1000,
            "growthRate": 1.15,
            "baseProd": 5,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 10000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 100000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 1000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 10000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 100000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime jaune",
            "type": "building",
            "baseCost": 10000,
            "growthRate": 1.15,
            "baseProd": 10,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 100000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 1000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 10000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 100000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 1000000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime violet",
            "type": "building",
            "baseCost": 100000,
            "growthRate": 1.15,
            "baseProd": 50,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 1000000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 10000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 100000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 1000000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 10000000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime noir",
            "type": "building",
            "baseCost": 1000000,
            "growthRate": 1.15,
            "baseProd": 100,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 10000000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 100000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 1000000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 10000000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 100000000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime argent",
            "type": "building",
            "baseCost": 10000000,
            "growthRate": 1.15,
            "baseProd": 500,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 100000000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 1000000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 10000000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 100000000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 1000000000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime or",
            "type": "building",
            "baseCost": 100000000,
            "growthRate": 1.15,
            "baseProd": 1000,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 1000000000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 10000000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 100000000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 1000000000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 10000000000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime diamant",
            "type": "building",
            "baseCost": 1000000000,
            "growthRate": 1.15,
            "baseProd": 5000,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 10000000000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 100000000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 1000000000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 10000000000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 100000000000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime rubis",
            "type": "building",
            "baseCost": 10000000000,
            "growthRate": 1.15,
            "baseProd": 10000,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 100000000000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 1000000000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 10000000000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 100000000000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 1000000000000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime cristal",
            "type": "building",
            "baseCost": 100000000000,
            "growthRate": 1.15,
            "baseProd": 50000,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 1000000000000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 10000000000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 100000000000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 1000000000000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 10000000000000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime arc-en-ciel",
            "type": "building",
            "baseCost": 1000000000000,
            "growthRate": 1.15,
            "baseProd": 100000,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 10000000000000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 100000000000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 1000000000000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 10000000000000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 100000000000000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime légendaire",
            "type": "building",
            "baseCost": 10000000000000,
            "growthRate": 1.15,
            "baseProd": 500000,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 100000000000000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 1000000000000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 10000000000000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 100000000000000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 1000000000000000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime mythique",
            "type": "building",
            "baseCost": 100000000000000,
            "growthRate": 1.15,
            "baseProd": 1000000,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 1000000000000000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 10000000000000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 100000000000000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 1000000000000000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 10000000000000000000, "multiplier": 4, "condition": 500}
            ]
        },
        {
            "name": "Slime divin",
            "type": "building",
            "baseCost": 1000000000000000,
            "growthRate": 1.15,
            "baseProd": 5000000,
            "count": 0,
            "upgrade": [
                {"level": 1, "cost": 10000000000000000, "multiplier": 2, "condition": 10},
                {"level": 2, "cost": 100000000000000000, "multiplier": 2.5, "condition": 50},
                {"level": 3, "cost": 1000000000000000000, "multiplier": 3, "condition": 100},
                {"level": 4, "cost": 10000000000000000000, "multiplier": 3.5, "condition": 200},
                {"level": 5, "cost": 100000000000000000000, "multiplier": 4, "condition": 500}
            ]
        }
    ]
    achievements = [
        {"type": "Slime vert", "name": "Chasseur de Slime vert", "condition": 10, "unlock": False},
        {"type": "Slime vert", "name": "Elite anti Slime vert", "condition": 100, "unlock": False},
        {"type": "Slime vert", "name": "Slime vert exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime bleu", "name": "Chasseur de Slime bleu", "condition": 10, "unlock": False},
        {"type": "Slime bleu", "name": "Elite anti Slime bleu", "condition": 100, "unlock": False},
        {"type": "Slime bleu", "name": "Slime bleu exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime rouge", "name": "Chasseur de Slime rouge", "condition": 10, "unlock": False},
        {"type": "Slime rouge", "name": "Elite anti Slime rouge", "condition": 100, "unlock": False},
        {"type": "Slime rouge", "name": "Slime rouge exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime jaune", "name": "Chasseur de Slime jaune", "condition": 10, "unlock": False},
        {"type": "Slime jaune", "name": "Elite anti Slime jaune", "condition": 100, "unlock": False},
        {"type": "Slime jaune", "name": "Slime jaune exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime violet", "name": "Chasseur de Slime violet", "condition": 10, "unlock": False},
        {"type": "Slime violet", "name": "Elite anti Slime violet", "condition": 100, "unlock": False},
        {"type": "Slime violet", "name": "Slime violet exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime noir", "name": "Chasseur de Slime noir", "condition": 10, "unlock": False},
        {"type": "Slime noir", "name": "Elite anti Slime noir", "condition": 100, "unlock": False},
        {"type": "Slime noir", "name": "Slime noir exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime argent", "name": "Chasseur de Slime argent", "condition": 10, "unlock": False},
        {"type": "Slime argent", "name": "Elite anti Slime argent", "condition": 100, "unlock": False},
        {"type": "Slime argent", "name": "Slime argent exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime or", "name": "Chasseur de Slime or", "condition": 10, "unlock": False},
        {"type": "Slime or", "name": "Elite anti Slime or", "condition": 100, "unlock": False},
        {"type": "Slime or", "name": "Slime or exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime diamant", "name": "Chasseur de Slime diamant", "condition": 10, "unlock": False},
        {"type": "Slime diamant", "name": "Elite anti Slime diamant", "condition": 100, "unlock": False},
        {"type": "Slime diamant", "name": "Slime diamant exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime rubis", "name": "Chasseur de Slime rubis", "condition": 10, "unlock": False},
        {"type": "Slime rubis", "name": "Elite anti Slime rubis", "condition": 100, "unlock": False},
        {"type": "Slime rubis", "name": "Slime rubis exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime cristal", "name": "Chasseur de Slime cristal", "condition": 10, "unlock": False},
        {"type": "Slime cristal", "name": "Elite anti Slime cristal", "condition": 100, "unlock": False},
        {"type": "Slime cristal", "name": "Slime cristal exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime arc-en-ciel", "name": "Chasseur de Slime arc-en-ciel", "condition": 10, "unlock": False},
        {"type": "Slime arc-en-ciel", "name": "Elite anti Slime arc-en-ciel", "condition": 100, "unlock": False},
        {"type": "Slime arc-en-ciel", "name": "Slime arc-en-ciel exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime legendaire", "name": "Chasseur de Slime légendaire", "condition": 10, "unlock": False},
        {"type": "Slime légendaire", "name": "Elite anti Slime légendaire", "condition": 100, "unlock": False},
        {"type": "Slime légendaire", "name": "Slime légendaire exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime mythique", "name": "Chasseur de Slime mythique", "condition": 10, "unlock": False},
        {"type": "Slime mythique", "name": "Elite anti Slime mythique", "condition": 100, "unlock": False},
        {"type": "Slime mythique", "name": "Slime mythique exterminator", "condition": 1000, "unlock": False},
        {"type": "Slime divin", "name": "Chasseur de Slime divin", "condition": 10, "unlock": False},
        {"type": "Slime divin", "name": "Elite anti Slime divin", "condition": 100, "unlock": False},
        {"type": "Slime divin", "name": "Slime divin exterminator", "condition": 1000, "unlock": False}
    ]
    return render_template('main.html',
                           items=json.dumps(items),
                           click_upgrades=json.dumps(click_upgrades),
                           achievements=json.dumps(achievements))


if __name__ == '__main__':
    app.run()
