console.log("Page produit");
console.log(window.location);

//récupération de l'id depuis l'url
let url = new URL(window.location);
let id = url.searchParams.get("id");

console.log(id);

//récupération du produit depuis l'api
fetch(`http://localhost:3000/api/products/${id}`)
  .then((data) => data.json())
  .then((product) => {

    showProduct(product) //affichage du produit

  })

//affichage du produit
function showProduct(product) {

  //integration du produit dans l'html

  //affichage de l'image
  let divImg = document.querySelector(".item__img");
  let img = document.createElement("img");
  img.src = `${product.imageUrl}`;
  img.alt = `${product.altTxt}`;
  divImg.appendChild(img);

  //affichage du titre
  let title = document.getElementById("title");
  title.innerText = `${product.name}`;

  //affichage du prix
  let price = document.getElementById("price");
  price.innerText = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(product.price);

  //affichage de la description
  let description = document.getElementById("description");
  description.innerText = `${product.description}`;

  //insertion des couleurs disponibles dans le menu déroulant
  for (let colors in product.colors) {
    let color = document.getElementById("colors");
    color.innerHTML += `<option value="${product.colors[colors]}">${product.colors[colors]}</option>`;
  }
}

//récupération de la quantité saisie
function itemQuantity() {
  let quantity = document.getElementById("quantity");
  return quantity.value;
}

//récupération de la couleur sélectionnée
function itemColor() {
  let color = document.getElementById("colors");
  return color.value;
}

//configuration du bouton "Ajouter au panier"
const addToCartBtn = document.getElementById("addToCart");
addToCartBtn.addEventListener("click", () => { //au clic
  let quantity = parseInt(itemQuantity()); //conversion de la quantité en nombre entier
  let color = itemColor();
  addToCart(id, color, quantity); //ajout au panier
});

//ajout au panier
function addToCart(id, color, quantity) {

  //contrôle des données saisies
  while (color == "" || quantity <= 0 || quantity >= 101 || Number.isNaN(quantity)) {
    if (color == "") {
      alert("Veuillez sélectionner une couleur.");
    }
    else if (Number.isNaN(quantity)) {
      alert("L'entrée saisie est incorrecte.");
    }
    else if (quantity <= 0 || quantity >= 101) {
      alert("Veuillez choisir une quantité entre 1 et 100.");
    }

    return;
  }

  //création de l'objet à ajouter au panier 
  let cartJson = {
    id: id,
    color: color,
    quantity: quantity
  }

  let cart = getCart(); //récupération du panier
  console.log(cart);

  //contrôle de la présence d'un produit similaire dans le panier
  const same = cart.findIndex(item => (id === item.id && color === item.color))
  console.log(same);

  //si aucun produit similaire ne s'y trouve, ajout du produit au panier
  if (same == -1) {
    cart.push(cartJson);
    window.alert("Ajouté au panier.");
  }
  //sinon, ajout de la quantité saisie au produit
  else {
    //calcul de la nouvelle quantité
    const item = cart.find(item => (id === item.id && color === item.color))
    let itemQuantity = item.quantity + quantity;
    //contrôle de la nouvelle quantité
    if (itemQuantity > 100) {
      alert("Vous ne pouvez pas sélectionner plus de 100 articles.");
    }
    else {
      //mise à jour de la quantité
      item.quantity = itemQuantity;
      console.log(item);
      window.alert("Ajouté au panier.");
    }
    console.log(itemQuantity);
  }

  saveCart(cart); //enregistrement du panier
}

//enregistrement du panier en localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}


//récupération du panier depuis le localStorage
function getCart() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  //si absence de panier, création d'un tableau vide
  if (cart == null) {
    cart = [];
  }
  return cart;
}