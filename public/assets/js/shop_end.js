var price_high=0;
var price_low=0;
setTotalPrice();
loadShop();
function searchByPrice() {
    //从数据库获取全部商品信息
    alert("high:"+price_high+"low:"+price_low);
    var i=0;
    var cart = document.getElementById("shop-list");
    while(cart.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        cart.removeChild(cart.firstChild);
    }

    while(productList[i] != null){
        if(productList[i].price<=price_high&&productList[i].price>=price_low){
            console.log(productList);

            var shop = document.getElementById("shop-list");
            var setSize = document.createElement('div');
            setSize.className = "col-xl-4 col-lg-6 col-md-6 col-sm-6";
            shop.appendChild(setSize);

            var productWrap = document.createElement('div');
            productWrap.className="product-wrap mb-35";
            setSize.appendChild(productWrap);

            var productImg = document.createElement('div');
            productImg.className = "product-img mb-15";
            productWrap.appendChild(productImg);

            var productImg_a = document.createElement('a');
            productImg_a.href = "product?pid="+productList[i].pid;////////////////////////
            productImg.appendChild(productImg_a);

            var productImg_img = document.createElement('img');
            productImg_img.src = productList[i].image;////////////////////////////////
            productImg_img.alt = "product";
            productImg_a.appendChild(productImg_img);

            var productContent = document.createElement('div');
            productContent.className = "product-content";
            productWrap.appendChild(productContent);

            var productContent_sp = document.createElement('span');
            productContent_sp.innerText = productList[i].type;/////////////////////////
            productContent.appendChild(productContent_sp);

            var productContent_h4 = document.createElement('h4');
            productContent.appendChild(productContent_h4);

            var productContent_a = document.createElement('a');
            productContent_a.href = "product?pid="+productList[i].pid;////////////////////
            productContent_a.innerText = productList[i].name;/////////////////////////////
            productContent_h4.appendChild(productContent_a);

            var productContent_add = document.createElement('div');
            productContent_add.className = "price-addtocart";
            productContent.appendChild(productContent_add);

            var productContent_price = document.createElement('div');
            productContent_price.className = "product-price";
            productContent_add.appendChild(productContent_price);

            var productContent_price_sp = document.createElement('span');
            productContent_price_sp.innerText = "$"+productList[i].price+".00";///////////////////
            productContent_price.appendChild(productContent_price_sp);

            var productContent_cart = document.createElement('div');
            productContent_cart.className = "product-addtocart";
            productContent_add.appendChild(productContent_cart);

            var productContent_cart_a = document.createElement('a');
            productContent_cart_a.title = "Add To Cart";
            productContent_cart_a.href = "product?pid="+productList[i].pid;////////////////////
            productContent_cart_a.innerText = "+ Add To Cart";
            productContent_cart.appendChild(productContent_cart_a);
        }
        i++;
    }
}

function setTotalPrice(){
    document.getElementById("mini-cart-price").innerText = "$"+getCartTotal();
    document.getElementById("shop-total").innerText = "$"+getCartTotal()+".00";
    // document.getElementById("item-number").innerText = getCartNum()+" item";
}

