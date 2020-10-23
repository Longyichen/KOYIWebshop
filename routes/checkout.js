var express = require('express');
var router = express.Router();

// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');

// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('checkout', { title: 'checkout' });
});


//实现订单信息的上传
// //获得订单数组
// router.post('/orderLogin', function (req, res, next){
//     let data = JSON.parse(req.body);
//     let j = 1;//状态
//
//     for(let i in data){
//         let amount = data[i].amount;
//         let IndentTime = data[i].time;
//         let totalPrice = data[i].totalprice;
//         let status = data[i].status;
//         let uid = data[i].uid;
//         let pid = data[i].pid;
//         //review id
//
//         pool.getConnection(function (err, connection) {
//             const $sql = "INSERT INTO Indent( amount, IndentTime, totalPrice, status," +
//                 " Customer_idCustomer, Product_idProduct, Bill_idBill) " +
//                 "VALUES(?,?,?,?,?,?,?)";
//
//             connection.query($sql, [amount, IndentTime, totalPrice, status, uid, pid, bid],
//                 function (err, result) {
//                     if (!result) {
//                         result = {
//                             code: 400,
//                             msg: '订单'+ i + '数据上传失败'
//                         };
//                         j = 0;
//                         res.json(result);
//                     }
//                     connection.release();// 释放连接
//                 })
//         })
//     }
//     if(j){
//         let result = {
//             code: 200,
//             msg: '订单数据上传成功'
//         };
//         res.json(result);
//     }
// });
let bid;
//单次接口 可用
router.post('/orderLogin', function (req, res, next){
    console.log(req.body);

    let amount = req.body.amount;
    let IndentTime = req.body.time;
    let totalPrice = req.body.totalprice;
    let status = req.body.status;
    let uid = req.body.uid;
    let pid = req.body.pid;
    let bid = 0;
    // let bid = req.body.bid;
    //review id

    pool.getConnection(function (err, connection) {
        const $sql = "INSERT INTO Indent( amount, IndentTime, totalPrice, status," +
            " Customer_idCustomer, Product_idProduct, Bill_idBill) " +
            "VALUES(?,?,?,?,?,?,?)";
        const $sql2 = "SELECT  max(idBill)  FROM  Bill;"
        connection.query($sql2,function (err,re) {
            bid = re[0]["max(idBill)"];
            console.log("bid!!!!!");
            console.log(bid);
            connection.query($sql, [amount, IndentTime, totalPrice, status, uid, pid, bid],
                function (err, result) {
                    if (!result) {
                        result = {
                            code: 400,
                            msg: '订单数据上传失败'
                        };
                        res.json(result);
                    }else {
                        let result = {
                            code: 200,
                            msg: '订单数据上传成功'
                        };
                        res.json(result);
                    }
                    connection.release();// 释放连接
                })
        })
    })
});

//实现账单信息的上传
router.post('/billLogin', function (req, res, next){
    let date = req.body.date;
    let status = req.body.status;
    let total = req.body.total;

    pool.getConnection(function (err, connection) {

        const $sql = "INSERT INTO Bill(date, status, total) VALUES(?,?,?)";

        connection.query($sql, [date, status, total], function (err, result) {
            console.log(result);
            if (result) {
                result = {
                    code: 200,
                    msg: '账单数据上传成功'
                };
            } else {
                result = {
                    code: 400,
                    msg: '账单数据上传失败'
                };
            }
            res.json(result); // 以json形式，把操作结果返回给前台页面
            connection.release();// 释放连接
        });
    });
});

module.exports = router;