const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');

// ดูประวัติทั้งหมด
router.get('/', auditController.getAll);

// ดูประวัติของ record เดียว
router.get('/:table/:recordId', auditController.getByRecord);

module.exports = router;
