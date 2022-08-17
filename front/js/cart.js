console.log("Page pannier");

getCart();

function getCart() {
    for (var i = 1; i <= localStorage.length; i++){
        let cart = JSON.parse(localStorage.getItem(`item${i}`));
        console.log(cart);
    }
}