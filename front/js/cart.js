console.log("Page pannier");

showCart(); //affichage du panier

//récupération du panier depuis le localStorage
function getCart() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    //si absence de panier, création d'un tableau vide
    if (cart == null) {
        cart = [];
    }
    console.log(cart);
    return cart;
}

//enregistrement du panier en localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

//affichage du panier
async function showCart() {
    let cart = getCart(); //récupération du panier
    //triage des articles du panier par id
    cart.sort((a, b) => {
        if (a.id < b.id)
            return -1;
        if (a.id > b.id)
            return 1;
        return 0;
    })
    console.log(cart);
    //pour chaques articles
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        console.log(item.id);
        //récupération du produit depuis l'api
        await fetch(`http://localhost:3000/api/products/${item.id}`)
            .then((data) => data.json())
            .then((product) => {

                showItem(product, item.quantity, item.color); //affichage de l'article
                showTotalPrice(); //affichage du prix total des articles
            })

    }
    showTotalQuantity(); //affichage de la quantité totale d'articles
}

//affichage de l'article
function showItem(item, quantity, color) {

    //integration de l'article dans l'html

    //affichage du produit
    let sectionItems = document.getElementById("cart__items");
    let article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = `${item._id}`
    article.dataset.color = `${color}`
    sectionItems.appendChild(article);

    //formatage du prix
    let price = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(item.price * quantity);

    //affichage de l'image
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

    //affichage de la description
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

    //configuration de l'input de qantité
    let settingsQuantityInput = document.createElement("input");
    settingsQuantityInput.type = "number";
    settingsQuantityInput.classList.add("itemQuantity")
    settingsQuantityInput.name = "itemQuantity"
    settingsQuantityInput.min = "1";
    settingsQuantityInput.max = "100";
    //affichage de la quantité
    settingsQuantityInput.value = `${quantity}`;
    settingsQuantity.appendChild(settingsQuantityP);
    settingsQuantity.appendChild(settingsQuantityInput);
    content.appendChild(contentSettings);
    //mise à jour du prix de l'article
    settingsQuantityInput.addEventListener("input", () => { //lorsque la quantité est modifiée
        modifyLine(item._id,color,item.price); //modification de l'artcicle
        //mise à jour de la description de l'article
        contentDescription.innerHTML = `<h2>${item.name}</h2>
        <p>${color}</p>
        <p>${newPrice}</p>`;
    })

    //configuration de la suppression
    let settingsDelete = document.createElement("div");
    contentSettings.appendChild(settingsDelete);
    settingsDelete.classList.add("cart__item__content__settings__delete")
    let deleteItemP = document.createElement("p");
    settingsDelete.appendChild(deleteItemP);
    deleteItemP.classList.add("deleteItem");
    deleteItemP.innerText = "Supprimer";
    //suppression de l'article
    deleteItemP.addEventListener("click", () => { //au clic
        deleteLine(item._id, color); //supprimer l'article
    })
}

//supprimer l'article
function deleteLine(id, color) {

    //suppression de l'article du localStorage
    let cart = getCart(); //récupération du panier
    //ciblage de l'article à supprimer
    const index = cart.findIndex(item => (id === item.id && color === item.color));
    //suppression de l'article
    cart.splice(index, 1);
    saveCart(cart); //enregistrement du panier

    //suppression de l'article du DOM
    //ciblage de l'article à supprimer
    let deleteItem = document.querySelector(`article[data-id="${id}"][data-color="${color}"]`);
    console.log(deleteItem);
    //suppression de l'article
    deleteItem.remove();

    showTotalPrice(); //afficher le prix total
    showTotalQuantity(); //afficher la quantité totale
}

//modifier l'article
function modifyLine(id, color, price) {
   
    let cart = getCart(); //récupération du panier
    //ciblage de l'article à modifier
    const item = cart.find(item => (id === item.id && color === item.color));
    //récupération de la nouvelle quantité
    let newQuantity = parseInt(document.querySelector(`article[data-id="${id}"][data-color="${color}"]`).getElementsByTagName('input')[0].value);

    //contrôle de la quantité
    if (newQuantity <= 0 || newQuantity >= 101 || Number.isNaN(newQuantity)){
        alert("saisie incorrecte");
        document.querySelector(`article[data-id="${id}"][data-color="${color}"]`).getElementsByTagName('input')[0].value = item.quantity;
    }
    else{
        //mise à jour de la quantité
        item.quantity = newQuantity;
        //mise à jour du prix
        newPrice = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price * newQuantity);
        
        saveCart(cart); //enregistrement du panier
        showTotalPrice(); //affichage du prix total
        showTotalQuantity(); //affichage de la quantité toatale d'articles
    }
}

