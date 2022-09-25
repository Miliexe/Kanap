console.log("Page d'accueil");

//récupération des produits depuis l'api
fetch("http://localhost:3000/api/products/")
    .then((product) => product.json())
    .then((products) => {

        showProducts(products) //affichage des produits

    })


//affichage des produits
function showProducts(products) {

    //integration des produits dans l'html
    for (let product of products) { 
        
        //lien vers la page du produit
        let sectionItems = document.getElementById("items");
        let a = document.createElement("a");
        a.href = `product.html?id=${product._id}` 
        sectionItems.appendChild(a);

        //affichage de l'article
        let article = document.createElement("article");
        a.appendChild(article);

        //affichage de l'image
        let img = document.createElement("img");
        img.src = `${product.imageUrl}`;
        img.alt = `${product.altTxt}`;
        article.appendChild(img);

        //affichage du nom
        let h3 = document.createElement("h3");
        h3.classList.add("ProductName");
        h3.innerText = `${product.name}`
        article.appendChild(h3);

        //affichage de la description
        let p = document.createElement("p");
        p.classList.add("ProductDescription");
        p.innerText = `${product.description}`
        article.appendChild(p);
    };
}