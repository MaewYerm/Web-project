const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');

router.get('/', auditController.list);
router.get('/summary', auditController.summary);

module.exports = router;

