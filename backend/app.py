from flask import Flask, jsonify, request, send_from_directory
import json
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="../frontend")
CORS(app)

JSON_FILE = "./db/menu.json"
print(JSON_FILE)

with open(JSON_FILE, "r") as file:
    menu_data = json.load(file)

@app.route("/menu", methods=["GET"])
def get_menu():
    tipo = request.args.get("tipo")
    if tipo:
        filtered_data = [item for item in menu_data if item["tipo"] == tipo]
        return jsonify(filtered_data)
    return jsonify(menu_data)

@app.route("/", methods=["GET"])
def serve_frontend():
    return send_from_directory(app.static_folder, "scopri.html")

if __name__ == "__main__":
    app.run(debug=True)