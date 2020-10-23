var express = require('express');
var router = express.Router();

// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');

// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('wishlist', { title: 'wishlist' });
});

router.post('/getBill', function (req, res, next){
    let bid = req.body.bid;
    let uid = req.body.uid;

    pool.getConnection(function (err, connection) {

        //判断账单存在
        var $sql = "select * from Bill where idBill = ?";
        connection.query($sql, [bid], function (err, result) {
            var resultJson = result;
            console.log(resultJson.length);

            if (resultJson.length === 0) {
                result = {
                    code: 300,
                    msg: '不存在账单'
                };
                res.json(result);
                connection.release();
            }
            else {
                //订单存在 返回订单信息
                var $sql1 = "SELECT\n" +
                    "Bill.idBill,\n" +
                    "Bill.date,\n" +
                    "Bill.`status`,\n" +
                    "Bill.total\n" +
                    "FROM\n" +
                    "Customer\n" +
                    "INNER JOIN Indent ON Indent.Customer_idCustomer = Customer.idCustomer AND Customer.idCustomer = Indent.Customer_idCustomer\n" +
                    "INNER JOIN Bill ON Bill.idBill = Indent.Bill_idBill AND Indent.Bill_idBill = Bill.idBill\n" +
                    "WHERE\n" +
                    "Customer.idCustomer = ?";

                connection.query($sql1, [uid], function (err, result) {
                    console.log(result);
                    //前端核对是否能对json进行操作

                    res.json(result); // 以json形式，把操作结果返回给前台页面
                    connection.release();// 释放连接
                });
            }
        });
    });
});

//order详细信息查询
router.post('/getOrder', function (req, res, next){
    let bid = req.body.bid;
    console.log(bid);

    pool.getConnection(function (err, connection) {
        var $sql ="SELECT\n" +
            "Indent.idIndent,\n" +
            "Indent.amount,\n" +
            "Indent.IndentTime,\n" +
            "Indent.totalPrice,\n" +
            "Indent.`status`,\n" +
            "Product.`name`,\n" +
            "Product.price,\n" +
            "Product.declaration,\n" +
            "Img.URL\n"+
            "FROM\n" +
            "Bill\n" +
            "INNER JOIN Indent ON Indent.Bill_idBill = Bill.idBill AND Bill.idBill = Indent.Bill_idBill\n" +
            "INNER JOIN Product ON Indent.Product_idProduct = Product.idProdcut\n" +
            "INNER JOIN Img ON Img.Product_idProduct = Product.idProdcut\n"+
            "WHERE\n" +
            "Bill.idBill = ?";

        connection.query($sql, [bid], function (err, result) {
            if (result.length === 0) {
                result = {
                    code: 300,
                    msg: '订单查询失败'
                };
                res.json(result);
                connection.release();
            }
            else {
                res.json(result); // 以json形式，把操作结果返回给前台页面
                connection.release();// 释放连接
            }
        });
    });
});

module.exports = router;