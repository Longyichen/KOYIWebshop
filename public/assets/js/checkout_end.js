loadCheckOutList();
setTotalPrice();
function setTotalPrice(){
    document.getElementById("order-total").innerText = "$"+getCartTotal()+".00";
    document.getElementById("mini-cart-price").innerText = "$"+getCartTotal();
    document.getElementById("shop-total").innerText = "$"+getCartTotal()+".00";

}

function loadCheckOutList() {
    loadOnlineCart();
    var itemList = document.getElementById("itemList");

    for (let i=0;i<cartList.length;i++) {
    var itemList_li = document.createElement('li');
    itemList_li.innerText = cartList[i].name + ' X ' + cartList[i].number;
    itemList.appendChild(itemList_li);
    var itemList_sp = document.createElement('span');
    itemList_sp.innerText = '$' + cartList[i].price * cartList[i].number;
    itemList_li.appendChild(itemList_sp);

    }
}

function submitOrder() {
    //获取数据
    var uid = sessionStorage.getItem("loginUid");
    // uid = 1;

    var date = new Date();
    var total = getCartTotal();
    var subtotal= [];
    let bid = 1;
    //账单信息上传
    $.ajax({
        url: "/checkout/billLogin",
        dataType: "json",
        data: {
            // "pid": pid,
            // "uid": uid,
            // "amount": getCartNum(),
            "date": date,
            "total":total,
            "status": "Approved"
        },
        type: "POST",
        timeout: 36000,
        success: function (datas, textStatus) {
            console.log(datas);
            bid = datas.insertId;
        }
    })

    // let bid = getLastInsert();
    //
    //订单信息上传
    for(var key in cartList){

        subtotal[key] = cartList[key].number*cartList[key].price;

        $.ajax({
            url: "/checkout/orderLogin",
            dataType: "json",
            data: {
                "pid": cartList[key].pid,
                "uid": uid,
                "amount": cartList[key].number,
                "time": date,
                "totalprice":subtotal[key],
                "status": "Approved",
                "bid": bid
            },
            type: "POST",
            timeout: 36000,
            success: function (datas, textStatus) {
                console.log(datas);
            }
        })

        //重新设置购物车状态
        //应该根据idIndent来设置
        $.ajax({
            url: "/cart/cartUpdate",
            dataType: "json",
            data: {
                "uid": uid,
                "pid": cartList[key].pid,
                "date": date,
                "num":0,
                "status": 0
            },
            type: "POST",
            timeout: 36000,
            success: function (datas, textStatus) {
                console.log(datas);
                alert("Thanks for your purchase! Have a Nice Day!");
                window.location.href = "/shop";
            }
        })
    }

}
