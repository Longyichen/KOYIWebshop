var express = require('express');
var router = express.Router();

// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');

// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('shop', { title: 'shop' });
});

//搜索//需要sort by?
//二级搜索
//in:word,startprice,endprice,categories
//out:pid,name,price,decription.num,img,class,mainclass
router.post('/search', function (req, res, next){
    console.log(req.body);
    let word= '%' + req.body.word.toString() + '%';
    let startprice= req.body.startprice;
    let endprice= req.body.endprice;
    let categories= '%' + req.body.categories.toString() + '%';


    pool.getConnection(function (err, connection) {

        const $mainSql = "SELECT\n" +
            "Product.idProdcut,\n" +
            "Product.`name`,\n" +
            "Product.price,\n" +
            "Product.declaration,\n" +
            "Product.stock,\n" +
            "Img.URL,\n" +
            "Class.`cname`,\n" +
            "MainClass.`mname`\n" +
            "FROM\n" +
            "Product\n" +
            "INNER JOIN Class ON Product.Class_idClass = Class.idClass\n" +
            "INNER JOIN MainClass ON Class.MainClass_idMainClass = MainClass.idMainClass\n" +
            "INNER JOIN Img ON Img.Product_idProduct = Product.idProdcut\n";

        //是否包含价格范围搜索
        if(startprice != '' && endprice != '' && categories !== '%%'){
            console.log("searchChannel1");
            const $sql = $mainSql +
                "WHERE\n" +
                "Product.`name` LIKE ? OR\n" +
                "MainClass.`mname` LIKE ? OR\n" +
                "Class.`cname` LIKE ? AND\n" +
                "Product.price >= ? AND\n" +
                "Product.price <= ? OR\n" +
                "MainClass.`mname` LIKE ? OR\n" +
                "Class.`cname` LIKE ?";

            connection.query($sql, [word, word, word, startprice, endprice, categories, categories], function (err, result) {
                console.log(result);
                //前端核对是否能对json进行操作
                if (!result) {
                    result = {
                        code: 300,
                        msg: '不存在符合要求的产品'
                    };
                }
                res.json(result); // 以json形式，把操作结果返回给前台页面
                connection.release();// 释放连接
            });
            connection.release();// 释放连接
        }
        if( categories === "%%") {
            console.log("searchChannel3");
            const $sql = $mainSql +
                "WHERE\n" +
                "Product.`name` LIKE ?";

            connection.query($sql, [word], function (err, result) {
                console.log(result);
                //前端核对是否能对json进行操作
                if (result.length === 0) {
                    result = {
                        code: 300,
                        msg: '不存在符合要求的产品'
                    };
                }
                res.json(result); // 以json形式，把操作结果返回给前台页面
                connection.release();// 释放连接
            });
        }
        // if(startprice != '' && endprice != '' && categories === "%%"){
        //     console.log("searchChannel2");
        //     const $sql = $mainSql +
        //         "WHERE\n" +
        //         "Product.`name` LIKE ? AND\n" +
        //         "Product.price >= ? AND\n" +
        //         "Product.price <= ? \n";
        //
        //
        //     connection.query($sql, [word, startprice, endprice], function (err, result) {
        //         console.log(result);
        //         //前端核对是否能对json进行操作
        //         if (!result) {
        //             result = {
        //                 code: 300,
        //                 msg: '不存在符合要求的产品'
        //             };
        //         }
        //         res.json(result); // 以json形式，把操作结果返回给前台页面
        //         connection.release();// 释放连接
        //     });
        //     connection.release();// 释放连接
        // }
    })

})

module.exports = router;