/* FUNZIONE PER APRIRE E CHIUDERE L'HAMBURGER MENU */
function myFunction() {
    const myLinks = document.getElementById("myLinks");
    if (myLinks.style.display === "block") {
      myLinks.style.display = "none";
    } else {
      myLinks.style.display = "block";
    }
  }