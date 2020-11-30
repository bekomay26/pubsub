var {subscribe: index} = require('../../controllers/subscibe.js');

var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/:topic', function(req, res, next) {
//   // const topic = req.params.topic
//   // const callbackUrl = req.body.url
//
//   res.send('respond with a resource');
// });


router.post('/:topic', index);
// router.route('/:topic').post(subscribe);

module.exports = router;
