const form = document.querySelector("form[name='form-prenotazione']");
        
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevenire il comportamento di invio predefinito del form

    const formData = {
        nome: document.getElementById("nome").value,
        cognome: document.getElementById("cognome").value,
        email: document.getElementById("email").value,
        data_ora: document.getElementById("data-ora").value,
        descrizione: document.getElementById("descrizione").value
    };

    console.log("Dati inviati:", formData);  // Stampa i dati prima di inviarli

    try {
        const response = await fetch("http://127.0.0.1:5000/prenota", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();  // Ottieni la risposta in formato JSON
        if (response.ok) {
            alert(`Prenotazione effettuata con successo! ID prenotazione: ${result.id}`);
            const form_input = document.getElementsByTagName("fomr-input")
            form_input.innerHTML = "";
            
        } else {
            alert(`Errore nella prenotazione: ${result.error}`);
        }
    } catch (error) {
        console.error("Errore:", error);
        alert("Errore di connessione al server.");
    }
});