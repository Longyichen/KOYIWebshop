var express = require('express');
var router = express.Router();

// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');

// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('cart', { title: 'cart' });
});

//获取购物车信息
//返回pid
router.post('/cartProduct', function (req, res, next) {
    let idCustomer = req.body.uid;

    pool.getConnection(function (err, connection){

        //判断购物车是否为空
        const $sql = "SELECT\n" +
            "Product.idProdcut,\n" +
            "Product.`name`,\n" +
            "Product.price,\n" +
            "Cart.num,\n" +
            "Product.declaration,\n" +
            "Img.URL\n" +
            "FROM\n" +
            "(Customer ,\n" +
            "Product)\n" +
            "INNER JOIN Cart ON Cart.Customer_idCustomer = Customer.idCustomer AND Cart.Product_idProduct = Product.idProdcut\n" +
            "INNER JOIN Img ON Img.Product_idProduct = Product.idProdcut\n" +
            "WHERE\n" +
            "Cart.`status` = 1 AND\n" +
            "Customer.idCustomer = ?";

        connection.query($sql, [idCustomer], function (err, result) {
            var resultJson = result;
            console.log(resultJson.length);
            if (resultJson.length === 0) {
                result = {
                    code: 300,
                    msg: '购物车为空'
                };
                res.json(result);
                connection.release();
            }else {
                res.json(result); // 以json形式，把操作结果返回给前台页面
                connection.release();// 释放连接
            }
        })
    });
})

//车内物品删改
router.post('/cartUpdate', function (req, res, next) {
    let uid = req.body.uid;
    let pid = req.body.pid;
    let date = req.body.date;
    let num = req.body.num;
    let status = req.body.status;
    console.log(req.body);

    pool.getConnection(function (err, connection) {

        //判断车内是否有该产品
        const $sql = "SELECT\n" +
            "*\n" +
            "FROM\n" +
            "Cart\n" +
            "WHERE\n" +
            "Cart.Product_idProduct = ? AND\n" +
            "Cart.Customer_idCustomer = ? AND\n" +
            "Cart.`status` = 1\n";

        connection.query($sql, [pid, uid], function (err, result) {
            var resultJson = result;
            console.log(resultJson.length);

            if (resultJson.length === 0) {
                result = {
                    code: 300,
                    msg: '车内不存在该产品'
                };
                res.json(result); // 以json形式，把操作结果返回给前台页面
                connection.release();// 释放连接
            }
            else {
                //对产品进行信息更新
                const $sql1 = "UPDATE Cart \n" +
                    "SET date = ?,\n" +
                    "num = ?,\n" +
                    "`status` = ? \n" +
                    "WHERE\n" +
                    "\tCustomer_idCustomer = ? \n" +
                    "\tAND Product_idProduct = ?";
                connection.query($sql1, [date, num, status, uid, pid], function (err, result) {
                    console.log(result);

                    res.json(result); // 以json形式，把操作结果返回给前台页面
                    connection.release();// 释放连接
                });
            }

        })
    })
})
//添加购物车商品
router.post('/cartLogin', function (req, res, next){
    console.log(req.body);

    let date = req.body.date;
    let num = req.body.num;
    let pid = req.body.pid;
    let uid = req.body.uid;
    let status = 1;
    //review id

    pool.getConnection(function (err, connection) {
        const $sql = "INSERT INTO Cart( date, num, Product_idProduct, Customer_idCustomer," +
            " status) " +
            "VALUES(?,?,?,?,?)";

        connection.query($sql, [date, num, pid, uid, status],
            function (err, result) {
                if (!result) {
                    result = {
                        code: 400,
                        msg: '购物车上传失败'
                    };
                    res.json(result);
                }else {
                    let result = {
                        code: 200,
                        msg: '购物车上传成功'
                    };
                    res.json(result);
                }
                connection.release();// 释放连接
            })
    })
});



module.exports = router;