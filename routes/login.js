var express = require('express');
var router = express.Router();

// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');

// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login-register', { title: 'login' });
});

router.post('/userLogin', function (req, res, next) {
    console.log(req.body);
    // res.send("2222");
    // res.status(202).send();
    var username = req.body.username;//获取前台请求的参数
    var password = req.body.password;
    pool.getConnection(function (err, connection) {
        //先判断该账号是否存在
        var $sql = "select * from Customer where name = ?";

        connection.query($sql, [username], function (err, result) {
            var resultJson = result;
            // console.log(resultJson.length);

            if (resultJson.length === 0) {

                result = {
                    code: 300,
                    msg: '该账号不存在'
                };
                res.json(result);
                connection.release();

            } else {
                //账号存在，可以登录，进行密码判断

                var $sql1 = "select password, idCustomer from Customer where name = ?";

                connection.query($sql1, [username], function (err, result) {
                    var temp = result[0].password;  //取得数据库查询字段值
                    // console.log(temp);

                    if (temp == password) {
                    //获取uid
                        result = {
                            code: 200,
                            msg: '密码正确',
                            uid: result[0].idCustomer
                        };
                    } else {
                        result = {
                            code: 400,
                            msg: '密码错误'
                        };

                    }
                    res.json(result); // 以json形式，把操作结果返回给前台页面
                    connection.release();// 释放连接
                });
            }
        });
    });
});

//注册功能实现
// 考虑对email格式进行验证
router.post('/userRegister', function (req, res, next) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;

    var name = req.body.name; //获取前台请求的参数

    pool.getConnection(function (err, connection) {

        //先判断该账号是否存在
        var $sql = "select * from Customer where name =?";
        connection.query($sql, [username], function (err, result) {
            var resultJson = result;
            console.log(resultJson.length);
            if (resultJson.length !== 0) {
                result = {
                    code: 300,
                    msg: '该账号已存在'
                };
                res.json(result);
                connection.release();
            } else {  //账号不存在，可以注册账号
                // 建立连接，向表中插入值  数据库表名为user-info会出错
                var $sql1 = "INSERT INTO Customer(name, password, email) VALUES(?,?,?)";
                connection.query($sql1, [username, password, name], function (err, result) {
                    console.log(result);
                    if (result) {
                        //获取自增uid
                        let userid;
                        const $sql1 = "SELECT LAST_INSERT_ID();";
                        connection.query($sql1, function (err, result1) {
                            console.log(result1);
                            userid = result1[0];
                        });
                        result = {
                            code: 200,
                            msg: '注册成功',
                        };
                    } else {
                        result = {
                            code: 400,
                            msg: '注册失败'
                        };
                    }
                    res.json(result); // 以json形式，把操作结果返回给前台页面
                    connection.release();// 释放连接
                });
            }
        });
    });
});

router.post('/lastInsert', function (req, res, next) {

        var $sql = "SELECT LAST_INSERT_ID();";

        pool.getConnection(function (err, connection) {
            connection.query($sql,  function (err, result) {
                let data= {id:result[0]['LAST_INSERT_ID()']};
                res.json(data); // 以json形式，把操作结果返回给前台页面
                connection.release();// 释放连接
            });
        })
});
module.exports = router;