function loadShop() {
    var cart = document.getElementById("shop-list");
    while(cart.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        cart.removeChild(cart.firstChild);
    }

    for(let i=0;i<productList.length;i++){
        if(productList[i].name === "default")
            continue;

        var shop = document.getElementById("shop-list");
        var setSize = document.createElement('div');
        setSize.className = "col-xl-4 col-lg-6 col-md-6 col-sm-6";
        shop.appendChild(setSize);

        var productWrap = document.createElement('div');
        productWrap.className="product-wrap mb-35";
        setSize.appendChild(productWrap);

        var productImg = document.createElement('div');
        productImg.className = "product-img mb-15";
        productWrap.appendChild(productImg);

        var productImg_a = document.createElement('a');
        productImg_a.href = "product?pid="+productList[i].pid;/////"product-details.html"///////////////////////////////////
        productImg.appendChild(productImg_a);

        var productImg_img = document.createElement('img');
        productImg_img.src = productList[i].image;////"assets/images/product/pro-hm1-1.jpg"/////////////////////////////////////////////
        productImg_img.alt = "product";
        productImg_a.appendChild(productImg_img);

        var productContent = document.createElement('div');
        productContent.className = "product-content";
        productWrap.appendChild(productContent);

        var productContent_sp = document.createElement('span');
        productContent_sp.innerText = productList[i].type;///"Chair"/////////////////////////////////////////
        productContent.appendChild(productContent_sp);

        var productContent_h4 = document.createElement('h4');
        productContent.appendChild(productContent_h4);

        var productContent_a = document.createElement('a');
        productContent_a.href = "product?pid="+productList[i].pid;//"product-details.html"///////////////////////////////////
        productContent_a.innerText = productList[i].name;///"Golden Easy Spot Chair"//////////////////////////////////
        productContent_h4.appendChild(productContent_a);

        var productContent_add = document.createElement('div');
        productContent_add.className = "price-addtocart";
        productContent.appendChild(productContent_add);

        var productContent_price = document.createElement('div');
        productContent_price.className = "product-price";
        productContent_add.appendChild(productContent_price);

        var productContent_price_sp = document.createElement('span');
        productContent_price_sp.innerText = "$"+productList[i].price+".00";///////////////"$210.00";///////////////////
        productContent_price.appendChild(productContent_price_sp);

        var productContent_cart = document.createElement('div');
        productContent_cart.className = "product-addtocart";
        productContent_add.appendChild(productContent_cart);

        var productContent_cart_a = document.createElement('a');
        productContent_cart_a.title = "Add To Cart";
        productContent_cart_a.href = "product?pid="+productList[i].pid;////////////////////"product-details.html"////////////////
        productContent_cart_a.innerText = "+ Add To Cart";
        productContent_cart.appendChild(productContent_cart_a);
    }
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

function getCategory(e) {
    var sender = (e && e.target) || (window.event && window.event.srcElement);
    var type = sender.id;

    var i=0;
    var cart = document.getElementById("shop-list");
    while(cart.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        cart.removeChild(cart.firstChild);
    }

    while(productList[i] != null){
        if(productList[i].type==type){

            var shop = document.getElementById("shop-list");
            var setSize = document.createElement('div');
            setSize.className = "col-xl-4 col-lg-6 col-md-6 col-sm-6";
            shop.appendChild(setSize);

            var productWrap = document.createElement('div');
            productWrap.className="product-wrap mb-35";
            setSize.appendChild(productWrap);

            var productImg = document.createElement('div');
            productImg.className = "product-img mb-15";
            productWrap.appendChild(productImg);

            var productImg_a = document.createElement('a');
            productImg_a.href = "product?pid="+productList[i].pid;////////////////////////
            productImg.appendChild(productImg_a);

            var productImg_img = document.createElement('img');
            productImg_img.src = productList[i].image;////////////////////////////////
            productImg_img.alt = "product";
            productImg_a.appendChild(productImg_img);

            var productContent = document.createElement('div');
            productContent.className = "product-content";
            productWrap.appendChild(productContent);

            var productContent_sp = document.createElement('span');
            productContent_sp.innerText = productList[i].type;/////////////////////////
            productContent.appendChild(productContent_sp);

            var productContent_h4 = document.createElement('h4');
            productContent.appendChild(productContent_h4);

            var productContent_a = document.createElement('a');
            productContent_a.href = "product?pid="+productList[i].pid;////////////////////
            productContent_a.innerText = productList[i].name;/////////////////////////////
            productContent_h4.appendChild(productContent_a);

            var productContent_add = document.createElement('div');
            productContent_add.className = "price-addtocart";
            productContent.appendChild(productContent_add);

            var productContent_price = document.createElement('div');
            productContent_price.className = "product-price";
            productContent_add.appendChild(productContent_price);

            var productContent_price_sp = document.createElement('span');
            productContent_price_sp.innerText = "$"+productList[i].price+".00";///////////////////
            productContent_price.appendChild(productContent_price_sp);

            var productContent_cart = document.createElement('div');
            productContent_cart.className = "product-addtocart";
            productContent_add.appendChild(productContent_cart);

            var productContent_cart_a = document.createElement('a');
            productContent_cart_a.title = "Add To Cart";
            productContent_cart_a.href = "product?pid="+productList[i].pid;////////////////////
            productContent_cart_a.innerText = "+ Add To Cart";
            productContent_cart.appendChild(productContent_cart_a);
        }
        i++;
    }
}

//从后端接回来数据，填入productList待写，存放在SessionStorage里面