//affichage de la quantité totale d'articles
function showTotalQuantity(){

    //integration de la quantité totale dans l'html
    let lineQuantity = document.getElementsByClassName('itemQuantity');
    let itemQuantity = lineQuantity.length;
    totalQuantity = 0;
    
    //calcul de la quantité totale
    for (let i = 0; i < itemQuantity; i++) {
        totalQuantity += lineQuantity[i].valueAsNumber;
    }

    //affichage de la quantité totale
    let valueQuantity = document.getElementById('totalQuantity');
    valueQuantity.innerHTML = parseInt(totalQuantity);
}

//affichage du prix total
function showTotalPrice(){

    let cart = getCart(); //récupération du panier
    let totalPrice = 0; //initialisation du prix total

    //pour chaques articles
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        //récupération du produit depuis l'api
        fetch(`http://localhost:3000/api/products/${item.id}`)
            .then((data) => data.json())
            .then((product) => {

                //ajout du prix de l'article au prix total 
                totalPrice += product.price * item.quantity;
                //affichage du prix total
                document.getElementById("totalPrice")
                .innerHTML = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totalPrice);
            })

    }
}

//contrôle du prénom
function checkFirstName(){
    //récupération des données
    const firstName = document.getElementById("firstName").value;
    const error = document.getElementById("firstNameErrorMsg");
    //configurations de la syntaxe
    const regex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-]+$/;

    //contrôle de la syntaxe
    if(firstName.match(regex)){
        error.innerText = "";
        return true;
    }
    else{
        error.innerText = "Champ invalide.";
        return false;
    }
}
document.getElementById("firstName").addEventListener("input", () => { //lors de la saisie
    checkFirstName(); //contrôle du prénom
});

//contrôle du nom
function checkLastName(){
    //récupération des données
    const lastName = document.getElementById("lastName").value;
    const error = document.getElementById("lastNameErrorMsg");
    //configurations de la syntaxe
    const regex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ -]+$/;

    //contrôle de la syntaxe
    if(lastName.match(regex)){
        error.innerText = "";
        return true;
    }
    else{
        error.innerText = "Champ invalide.";
        return false;
    }
}
document.getElementById("lastName").addEventListener("input", () => { //lors de la saisie
    checkLastName(); //contrôle du nom
});

//contrôle de l'adresse
function checkAddress(){
    //récupération des données
    const address = document.getElementById("address").value;
    const error = document.getElementById("addressErrorMsg");
    //configurations de la syntaxe
    const regex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ0-9999 -]+$/;

    //contrôle de la syntaxe
    if(address.match(regex)){
        error.innerText = "";
        return true;
    }
    else{
        error.innerText = "Champ invalide.";
        return false;
    }
}
document.getElementById("address").addEventListener("input", () => { //lors de la saisie
    checkAddress(); //contrôle de l'adresse
});

//contrôle de la ville
function checkCity(){
    //récupération des données
    const city = document.getElementById("city").value;
    const error = document.getElementById("cityErrorMsg");
    //configurations de la syntaxe
    const regex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ -]+$/;

    //contrôle de la syntaxe
    if(city.match(regex)){
        error.innerText = "";
        return true;
    }
    else{
        error.innerText = "Champ invalide.";
        return false;
    }
}
document.getElementById("city").addEventListener("input", () => { //lors de la saisie
    checkCity(); //contrôle de la ville
});

//contrôle de l'email
function checkEmail(){
    //récupération des données
    const email = document.getElementById("email").value;
    const error = document.getElementById("emailErrorMsg");
    //configurations de la syntaxe
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //contrôle de la syntaxe
    if(email.match(regex)){
        error.innerText = "";
        return true;
    }
    else{
        error.innerText = "Champ invalide.";
        return false;
    }
}
document.getElementById("email").addEventListener("input", () => { //lors de la saisie
    checkEmail(); //contrôle de l'email
});

//configuration du passage de commande
const order = document.getElementById("order");
order.addEventListener("click", (e) => { //au clic
    e.preventDefault();
    let cart = getCart(); //récupération du panier
    //si présence d'articles dans le panier
    if (cart ==! null || cart.length > 0){
        //si le formulaire est rempli
        if (checkFirstName() & checkLastName() & checkAddress() & checkCity() & checkEmail()){
            //création de l'objet contact
            let contact = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                email: document.getElementById("email").value,
              }
              //création d'un tableau produits
              let productsId = [];
              //ajout de l'id des produits commandés dans le tableau
              for (let i = 0; i < cart.length; i++) {
                productsId.push(cart[i].id);
              }
              //création de l'objet orderN
              let orderN = {
                contact: contact,
                products: productsId,
              }
              console.log(orderN);
              //envois des données au serveur depuis l'api
              fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    body: JSON.stringify(orderN),
                    //validation de la présence et des types des champ
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then((data) => data.json())
                .then((order) => {
                    console.log(order);
                    //redirection vers la page confirmation
                    window.location.href=`./confirmation.html?id=${order.orderId}`; //url contenant l'id de la commande
                })
        }
        //sinon, message d'erreur
        else{
            window.alert("Veuillez remplir le formulaire.");
        }
    }
    //sinon, message d'erreur
    else{
        window.alert("Votre panier est vide !");
    }
});