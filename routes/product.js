var express = require('express');
var router = express.Router();

// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');

// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('product-details', { title: 'product' });
});

//产品的详细信息查询
//in:pid out:list
router.post('/productInfo', function (req, res, next){
    //前端传入pid
    let pid= req.body.pid;
    console.log(req.body);
    // console.log(pid);

    pool.getConnection(function (err, connection){

        //判断产品是否存在 有货
        var $sql = "SELECT *\n" +
            "FROM\n" +
            "Product\n" +
            "WHERE\n" +
            "Product.stock > 0 AND\n" +
            "Product.idProdcut = ?";

        connection.query($sql, [pid], function (err, result){
            var resultJson = result;
            console.log(resultJson.length);

            if (resultJson.length === 0) {
                result = {
                    code: 300,
                    msg: '产品无货'
                };
                res.json(result);
                connection.release();
            }
            else{
                //返回产品详细信息
                var $sql1 = "SELECT\n" +
                    "Product.idProdcut,\n" +
                    "Product.`name`,\n" +
                    "Product.price,\n" +
                    "Product.declaration,\n" +
                    "Product.stock,\n" +
                    "Img.URL,\n" +
                    "Class.`cname`,\n" +
                    "MainClass.`mname`\n" +
                    "FROM\n" +
                    "(Product ,\n" +
                    "MainClass)\n" +
                    "INNER JOIN Class ON Class.MainClass_idMainClass = MainClass.idMainClass AND Product.Class_idClass = Class.idClass\n" +
                    "INNER JOIN Img ON Img.Product_idProduct = Product.idProdcut\n" +
                    "WHERE\n" +
                    "Product.idProdcut = ?";

                connection.query($sql1, [pid], function (err, result) {
                    // console.log(result);

                    res.json(result); // 以json形式，把操作结果返回给前台页面
                    connection.release();// 释放连接
                });
            }
        });
    });
})

module.exports = router;