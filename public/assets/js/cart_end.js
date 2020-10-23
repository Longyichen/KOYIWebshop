//目前的问题：购物车数目不能同步到数组中，jQuery不能知道是哪行对它进行了调用，以至于无法让pid和数量进行对应，不能对数组内容产生影响
// addItem("1234");
// addItem("12345");
// loadCart();
// loadMainCart();
// setTotalPrice();

//请求购物车pid数组
//additem
//



function loadMainCart(){
    var cart = document.getElementById("cartList-body");
    while(cart.hasChildNodes()) //还存在子节点时 循环继续
    {
        cart.removeChild(cart.firstChild);
    }
    for(let i=0;i<cartList.length;i++){
        var mainCartList = document.getElementById("cartList-body");
        var mainCartList_tr = document.createElement('tr');
        mainCartList_tr.id = "main-"+cartList[i].pid;
        console.log(mainCartList_tr.id);
        mainCartList.appendChild(mainCartList_tr);

        var mainCartList_img = document.createElement('td');
        mainCartList.className = "product-thumbnail";
        mainCartList_tr.appendChild(mainCartList_img);


        var mainCartList_img_a = document.createElement('a');
        mainCartList_img.appendChild(mainCartList_img_a);

        var mainCartList_img_img = document.createElement('img');
        mainCartList_img_img.src =cartList[i].image;
        mainCartList_img_img.alt = "";
        mainCartList_img_img.width = 100;
        mainCartList_img_img.height = 100;
        mainCartList_img_a.appendChild(mainCartList_img_img);

        var mainCartList_name = document.createElement('td');
        mainCartList_name.className="product-name";
        mainCartList_tr.appendChild(mainCartList_name);

        var mainCartList_name_a = document.createElement('a');
        mainCartList_name_a.innerText = cartList[i].name;
        mainCartList_name.appendChild(mainCartList_name_a);

        var mainCartList_price = document.createElement('td');
        mainCartList_price.className="product-price-cart";
        mainCartList_tr.appendChild(mainCartList_price);

        var mainCartList_price_sp = document.createElement('span');
        mainCartList_price_sp.className="amount";
        mainCartList_price_sp.innerText = "$"+cartList[i].price;
        mainCartList_price.appendChild(mainCartList_price_sp);

        var mainCartList_number = document.createElement('td');
        mainCartList_number.className = "product-quantity";
        mainCartList_tr.appendChild(mainCartList_number);

        var mainCartList_number_div = document.createElement('div');
        mainCartList_number_div.className = "cart-plus-minus";
        mainCartList_number.appendChild(mainCartList_number_div);

        var mainCartList_number_input = document.createElement('input');
        mainCartList_number_input.className = "cart-plus-minus-box";
        mainCartList_number_input.type = "text";
        mainCartList_number_input.name = "qtybutton";
        mainCartList_number_input.value = cartList[i].number
        mainCartList_number_input.id = cartList[i]+"number-box"
        mainCartList_number_div.appendChild(mainCartList_number_input);

        var mainCartList_subtotal = document.createElement('td');
        mainCartList_subtotal.className = "product-subtotal";
        mainCartList_subtotal.innerText = "$"+cartList[i].price*cartList[i].number;
        mainCartList_tr.appendChild(mainCartList_subtotal);

        var mainCartList_remove = document.createElement('td');
        mainCartList_remove.className = "product-remove";
        mainCartList_tr.appendChild(mainCartList_remove);

        var mainCartList_pencil_a = document.createElement('a');
        mainCartList_pencil_a.href = "product-details-"+cartList[i].pid+".html";
        mainCartList_remove.appendChild(mainCartList_pencil_a);

        var mainCartList_pencil_i = document.createElement('i');
        mainCartList_pencil_i.className = "la la-pencil";
        mainCartList_pencil_a.appendChild(mainCartList_pencil_i);

        var mainCartList_delete_a = document.createElement('a');
        mainCartList_delete_a.setAttribute("onclick","mainItemDelete("+'"'+cartList[i].pid+'"'+")");
        console.log(mainCartList_delete_a.onclick);
        mainCartList_remove.appendChild(mainCartList_delete_a);

        var mainCartList_delete_i = document.createElement('i');
        mainCartList_delete_i.className = "la la-close";
        mainCartList_delete_i.setAttribute("onclick","mainItemDelete("+'"'+cartList[i].pid+'"'+")");
        mainCartList_delete_a.appendChild(mainCartList_delete_i);
    }

}

function mainItemDelete(pid){

    console.log("删除调用成功");
    for (var key in cartList) {
        if (cartList[key].pid === pid) {
            console.log("找到要删除的物品了")
            cartList.splice(key, 1);
        }
    }
    deleteItem(pid);
    var item = document.getElementById("main-"+pid);
    console.log(item);
    item.remove();
    loadOnlineCart();
    loadCart();
    loadMainCart();
}

function setTotalPrice(){
    document.getElementById("mini-cart-price").innerText = "$"+getCartTotal();
    document.getElementById("shop-total").innerText = "$"+getCartTotal()+".00";
    document.getElementById("order-total-price").innerText = "$"+getCartTotal()+".00";
    document.getElementById("Grand-total").innerText = "$"+getCartTotal()+".00"
    loadMainCart();
}

function refreshTotalWithShipping(mode) {
    var standard = document.getElementById("shipping-standard");
    var express = document.getElementById("shipping-express");
    if(mode){
        express.checked = true;
        standard.checked = false;
    }
    else{
        express.checked = false;
        standard.checked = true;
    }
}

function refreshItemNum(pid) {
    var numberBox = document.getElementById(pid+"number-box");
    var number = numberBox.value;
    alert(number);
}

function clearMainCart() {
    while(cartList[0]!=null){
        mainItemDelete(cartList[0].pid);
    }
}
/*
function orderDisplay(oid,date,status,total,){
    var orderForm = document.getElementById("orderForm");
    var tr = document.createElement('tr');
    orderForm.appendChild(tr);

    var orderid = document.createElement('td');
    orderid.innerText = oid;
    tr.appendChild(orderid);

    var Date =
}
*/

