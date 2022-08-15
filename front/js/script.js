console.log("Page d'accueil");

//asking for server stored products
fetch("http://localhost:3000/api/products/")
    .then((product) => product.json())
    .then((products) => {

        showProducts(products)

    })

//products insertion into "items" blocs
function showProducts(products) {

    for (let product of products) {
        let sectionItems = document.getElementById("items");
        let a = document.createElement("a");
        a.href = `product.html?id=${product._id}`
        sectionItems.appendChild(a);

        let article = document.createElement("article");
        a.appendChild(article);

        let img = document.createElement("img");
        img.src = `${product.imageUrl}`;
        img.alt = `${product.altTxt}`;
        article.appendChild(img);

        let h3 = document.createElement("h3");
        h3.classList.add("ProductName");
        h3.innerText = `${product.name}`
        article.appendChild(h3);

        let p = document.createElement("p");
        p.classList.add("ProductDescription");
        p.innerText = `${product.description}`
        article.appendChild(p);
    };
}