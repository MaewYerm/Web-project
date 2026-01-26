const express = require('express');
const router = express.Router();
const beefController = require('../controllers/beef.controller.js');

// เพิ่มข้อมูลชิ้นเนื้อ
router.post('/', beefController.create);

// ดูเนื้อทั้งหมด
router.get('/', beefController.getAll);

// ดูเนื้อตาม id
router.get('/:id', beefController.getById);

// แก้ไขข้อมูลเนื้อ
router.put('/:id', beefController.update);

// ลบเนื้อ
router.delete('/:id', beefController.remove);

module.exports = router;
