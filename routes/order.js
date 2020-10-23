var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('order', { title: 'orderDetail' });
});

//订单的信息查询
//传入bid
