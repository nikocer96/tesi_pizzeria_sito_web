function verificaCampi() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const bottone = document.getElementById("cerca-prenotazione");

    if (nome && email) {
        bottone.disabled = false;  
    } else {
        bottone.disabled = true;  
    }
}

document.getElementById("nome").addEventListener("input", verificaCampi);
document.getElementById("email").addEventListener("input", verificaCampi);


document.getElementById("cerca-prenotazione").addEventListener("click", async (event) => {
    event.preventDefault();  // Impedisce il comportamento predefinito del submit del form

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    const modaleCerca = document.getElementById("modale-cerca");
    

    try {
        const response = await fetch("http://127.0.0.1:5000/cancella_prenotazione", {
            method: "POST",  // Usa POST per cercare la prenotazione
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email })
        });
        

        if (!response.ok) {
            const result = await response.json();
            modaleCerca.style.display = "flex";
            console.error("Errore backend:", result.error);
            document.getElementById("nome").value = "";
            document.getElementById("email").value = "";
            //alert(result.error || "Errore sconosciuto durante la ricerca");
            return;  // Ferma l'esecuzione
        }

        const result = await response.json();

        // Verifica che gli elementi esistano prima di cercare di modificarli
        const nomeVisualizza = document.getElementById("nome-visualizza");
        const cognomeVisualizza = document.getElementById("cognome-visualizza");
        const emailVisualizza = document.getElementById("email-visualizza");
        const dataOraVisualizza = document.getElementById("data-ora-visualizza");
        const descrizioneVisualizza = document.getElementById("descrizione-visualizza");

        if (nomeVisualizza && cognomeVisualizza && emailVisualizza && dataOraVisualizza && descrizioneVisualizza) {
            document.getElementById("form-cerca-prenotazione").style.display = "none";
            document.getElementById("form-visualizza").style.display = "flex";

            nomeVisualizza.value = result.prenotazione_trovata.nome;
            cognomeVisualizza.value = result.prenotazione_trovata.cognome;
            emailVisualizza.value = result.prenotazione_trovata.email;
            dataOraVisualizza.value = result.prenotazione_trovata.data_ora;
            descrizioneVisualizza.value = result.prenotazione_trovata.descrizione;
        } else {
            
            console.error("Alcuni campi non sono stati trovati nel DOM.");
            alert("Errore: uno o più campi non sono stati trovati.");
        }

    } catch (error) {
        console.error("Errore di connessione:", error);
        alert("Errore di connessione al server: " + error.message);
    }

    
});

document.getElementById("ok").addEventListener("click", () => {
    const modaleCerca = document.getElementById("modale-cerca");
    modaleCerca.style.display = "none";
    document.getElementById("form-cerca-prenotazione").style.display = "flex";
})



document.getElementById("cancella").addEventListener("click", async (e) => {
    e.preventDefault();
    const modale = document.getElementById("conferma-modale");
    modale.style.display = "flex";

    const confermaBottone = document.getElementById("conferma");
    const annullaBottone = document.getElementById("annulla");

     

    confermaBottone.onclick = async () => {
        const datiCancella = {
            nome: document.getElementById("nome-visualizza").value,
            cognome: document.getElementById("cognome-visualizza").value,
            email: document.getElementById("email-visualizza").value,
            data_ora: document.getElementById("data-ora-visualizza").value,
            descrizione: document.getElementById("descrizione-visualizza").value
        };
    
        try {
            const response = await fetch("http://127.0.0.1:5000/cancella_prenotazione", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(datiCancella)
            });
    
            // Verifica se la risposta è ok
            const result = await response.json();
    
            console.log("Result ricevuto dal server:", result);  // Aggiungi questa riga per debug
    
            if (response.ok) {
                document.getElementById("form-cerca-prenotazione").style.display = "flex";
                document.getElementById("form-visualizza").style.display = "none";
    
                document.getElementById("nome-visualizza").value = "";
                document.getElementById("cognome-visualizza").value = "";
                document.getElementById("email-visualizza").value = "";
                document.getElementById("data-ora-visualizza").value = "";
                document.getElementById("descrizione-visualizza").value = "";
    
                document.getElementById("nome").value = "";
                document.getElementById("email").value = "";
                modale.style.display = "none";
                alert("Prenotazione cancellata con successo: " + result.message);
                
                
            } else {
                // Se la risposta non è ok, mostra il messaggio di errore
                alert("Errore durante la modifica: " + (result.error || "Errore sconosciuto"));
            }
        } catch (error) {
            console.error("Errore", error);
            alert("Errore di connessione");
        }
    }

    document.getElementById("annulla").onclick = () => {
        modale.style.display = "none"; // Chiudi il modale
    };
});