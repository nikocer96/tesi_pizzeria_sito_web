async function fetchMenu(tipo) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/menu?tipo=${tipo}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

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
        div.innerHTML = `<strong>${item.nome}</strong> - ${item.prezzo} €`;
        menuList.appendChild(div)
    });
}

document.querySelectorAll(".menu-category").forEach(category => {
    category.addEventListener("click", () => {
        const tipo = category.getAttribute("data-tipo");
        displayMenu(tipo);
    });
});