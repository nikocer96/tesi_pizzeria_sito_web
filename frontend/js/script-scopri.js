/*FUNZIONE UTILIZZATA PER RECUPERARE IL MENU DAL BACKEND IN BASE AL TIPO(pizza_rossa, pizza_bianca, friggitoria e bevande) */
async function fetchMenu(tipo) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/menu?tipo=${tipo}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

/* FUNZIONE UTILIZZATA PER  MOSTRARE A SCHERMO I DATI DEL MENU' RECUPERATI DAL BACKEND*/
async function displayMenu(tipo) {
    const menuList = document.getElementById("menu-list");
    menuList.innerHTML = "";
    const items = await fetchMenu(tipo);
    if (items === 0) {
        menuList.innerHTML = `<p>Nessun elemento trovato</p>`
        return;
    }
    items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("menu-item");
    
        const textContainer = document.createElement("div");
        textContainer.classList.add("text-container");
    
        const name = document.createElement("h3");
        name.textContent = item.nome;
    
        const price = document.createElement("p");
        price.textContent = `Prezzo: ${item.prezzo} €`;
    
        textContainer.appendChild(name);
        textContainer.appendChild(price);
    
        const img = document.createElement("img");
        img.src = item.immagine;
        img.alt = item.nome;
    
        div.appendChild(textContainer);
        div.appendChild(img);
    
        menuList.appendChild(div);
    });
}

/* UTILIZZATA PER CLICCARE IL MENU */
document.querySelectorAll(".menu-category").forEach(category => {
    category.addEventListener("click", () => {
        const tipo = category.getAttribute("data-tipo");
        displayMenu(tipo);
    });
});