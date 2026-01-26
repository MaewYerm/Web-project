const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storage.controller');

// ดู storage ทั้งหมด
router.get('/', storageController.getAll);

// ดู storage ตาม id
router.get('/:id', storageController.getById);

// ดูเนื้อใน storage 
router.get('/:id/beef', storageController.getBeefInStorage);

// เพิ่ม storage
router.post('/', storageController.create);

// แก้ไข storage
router.put('/:id', storageController.update);

// ลบ storage
router.delete('/:id', storageController.remove);

module.exports = router;
