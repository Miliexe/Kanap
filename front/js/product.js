console.log("Page produit");
console.log(window.location);

let url = new URL(window.location)

let id= url.searchParams.get("id")

console.log(id);