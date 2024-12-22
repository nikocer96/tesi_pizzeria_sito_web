document.getElementById("cerca-prenotazione").addEventListener("click", async (event) => {
    event.preventDefault();  // Impedisce il comportamento predefinito del submit del form

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    try {
        const response = await fetch("http://127.0.0.1:5000/modifica_prenotazione", {
            method: "POST",  // Usa POST per cercare la prenotazione
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email })
        });

        if (!response.ok) {
            const result = await response.json();
            console.error("Errore backend:", result.error);
            alert(result.error || "Errore sconosciuto durante la ricerca");
            return;  // Ferma l'esecuzione
        }

        const result = await response.json();

        // Verifica che gli elementi esistano prima di cercare di modificarli
        const nomeModifica = document.getElementById("nome-modifica");
        const cognomeModifica = document.getElementById("cognome-modifica");
        const emailModifica = document.getElementById("email-modifica");
        const dataOraModifica = document.getElementById("data-ora-modifica");
        const descrizioneModifica = document.getElementById("descrizione-modifica");

        if (nomeModifica && cognomeModifica && emailModifica && dataOraModifica && descrizioneModifica) {
            document.getElementById("form-cerca-prenotazione").style.display = "none";
            document.getElementById("form-modifica").style.display = "block";

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



document.getElementById("salva-modifiche").addEventListener("click", async () => {
    const datiModificati = {
        nome: document.getElementById("nome-modifica").value,
        cognome: document.getElementById("cognome-modifica").value,
        email: document.getElementById("email-modifica").value,
        data_ora: document.getElementById("data-ora-modifica").value,
        descrizione: document.getElementById("descrizione-modifica").value
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/modifica_prenotazione", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(datiModificati)
        });

        // Verifica se la risposta è ok
        const result = await response.json();

        console.log("Result ricevuto dal server:", result);  // Aggiungi questa riga per debug

        if (response.ok) {
            alert("Prenotazione modificata con successo: " + result.message);
        } else {
            // Se la risposta non è ok, mostra il messaggio di errore
            alert("Errore durante la modifica: " + (result.error || "Errore sconosciuto"));
        }
    } catch (error) {
        console.error("Errore", error);
        alert("Errore di connessione");
    }
});
