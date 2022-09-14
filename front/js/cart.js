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

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

async function showCart() {
    let cart = getCart();
    cart.sort((a, b) => {
        if (a.id < b.id)
            return -1;
        if (a.id > b.id)
            return 1;
        return 0;
    })
    console.log(cart);
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        console.log(item.id);
        await fetch(`http://localhost:3000/api/products/${item.id}`)
            .then((data) => data.json())
            .then((product) => {

                showItem(product, item.quantity, item.color);
                showTotalPrice();
            })

    }
    showTotalQuantity();
}

function showItem(item, quantity, color) {
    let sectionItems = document.getElementById("cart__items");
    let article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = `${item._id}`
    article.dataset.color = `${color}`
    sectionItems.appendChild(article);

    let price = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(item.price * quantity);

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
    settingsQuantityInput.addEventListener("input", () => {
        modifyLine(item._id,color,item.price);
        contentDescription.innerHTML = `<h2>${item.name}</h2>
        <p>${color}</p>
        <p>${newPrice}</p>`;
    })

    let settingsDelete = document.createElement("div");
    contentSettings.appendChild(settingsDelete);
    settingsDelete.classList.add("cart__item__content__settings__delete")
    let deleteItemP = document.createElement("p");
    settingsDelete.appendChild(deleteItemP);
    deleteItemP.classList.add("deleteItem");
    deleteItemP.innerText = "Supprimer";
    deleteItemP.addEventListener("click", () => {
        deleteLine(item._id, color);
    })
}

function deleteLine(id, color) {
    let cart = getCart();
    const index = cart.findIndex(item => (id === item.id && color === item.color));
    cart.splice(index, 1);

    let deleteItem = document.querySelector(`article[data-id="${id}"][data-color="${color}"]`);
    console.log(deleteItem);
    deleteItem.remove();
    saveCart(cart);

    showTotalPrice();
    showTotalQuantity();
}

function modifyLine(id, color, price) {
   
    let cart = getCart();

    const item = cart.find(item => (id === item.id && color === item.color));
    let newQuantity = document.querySelector(`article[data-id="${id}"][data-color="${color}"]`).getElementsByTagName('input')[0].value;

    if (newQuantity <= 0 || newQuantity >= 101 || Number.isNaN(newQuantity)){
        alert("saisie incorrecte");
        document.querySelector(`article[data-id="${id}"][data-color="${color}"]`).getElementsByTagName('input')[0].value = item.quantity;
    }
    else{
        item.quantity = newQuantity;
        newPrice = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price * newQuantity);
        
        saveCart(cart);
        showTotalPrice();
        showTotalQuantity();
    }
}


function showTotalQuantity(){

    let lineQuantity = document.getElementsByClassName('itemQuantity');
    let itemQuantity = lineQuantity.length;
    totalQuantity = 0;
    
    for (let i = 0; i < itemQuantity; i++) {
        totalQuantity += lineQuantity[i].valueAsNumber;
    }

    let valueQuantity = document.getElementById('totalQuantity');
    valueQuantity.innerHTML = totalQuantity;
}

async function showTotalPrice(){
    let cart = getCart();

    let totalPrice = 0;

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        await fetch(`http://localhost:3000/api/products/${item.id}`)
            .then((data) => data.json())
            .then((product) => {

                totalPrice += product.price * item.quantity;
                document.getElementById("totalPrice")
                .innerHTML = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totalPrice);
            })

    }
}


function checkFirstName(){
    const firstName = document.getElementById("firstName").value;
    const error = document.getElementById("firstNameErrorMsg");
    const regex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-]+$/;

    if(firstName.match(regex)){
        error.innerText = "";
        return true;
    }
    else{
        error.innerText = "Champ invalide.";
        return false;
    }
}

document.getElementById("firstName").addEventListener("input", () => {
    checkFirstName();
});

const order = document.getElementById("order");
order.addEventListener("click", (e) => {
    e.preventDefault();
    let cart = getCart();
    if (cart ==! null || cart.length > 0){
        if (checkFirstName()){
            let contact = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                email: document.getElementById("email").value,
              }
              let productsId = [];
              
              for (let i = 0; i < cart.length; i++) {
                productsId.push(cart[i].id);
              }
              let orderN = {
                contact: contact,
                products: productsId,
              }
              console.log(orderN);
    
              fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    body: JSON.stringify(orderN),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then((data) => data.json())
                .then((order) => {
                    console.log(order);
                    window.location.href=`./confirmation.html?id=${order.orderId}`;
                })
        }
        else{
            window.alert = "Veuillez remplir le formulaire."
        }
    }
    else{
        window.alert = "Votre panier est vide !" 
    }
});