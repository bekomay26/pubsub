// import {receiveUpdate, subscriberVerification} from "../controllers/home";

var express = require('express');
var router = express.Router();
var {receiveUpdate, subscriberVerification} = require('../../controllers/home.js');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', subscriberVerification);

router.post('/', receiveUpdate);

module.exports = router;
