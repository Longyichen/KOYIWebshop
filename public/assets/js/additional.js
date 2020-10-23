// src="http://libs.baidu.com/jquery/1.9.0/jquery.js";
// var script = document.createElement('script');
// script.src = "http://libs.baidu.com/jquery/1.9.0/jquery.js";
// document.head.appendChild(script);

var product = {
    pid:"default",
    name: "default",
    price:100,
    number:0,
    image:"assets/images/cart/cart-4.jpg",
    detail:"haodongxi ,jianyiduochidian",
    type:"",
}
var cartList = [];
var productList = [];

// addItem("1");

function welcomeProcess() {
    console.log("成功调用函数");
    if(sessionStorage.getItem("loginUid")){
        console.log("成功获取本地登录状态");
        document.getElementById("welcome").innerText = "Welcome,";
        var item=document.getElementById("right-upper");
        var welcome_id = document.createElement('p');
        welcome_id.innerText = sessionStorage.getItem("loginUid");
        item.appendChild(welcome_id);
    }
    else{
        document.getElementById("welcome").innerText = "Login For More";
    }
}

function loadCart(){
    var cart = document.getElementById("shopping-cart-list");
    while(cart.hasChildNodes()) //还存在子节点时 循环继续
    {
        cart.removeChild(cart.firstChild);
    }
    for (var key in cartList) {
        var shopList = document.getElementById("shopping-cart-list");
        var li = document.createElement("li");
        li.className = "single-shopping-cart";
        li.id = cartList[key].pid;
        shopList.appendChild(li);


        var img = document.createElement("div");
        li.appendChild(img);
        img.className = "shopping-cart-img";

        var img_a1 = document.createElement('a');
        img.appendChild(img_a1);
        var img_src = document.createElement('img');
        img_a1.appendChild(img_src);
        img_src.alt = "";
        img_src.src = cartList[key].image;
        var img_div2 = document.createElement('div');
        img.appendChild(img_div2);
        img_div2.className = "item-close";
        var img_a2 = document.createElement('a');
        img_div2.appendChild(img_a2);
        var img_i = document.createElement('i');
        img_a2.appendChild(img_i);
        img_i.className = "sli sli-close";

        var itemTitle = document.createElement('div');
        li.appendChild(itemTitle);
        itemTitle.className = "shopping-cart-title";

        var itemTitle_h4 = document.createElement('h4');
        itemTitle.appendChild(itemTitle_h4);
        var itemTitle_a = document.createElement('a');
        itemTitle_h4.appendChild(itemTitle_a);
        itemTitle_a.innerText = cartList[key].name;
        itemTitle_a.style.fontSize = "10px";
        var itemPrice = document.createElement('span');
        itemTitle.appendChild(itemPrice);
        itemPrice.innerText = "$" + cartList[key].price*cartList[key].number;

        var itemDelete = document.createElement('div');
        li.appendChild(itemDelete);
        itemDelete.className = "shopping-cart-delete";

        var itemDelete_a1 = document.createElement('a');
        itemDelete.appendChild(itemDelete_a1);

        var itemDelete_i1 = document.createElement('i');
        itemDelete_i1.className = "la la-trash";
        itemDelete_i1.setAttribute("onclick","deleteItem("+'"'+cartList[key].pid+'"'+")");
        itemDelete_a1.appendChild(itemDelete_i1);

    }
}


function deleteItem(pid){
    for (var key in cartList) {
        if (cartList[key].pid === pid) {
            cartList.splice(key, 1);
        }
    }
    var item = document.getElementById(pid);
    console.log(item);
    item.remove();

    // localStorage.removeItem("cartList");
    console.log(cartList);
    // localStorage.setItem("cartList",cartList);
    //重新设置购物车状态
    //应该根据idIndent来设置
    let uid = sessionStorage.getItem("loginUid");

    $.ajax({
        url: "/cart/cartUpdate",
        dataType: "json",
        data: {
            "uid": uid,
            "pid": pid,
            "date": 0,
            "num":0,
            "status": 0
        },
        type: "POST",
        timeout: 36000,
        success: function (datas, textStatus) {
            console.log(datas);
        }
    })

    loadOnlineCart();
    loadCart();
    setTotalPrice();
}

function clearCart() {
    cartList=null;
    localStorage.setItem("cartList",cartList);
}

function getCartNum() {
    return cartList.length;
}

