var express = require('express');
var router = express.Router();

// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');

// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('contact', { title: 'contact' });
});

//上传联系表单
//in:name email subject message out:code
//数据库 Contact表要设定自增 AI
router.post('/newContact', function (req, res, next) {
    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var subject = req.body.subject;
    var message = req.body.message;
    //获取前台请求的参数

    pool.getConnection(function (err, connection) {

        var $sql1 = "INSERT INTO Contact(name, email, subject, message) VALUES(?,?,?,?)";
        connection.query($sql1, [name, email, subject, message], function (err, result) {
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
    });
});
module.exports = router;