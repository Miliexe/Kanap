console.log("Page confirmation");

//récupération de l'orderId depuis l'url de la page
let url = new URL(window.location)
let id = url.searchParams.get("id")

//affichage de l'orderId
const orderId = document.getElementById("orderId");
orderId.innerText = id;

//suppression du panier
localStorage.removeItem("cart");