const express = require('express')
const router = express.Router()
const beefTypeController = require('../controllers/beeftype.controller')

router.get('/', beefTypeController.getAll)

module.exports = router;
