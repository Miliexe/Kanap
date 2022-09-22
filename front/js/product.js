console.log("Page produit");
console.log(window.location);

let url = new URL(window.location)

let id = url.searchParams.get("id")

console.log(id);

fetch(`http://localhost:3000/api/products/${id}`)
  .then((data) => data.json())
  .then((product) => {

    showProduct(product)

  })

function showProduct(product) {

  let divImg = document.querySelector(".item__img");
  let img = document.createElement("img");
  img.src = `${product.imageUrl}`;
  img.alt = `${product.altTxt}`;
  divImg.appendChild(img);

  let title = document.getElementById("title");
  title.innerText = `${product.name}`;

  let price = document.getElementById("price");
  price.innerText = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(product.price);

  let description = document.getElementById("description");
  description.innerText = `${product.description}`;

  for (let colors in product.colors) {
    let color = document.getElementById("colors");
    color.innerHTML += `<option value="${product.colors[colors]}">${product.colors[colors]}</option>`;
  }
}

function itemQuantity() {
  let quantity = document.getElementById("quantity");
  return quantity.value;
}

function itemColor() {
  let color = document.getElementById("colors");
  return color.value;
}


const addToCartBtn = document.getElementById("addToCart");
addToCartBtn.addEventListener("click", () => {
  let quantity = parseInt(itemQuantity());
  let color = itemColor();
  addToCart(id, color, quantity);
});

function addToCart(id, color, quantity) {

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

  let cartJson = {
    id: id,
    color: color,
    quantity: quantity
  }

  /* let key = localStorage.length +1;
   localStorage.setItem(`item${key}`,cart);
   console.log(`ajout de :${quantity} Kanap ${color} `);
   
   for (var i = 0; i < localStorage.length; i++)
   console.log( localStorage.key(i) +" has value " + localStorage[localStorage.key(i)] )
 
   alert("L'article a été ajouté au panier.");*/
  let cart = getCart();
  console.log(cart);
  const same = cart.findIndex(item => (id === item.id && color === item.color))
  console.log(same);
  if (same == -1) {
    cart.push(cartJson);
    window.alert("Ajouté au panier.");
  }
  else {
    const item = cart.find(item => (id === item.id && color === item.color))
    let itemQuantity = item.quantity + quantity;
    if (itemQuantity > 100) {
      alert("Vous ne pouvez pas sélectionner plus de 100 articles.");
    }
    else {
      item.quantity = itemQuantity;
      console.log(item);
      window.alert("Ajouté au panier.");
    }
    console.log(itemQuantity);
  }

  saveCart(cart);
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));

}

function getCart() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart == null) {
    cart = [];
  }
  return cart;
}