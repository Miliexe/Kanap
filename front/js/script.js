console.log("Page d'accueil");

//asking for server stored products
fetch("http://localhost:3000/api/products/")
    .then((product) => product.json())
    .then((products) => {

        //products insertion into "items" blocs
        for(let product in products) {
            document.getElementById("items")
            .innerHTML +=
            `<a href="product.html?id=${products[product]._id}">
                <article>
                    <img src="${products[product].imageUrl}" alt="${products[product].altTxt}">
                    <h3 class="ProductName">${products[product].name}</h3>
                    <p class="productDescription">${products[product].description}</p>
                </article>
            </a>`
            console.log("item create succesfull");
        };
    })