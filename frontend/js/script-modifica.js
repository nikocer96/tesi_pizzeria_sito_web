/* FUNZIONE PER VALIDARE LA DATA E L'ORA */
function validaPrenotazione(dataPrenotazione) {
    const data = new Date(dataPrenotazione);
    if (isNaN(data.getTime())) {
        return false;
    }
    const giorno_settimana = data.getDay();
    const ora = data.getHours();
    if (giorno_settimana === 0 || giorno_settimana === 1) {
        return false;
    }
    return (ora >= 10 && ora < 13) || (ora >= 16 && ora < 22)
}

/* EVENTO PER CERCARE LA PRENOTAZIONE */
document.getElementById("cerca-prenotazione").addEventListener("click", async (event) => {
    event.preventDefault();  
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const modaleCerca = document.getElementById("modale-cerca");

    try {
        const response = await fetch("http://127.0.0.1:5000/modifica_prenotazione", {
            method: "POST",  
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email })
        });
        if (!response.ok) {
            const result = await response.json();
            modaleCerca.style.display = "flex";
            console.error("Errore backend:", result.error);
            return;  
        }

        const result = await response.json();

        const nomeModifica = document.getElementById("nome-modifica");
        const cognomeModifica = document.getElementById("cognome-modifica");
        const emailModifica = document.getElementById("email-modifica");
        const dataOraModifica = document.getElementById("data-ora-modifica");
        const descrizioneModifica = document.getElementById("descrizione-modifica");

        if (nomeModifica && cognomeModifica && emailModifica && dataOraModifica && descrizioneModifica) {
            document.getElementById("form-cerca-prenotazione").style.display = "none";
            document.getElementById("form-modifica").style.display = "flex";

            nomeModifica.value = result.prenotazione.nome;
            cognomeModifica.value = result.prenotazione.cognome;
            emailModifica.value = result.prenotazione.email;
            dataOraModifica.value = result.prenotazione.data_ora;
            descrizioneModifica.value = result.prenotazione.descrizione;
        } else {
            console.error("Alcuni campi non sono stati trovati nel DOM.");
            alert("Errore: uno o più campi non sono stati trovati.");
        }
    } catch (error) {
        console.error("Errore di connessione:", error);
        alert("Errore di connessione al server: " + error.message);
    }
});

/* EVENTO PER DISATTIVARE LA LA FINESTRA CON IL MESSAGGIO DI ERRORE DELLA PRENOTAZIONE NON TROVATA */
document.getElementById("ok").addEventListener("click", () => {
    const modaleCerca = document.getElementById("modale-cerca");
    modaleCerca.style.display = "none";
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    
});

/* EVENTO PER DISATTIVARE LA FINESTRA CON IL MESSAGGIO DI ERRORE DELLA DATA E ORA */
document.getElementById("ok-data").addEventListener("click", () => {
    const modaleData = document.getElementById("modale-data");
    modaleData.style.display = "none"; 
});

/* EVENTO PER SALVARE LE MODIFICHE APPORTATE */
document.getElementById("salva-modifiche").addEventListener("click", async (event) => {
    event.preventDefault();
    const modaleData = document.getElementById("modale-data");
    const form_modifica = document.getElementById("form-modifica");
    const datiModificati = {
        nome: document.getElementById("nome-modifica").value,
        cognome: document.getElementById("cognome-modifica").value,
        email: document.getElementById("email-modifica").value,
        data_ora: document.getElementById("data-ora-modifica").value,
        descrizione: document.getElementById("descrizione-modifica").value
    };
    if (!validaPrenotazione(datiModificati.data_ora)) {
        modaleData.style.display = "flex";
        return; 
    }
    try {
        const response = await fetch("http://127.0.0.1:5000/modifica_prenotazione", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(datiModificati)
        });
        const result = await response.json();
        console.log("Result ricevuto dal server:", result); 
        if (response.ok) {
            alert("Prenotazione modificata con successo");
            document.getElementById('form-modifica').reset();
        } else {
            alert("Errore durante la modifica: " + (result.error || "Errore sconosciuto"));
        }
    } catch (error) {
        console.error("Errore", error);
        alert("Errore di connessione");
    }
});
