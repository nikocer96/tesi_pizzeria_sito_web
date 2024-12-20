from flask import Flask, jsonify, request, send_from_directory
import json
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="../frontend")
CORS(app)

JSON_FILE = "./db/menu.json"
PRENOTA_JSON = "./db/prenota.json"
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


print(PRENOTA_JSON)
def get_next_id():
    """Funzione per ottenere il prossimo ID incrementale."""
    if os.path.exists(PRENOTA_JSON):
        with open(PRENOTA_JSON, "r") as file:
            prenotazioni = json.load(file)
    else:
        prenotazioni = []
    
    if not prenotazioni:  # Se il file è vuoto, inizia da 1
        return 1
    last_id = max(prenotazione["id"] for prenotazione in prenotazioni)
    return last_id + 1

@app.route("/prenota", methods=["POST"])
def prenota():
    try:
        # Ottieni i dati dalla richiesta
        data = request.json

        # Log per verificare i dati ricevuti
        print(f"Data ricevuta: {data}")  # Assicurati che questa riga sia correttamente indentata

        # Genera un ID per la nuova prenotazione
        data["id"] = get_next_id()

        # Carica le prenotazioni esistenti
        if os.path.exists(PRENOTA_JSON):
            with open(PRENOTA_JSON, "r") as file:
                prenotazioni = json.load(file)
        else:
            prenotazioni = []

        # Aggiungi la nuova prenotazione
        prenotazioni.append(data)
        print(f"Prenotazioni dopo l'aggiunta: {prenotazioni}")  # Verifica che la prenotazione sia stata aggiunta

        # Salva le prenotazioni nel file
        with open(PRENOTA_JSON, "w") as file:
            json.dump(prenotazioni, file, indent=4)

        return jsonify({"message": "Prenotazione salvata con successo!", "id": data["id"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)