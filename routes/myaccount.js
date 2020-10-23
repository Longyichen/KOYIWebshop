var express = require('express');
var router = express.Router();

// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');

// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('my-account', { title: 'myAccount' });
});

//订单数据查询
//查询的是大订单
//Bill表
//in: uid out:order list
router.post('/userOrder', function (req, res, next) {
    let uid = req.body.uid;
    console.log(req.body);

    pool.getConnection(function (err, connection) {

        //先判断该账号是否存在
        var $sql = "select * from Customer where idCustomer = ?";
        connection.query($sql, [uid], function (err, result) {
            var resultJson = result;
            console.log(resultJson.length);

            if (resultJson.length === 0) {
                result = {
                    code: 300,
                    msg: '不存在帐单'
                };
                res.json(result);
                connection.release();
            }
            else {
                //订单存在 返回订单信息
                const $sql1 = "SELECT\n" +
                    "Bill.idBill,\n" +
                    "Bill.date,\n" +
                    "Bill.`status`,\n" +
                    "Bill.total\n" +
                    "FROM\n" +
                    "Customer\n" +
                    "INNER JOIN Indent ON Indent.Customer_idCustomer = Customer.idCustomer AND Customer.idCustomer = Indent.Customer_idCustomer\n" +
                    "INNER JOIN Bill ON Bill.idBill = Indent.Bill_idBill AND Indent.Bill_idBill = Bill.idBill\n" +
                    "WHERE\n" +
                    "Customer.idCustomer = ?" +
                    "GROUP BY\n" +
                    "Bill.idBill";

                connection.query($sql1, [uid], function (err, result) {
                    console.log(result);
                    //前端核对是否能对json进行操作
                    // for(let i in result){
                    //     if(result[i].status == 'Pending' || result[i].status == 'On Hold'){
                    //         result[i].status = 1;//可以进行删除操作
                    //     }
                    // }
                    res.json(result); // 以json形式，把操作结果返回给前台页面
                    connection.release();// 释放连接
                });
            }
        });
    });
})

//用户个人信息查询
//in:uid out: info
router.post('/userInfo', function (req, res, next) {
    let uid = req.body.uid;

    pool.getConnection(function (err, connection) {

        //先判断该账号是否存在
        var $sql = "select * from Customer where idCustomer = ?";
        connection.query($sql, [uid], function (err, result) {
            var resultJson = result;
            console.log(resultJson.length);

            if (resultJson.length === 0) {
                result = {
                    code: 300,
                    msg: '不存在用户'
                };
                res.json(result);
                connection.release();
            }
            else {
                //用户存在 返回用户信息
                var $sql1 = "SELECT * FROM Customer where idCustomer = ?";
                connection.query($sql1, [uid], function (err, result) {
                    console.log(result);
                    //前端核对是否能对json进行操作

                    res.json(result); // 以json形式，把操作结果返回给前台页面
                    connection.release();// 释放连接
                });
            }
        });
    });
})

//用户个人信息修改
//in userinfo out code状态码
router.post('/userEdit', function (req, res, next) {
    console.log(req.body);
    var uid = req.body.uid;
    var current_pwb = req.body.current_pwb;
    var new_pwd = req.body.new_pwd;
    var city_address = req.body.city;
    var street_address = req.body.street;
    var mobile = req.body.mobile;
    var email = req.body.email;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
        //获取前台请求的参数

    pool.getConnection(function (err, connection) {

        //先判断该账号是否存在
        var $sql = "select password from Customer where idCustomer = ?";
        connection.query($sql, [uid], function (err, result) {
            var resultJson = result;
            console.log(resultJson);
            if (resultJson.length === 0) {
                result = {
                    code: 300,
                    msg: '不存在用户'
                };
                res.json(result);
                connection.release();
            }
            if(resultJson[0].password !== current_pwb){
                console.log(resultJson[0].password);
                result = {
                    code: 500,
                    msg: '密码不匹配'
                };
                res.json(result);
                connection.release();
            }
            else {

                // 建立连接，向表中插入值
                var $sql1 = "UPDATE Customer\n" +
                    "SET\n" +
                    "`password` = ?,\n" +
                    "city_address = ?,\n" +
                    "street_address = ?,\n" +
                    "moblie = ?,\n" +
                    "email = ?,\n" +
                    "First_Name = ?,\n" +
                    "Last_Name = ?\n" +
                    "WHERE\n" +
                    "idCustomer = ?";
                connection.query($sql1, [new_pwd, city_address, street_address, mobile, email, first_name, last_name, uid], function (err, result) {
                    console.log(result);
                    if (result) {
                        result = {
                            code: 200,
                            msg: '更新成功'
                        };
                    } else {
                        result = {
                            code: 400,
                            msg: '更新失败'
                        };
                    }
                    res.json(result); // 以json形式，把操作结果返回给前台页面
                    connection.release();// 释放连接
                });
            }
        });
    });
});

module.exports = router;