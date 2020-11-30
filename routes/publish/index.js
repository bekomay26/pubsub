const {publish: index} = require('../../controllers/publish.js');

const express = require('express');
const router = express.Router();

router.post('/:topic', index);

module.exports = router;
