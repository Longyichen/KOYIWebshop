
function setTotalPrice() {
    var totalPrice = document.getElementById("cartTotalPrice");
    totalPrice.innerText = "$"+getCartTotal()+".00";
    document.getElementById("item-number").innerText = getCartNum()+" item";
}
setTotalPrice();
// loadCart();