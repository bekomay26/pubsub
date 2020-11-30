const {subscribe: index} = require('../../controllers/subscibe.js');

const express = require('express');
const router = express.Router();

router.post('/:topic', index);

module.exports = router;
