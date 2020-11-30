const express = require('express');
const router = express.Router();
const {receiveUpdate, subscriberVerification} = require('../../controllers/home.js');


router.get('/', subscriberVerification);

router.post('/', receiveUpdate);

module.exports = router;