function addItem(pid) {

    // cartList.push(Object.create(product));
    getItemDetail(pid);
    //  uid = 1;
    // getCartItem(uid);
    //
    // cartList[cartList.length-1].pid = pid;
    // cartList[cartList.length-1].number = 1;
}

function loadOnlineCart() {
    let uid = sessionStorage.getItem("loginUid");
    // cartList.push(Object.create(product));
    getCartItem(uid);
    console.log(cartList);
}


function addProductItem() {
    productList.push(Object.create(product));
}

function getCartTotal() {
    var shopTotal=0;
    for (let i=0;i<cartList.length;i++) {
        shopTotal = shopTotal+cartList[i].price*cartList[i].number;
    }
    return shopTotal

}

function loginCheck() {
    var loginUid = sessionStorage.getItem("loginUid");
    if(loginUid ==null){
        window.location.href ="login-register.html";
    }
    else{
        window.location.href = "my-account.html";
    }
}

//Ajax接口，测试完成，要改success之后的数据！
function getCartItem(uid) {
    // cartList.push(Object.create(product));
    $.ajax({
        url: "/cart/cartProduct",
        dataType: "json",
        async: true,
        data: {
            "uid": uid
        },
        type: "POST",
        timeout: 36000,
        success: function (datas, textStatus) {
            console.log("数据传输成功");
            // console.log(datas[0]);

            cartList = [];
            for(let i in datas){
                let item = datas[i];
                // console.log(item);

                cartList.push(Object.create(product));
                cartList[i].pid = item.idProdcut;
                cartList[i].name = item.name;
                cartList[i].price = item.price;
                cartList[i].number = item.num;
                cartList[i].image = item.URL;

                // console.log(cartList);

            }

            loadCart();
            // loadMainCart();
            setTotalPrice();
        }
    })
}
function getItemDetail(pid) {

    $.ajax({
        url: "/product/productInfo",
        dataType: "json",
        async: true,
        data: {
            "pid": 1
        },
        type: "POST",
        timeout: 36000,
        success: function (datas, textStatus) {
            // console.log("数据传输成功");
            // console.log(datas[0]);
            let item = datas[0];
            // console.log(cartList);
            cartList[cartList.length-1].pid = pid;
            cartList[cartList.length-1].name = item.name;
            cartList[cartList.length-1].price = item.price;
            cartList[cartList.length-1].number = 1;
            cartList[cartList.length-1].detail = item.declaration;
            cartList[cartList.length-1].image = item.URL;
            // console.log(cartList);
            loadCart();
            loadMainCart();
            setTotalPrice();
        }
    })
}
function setCartListToNull() {
    var cartList=[];
}
function setProductListToNull() {
    var productList=[];
}
function redirectLoginCheck(){
    var userid = sessionStorage.getItem("loginUid");
    if (userid == null || userid == "null"){
        // alert("You haven't login yet\nNow direct to the Login/Register page");
        window.location.href = "login-register.html";
    }
}


//这个必须放在bill之后
function checkoutLogin() {
    $.ajax({
        url: "/checkout/billLogin",
        dataType: "json",
        data: {
            "date":date,
            "status": status,
            "total": total
        },
        type: "POST",
        timeout: 36000,
        sucess: function (datas, textStatus) {
            console.log(datas);
        }
    })
    $.ajax({
        url: "/checkout/orderLogin",
        dataType: "json",
        data: {
            "pid": pid,
            "uid": uid,
            "amount": amount,
            "time": time,
            "totalprice":totalprice,
            "status": status,
        },
        type: "POST",
        timeout: 36000,
        success: function (datas, textStatus) {
            console.log(datas);
        }
    })
}

//商店搜索接口
function searchProduct() {
    $.ajax({
        url: "/shop/search",
        dataType: "json",
        data: {
            "word":word,
            "startprice": status,
            "endprice": total,
            "categories":categories
        },
        type: "POST",
        timeout: 36000,
        success: function (datas, textStatus) {
            console.log(datas);
        }
    })

}

//订单详细页 账单查询
function getBill() {
    $.ajax({
        url: "/order/getBill",
        dataType: "json",
        data: {
            "bid":bid,
            "uid": uid
        },
        type: "POST",
        timeout: 36000,
        success: function (datas, textStatus) {
            console.log(datas);
        }
    })

}

function getLastInsert() {
    let result = 1;
    $.ajax({
        url: "/login/lastInsert",
        dataType: "json",
        data: {},
        type: "POST",
        timeout: 36000,
        async : false,
        success: function (data, textStatus) {
            console.log(data.id);
            result = data.id;
        }
    })
    return result;
}



