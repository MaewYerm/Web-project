const express = require('express')
const router = express.Router()
const gradeController = require('../controllers/grade.controller')

router.get('/', gradeController.getAll)

module.exports = router;
