console.log("Page d'accueil");

//asking for server stored products
fetch("http://localhost:3000/api/products/")
    .then((product) => product.json())
    .then((products) => {

    showProducts(products)
        
    })

    //products insertion into "items" blocs
    function showProducts(products){
        
        for(let product in products) {
            let sectionItems= document.getElementById("items");
            let a = document.createElement("a");
            a.href=`product.html?id=${products[product]._id}`
            sectionItems.appendChild(a);

            let article = document.createElement("article");
            a.appendChild(article);

            let img = document.createElement("img");
            img.src= `${products[product].imageUrl}`;
            img.alt= `${products[product].altTxt}`;
            article.appendChild(img);

            let h3 = document.createElement("h3");
            h3.classList.add("ProductName");
            h3.innerText = `${products[product].name}`
            article.appendChild(h3);

            let p = document.createElement("p");
            p.classList.add("ProductDescription");
            p.innerText = `${products[product].description}`
            article.appendChild(p);
        };    
    }