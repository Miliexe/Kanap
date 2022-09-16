console.log("Page confirmation");

let url = new URL(window.location)

let id = url.searchParams.get("id")

const orderId = document.getElementById("orderId");
orderId.innerText = id;

localStorage.removeItem("cart");