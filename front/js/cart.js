console.log("Page pannier");

showCart();

function getCart() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart == null) {
      cart = [];
    }
    console.log(cart);
    return cart;
  }

async function showCart(){
    let cart = getCart();
    cart.sort((a, b) => {
      if (a.id < b.id)
          return -1;
      if (a.id > b.id)
          return 1;
      return 0;
    })
    console.log(cart);
    for( var i = 0; i < cart.length; i++){
        let item = cart[i];
        console.log(item.id);
        await fetch(`http://localhost:3000/api/products/${item.id}`)
            .then((data) => data.json())
            .then((product) => {

            showItem(product, item.quantity, item.color);

        })
        
    }
}

function showItem(item, quantity, color){
    let sectionItems = document.getElementById("cart__items");
    let article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = `${item._id}`
    article.dataset.color = `${color}`
    sectionItems.appendChild(article);

    let price = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(item.price*quantity);

    let divImg = document.createElement("div");
    divImg.classList.add("cart__item__img")
    article.appendChild(divImg);
    let img = document.createElement("img");
    img.src = `${item.imageUrl}`;
    img.alt = `${item.altTxt}`;
    divImg.appendChild(img);
    

    let content = document.createElement("div");
    content.classList.add("cart__item__content");
    article.appendChild(content);

    let contentDescription = document.createElement("div");
    contentDescription.classList.add("cart__item__content__description");
    contentDescription.innerHTML = `<h2>${item.name}</h2>
    <p>${color}</p>
    <p>${price}</p>`;
    content.appendChild(contentDescription);

    let contentSettings = document.createElement("div");
    contentSettings.classList.add("cart__item__content__settings");
    let settingsQuantity = document.createElement("div");
    settingsQuantity.classList.add("cart__item__content__settings__quantity");
    contentSettings.appendChild(settingsQuantity);

    let settingsQuantityP = document.createElement("p");
    settingsQuantityP.innerText = "Qté : ";

    let settingsQuantityInput = document.createElement("input");
    settingsQuantityInput.type = "number";
    settingsQuantityInput.classList.add("itemQuantity")
    settingsQuantityInput.name = "itemQuantity"
    settingsQuantityInput.min = "1";
    settingsQuantityInput.max = "100";
    settingsQuantityInput.value = `${quantity}`;
    settingsQuantity.appendChild(settingsQuantityP);
    settingsQuantity.appendChild(settingsQuantityInput);
    content.appendChild(contentSettings);

    let settingsDelete = document.createElement("div");
    contentSettings.appendChild(settingsDelete);
    settingsDelete.classList.add("cart__item__content__settings__delete")
    let deleteItemP = document.createElement("p");
    settingsDelete.appendChild(deleteItemP);
    deleteItemP.classList.add("deleteItem");
    deleteItemP.innerText = "Supprimer";
}


  /*  <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
  <div class="cart__item__img">
    <img src="../images/product01.jpg" alt="Photographie d'un canapé">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>Nom du produit</h2>
      <p>Vert</p>
      <p>42,00 €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article> -->*/