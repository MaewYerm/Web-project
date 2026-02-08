const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storage.controller');

// เพิ่ม storage
router.post('/', storageController.create);

// แก้ไข storage
router.put('/:id', storageController.update);

// ลบ storage
router.delete('/:id', storageController.remove);

// ข้อมูลทั้งหมด
router.get('/', storageController.getAll)


module.exports = router;
