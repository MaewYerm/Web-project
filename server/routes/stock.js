const express = require('express')
const router = express.Router()
const stockController = require('../controllers/stock.controller');

router.get('/', stockController.getAll)

module.exports = router;