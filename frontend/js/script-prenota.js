const form = document.querySelector("form[name='form-prenotazione']");
        
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


form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevenire il comportamento di invio predefinito del form
    const modalePrenota = document.getElementById("modale-prenota");
    const formData = {
        nome: document.getElementById("nome").value,
        cognome: document.getElementById("cognome").value,
        email: document.getElementById("email").value,
        data_ora: document.getElementById("data-ora").value,
        descrizione: document.getElementById("descrizione").value
    };

    console.log("Dati inviati:", formData);  // Stampa i dati prima di inviarli

    if (!validaPrenotazione(formData.data_ora)) {
        //alert("L'orario o la data inserita non sono validi");
        modalePrenota.style.display = "flex";
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/prenota", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();  
        if (response.ok) {
            alert(`Prenotazione effettuata con successo! ID prenotazione: ${result.id}`);
            document.getElementById("nome").value = "";
            document.getElementById("cognome").value = "";
            document.getElementById("email").value = "";
            document.getElementById("data-ora").value = "";
            document.getElementById("descrizione").value = "";
            
        } else {
            alert(`Errore nella prenotazione: ${result.error}`);
        }
    } catch (error) {
        console.error("Errore:", error);
        alert("Errore di connessione al server.");
    }
});

document.getElementById("ok").addEventListener("click", () => {
    const modalePrenota = document.getElementById("modale-prenota");
    modalePrenota.style.display = "none";
});