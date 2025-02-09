console.log("Chargement de app.js...");
//définition de API_URL
if (typeof window.API_URL === "undefined" || !window.API_URL) {
    window.API_URL = window.location.hostname.includes("localhost")
        ? "http://127.0.0.1:5000/books"
        : "http://backend-service:5000/books";
    
    console.log("API_URL a été défini manuellement dans app.js :", window.API_URL);
} else {
    console.log("API_URL est déjà défini :", window.API_URL);
}
//définition sécurisée de API_URL
const API_URL = window.API_URL;
console.log("API_URL utilisé dans app.js :", API_URL);
//ajouter d'un livre
async function addBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;
    const book = { title, author, rating, comment };
    console.log("Livre à ajouter :", book);
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur serveur : ${errorData.error || response.statusText}`);
        }
        console.log("Livre ajouté avec succès !");
        loadBooks(); //permet de rafraîchir la liste des livres
    } catch (error) {
        console.error("Erreur lors de l'ajout du livre :", error);
        alert("Erreur lors de l'ajout du livre : " + error.message);
    }
}
//charger les livres existants
async function loadBooks() {
    try {
        console.log("Chargement des livres depuis :", API_URL);
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des livres : ${response.statusText}`);
        }
        const books = await response.json();
        const list = document.getElementById("book-list");
        list.innerHTML = "";
        books.forEach(book => {
            const item = document.createElement("li");
            item.innerHTML = `<strong>${book.title}</strong> par ${book.author} - Note : ${book.rating}/5 <br> Commentaire : ${book.comment || "Pas de commentaire"}`;
            list.appendChild(item);
        });
        console.log("Liste des livres mise à jour ");
    } catch (error) {
        console.error("Erreur lors du chargement des livres :", error);
        alert("Erreur lors du chargement des livres : " + error.message);
    }
}
//charger les livres au démarrage de la page
document.addEventListener("DOMContentLoaded", loadBooks);
