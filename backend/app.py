from flask import Flask, jsonify, request, send_from_directory
import json
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__, static_folder="../frontend")
CORS(app)

# FILE JSON DEL MENU' E PRENOTAZIONE PER SIMULARE UN DB
JSON_FILE = "./db/menu.json"
PRENOTA_JSON = "./db/prenota.json"
print(JSON_FILE)

with open(JSON_FILE, "r") as file:
    menu_data = json.load(file)

# FUNZIONE PER CARICARE TUTTI I PRODOTTI IN BASE ALLA TIPOLOGIA (pizza_rossa, pizza_binca, friggitoria e bevanda)
@app.route("/menu", methods=["GET"])
def get_menu():
    tipo = request.args.get("tipo")
    if tipo:
        filtered_data = [item for item in menu_data if item["tipo"] == tipo]
        return jsonify(filtered_data)
    return jsonify(menu_data)

print(PRENOTA_JSON)

# FUNZIONE PER OTTENERE IL PROSSIMO ID INCREMENTALE
def get_next_id():
    if os.path.exists(PRENOTA_JSON):
        with open(PRENOTA_JSON, "r") as file:
            prenotazioni = json.load(file)
    else:
        prenotazioni = []
    if not prenotazioni:  
        return 1
    last_id = max(prenotazione["id"] for prenotazione in prenotazioni)
    return last_id + 1

# FUNZIONE PER VALIDARE LA DATA E L'ORA. LA PIZZERIA E' APERTA DAL MARTEDI' ALLA DOMENICA DALLE 10 ALLE 13 E DALLE 16 ALLE 22
def valida_prenotazione(data_prenotazione):
    try:
        data = datetime.strptime(data_prenotazione, "%Y-%m-%dT%H:%M")
        giorno_settimana = data.weekday()
        ora = data.hour
        if giorno_settimana < 1 or giorno_settimana > 6:
            return False
        return (10 <= ora < 13) or (16 <= ora < 22)
    except ValueError:
        return False

# FUNZIONE PER AGGIUNGERE I DATI DELL'UTENTE DELLA NUOVA PRENOTAZIONE AL prenota.json
@app.route("/prenota", methods=["POST"])
def prenota():
    try:
        data = request.json
        print(f"Data ricevuta: {data}")  
        if not valida_prenotazione(data["data_ora"]):
            return jsonify({"error": "La data o l'orario non è valido"}), 400
        
        data["id"] = get_next_id()
        if os.path.exists(PRENOTA_JSON):
            with open(PRENOTA_JSON, "r") as file:
                prenotazioni = json.load(file)
        else:
            prenotazioni = []

        prenotazioni.append(data)
        print(f"Prenotazioni dopo l'aggiunta: {prenotazioni}")  
        with open(PRENOTA_JSON, "w") as file:
            json.dump(prenotazioni, file, indent=4)

        return jsonify({"message": "Prenotazione salvata con successo!", "id": data["id"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)})
    
# FUNZIONE PER CERCARE E MODFICARE I DATI DI UNA PRENOTAZIONE E SALVARLI IN prenota.json
@app.route("/modifica_prenotazione", methods=["POST", "PUT"])
def modifica_prenotazione():
    try:
        dati_richiesta = request.json
        nome = dati_richiesta.get("nome")
        email = dati_richiesta.get("email")
        if not nome or not email:
            return jsonify({"error": "Nome ed email sono obbligatori"}), 400

        if os.path.exists(PRENOTA_JSON):
            with open(PRENOTA_JSON, "r") as file:
                prenotazioni = json.load(file)
        else:
            return jsonify({"error": "Nessuna prenotazione trovata"}), 404

        prenotazione = next((p for p in prenotazioni if p["nome"] == nome and p["email"] == email), None)
        if prenotazione is None:
            return jsonify({"error": "Prenotazione non trovata"}), 404

        if request.method == "POST":
            return jsonify({"prenotazione": prenotazione}), 200
        elif request.method == "PUT":
            nuova_data_ora = dati_richiesta.get("data_ora", prenotazione["data_ora"])
            if not valida_prenotazione(nuova_data_ora):
                return jsonify({"error": "La data o l'ora non sono validi"}), 400

            prenotazione["nome"] = dati_richiesta.get("nome", prenotazione["nome"])
            prenotazione["cognome"] = dati_richiesta.get("cognome", prenotazione["cognome"])
            prenotazione["email"] = dati_richiesta.get("email", prenotazione["email"])
            prenotazione["data_ora"] = nuova_data_ora
            prenotazione["descrizione"] = dati_richiesta.get("descrizione", prenotazione["descrizione"])

            with open(PRENOTA_JSON, "w") as file:
                json.dump(prenotazioni, file, indent=4)

            return jsonify({"message": "Prenotazione modificata con successo", "prenotazione": prenotazione}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# FUNZIONE PER CERCARE E CANCELLARE UNA PRENOTAZIONE
@app.route("/cancella_prenotazione", methods=["POST", "DELETE"])
def cancella_prenotazione():
    try:
        dati_richiesta = request.json
        nome = dati_richiesta.get("nome")
        email = dati_richiesta.get("email")
        if not nome or not email:
            return jsonify({"error": "Il campo nome ed email sono obbligatori"}), 400
        if os.path.exists(PRENOTA_JSON):
            with open(PRENOTA_JSON, "r") as file:
                prenotazioni = json.load(file)
        else:
            return jsonify({"error": "nessuna prenotazione trovata"})
        prenotazione_trovata = next((p for p in prenotazioni if p["nome"] == nome and p["email"] == email), None)
        if prenotazione_trovata is None:
            return jsonify({"error": "prenotazione non trovata"}), 404
        
        if request.method == "POST":
            return jsonify({"prenotazione_trovata": prenotazione_trovata}), 200
        elif request.method == "DELETE":
            prenotazioni.remove(prenotazione_trovata)
            with open(PRENOTA_JSON, "w") as file:
                json.dump(prenotazioni, file, indent=4)
            return jsonify({"message": "Prenotazione cancellata con successo"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)