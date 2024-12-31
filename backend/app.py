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
    
@app.route("/modifica_prenotazione", methods=["POST", "PUT"])
def modifica_prenotazione():
    try:
        dati_richiesta = request.json
        nome = dati_richiesta.get("nome")
        email = dati_richiesta.get("email")

        # Verifica che nome ed email siano presenti
        if not nome or not email:
            return jsonify({"error": "Nome ed email sono obbligatori"}), 400

        # Carica le prenotazioni
        if os.path.exists(PRENOTA_JSON):
            with open(PRENOTA_JSON, "r") as file:
                prenotazioni = json.load(file)
        else:
            return jsonify({"error": "Nessuna prenotazione trovata"}), 404

        # Cerca la prenotazione corrispondente
        prenotazione = next((p for p in prenotazioni if p["nome"] == nome and p["email"] == email), None)

        # Se la prenotazione non esiste, restituisci un errore
        if prenotazione is None:
            return jsonify({"error": "Prenotazione non trovata"}), 404

        # Se il metodo è POST, restituisci la prenotazione trovata
        if request.method == "POST":
            return jsonify({"prenotazione": prenotazione}), 200

        # Se il metodo è PUT, modifica la prenotazione
        elif request.method == "PUT":
            prenotazione["nome"] = dati_richiesta.get("nome", prenotazione["nome"])
            prenotazione["cognome"] = dati_richiesta.get("cognome", prenotazione["cognome"])
            prenotazione["email"] = dati_richiesta.get("email", prenotazione["email"])
            prenotazione["data_ora"] = dati_richiesta.get("data_ora", prenotazione["data_ora"])
            prenotazione["descrizione"] = dati_richiesta.get("descrizione", prenotazione["descrizione"])

            # Salva le modifiche nel file
            with open(PRENOTA_JSON, "w") as file:
                json.dump(prenotazioni, file, indent=4)

            # Restituisci la prenotazione modificata
            return jsonify({"message": "Prenotazione modificata con successo", "prenotazione": prenotazione}), 200

    except Exception as e:
        # Gestione degli errori generici
        return jsonify({"error": str(e)}), 500

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