const express = require('express');
const router = express.Router();
const controller = require('../controllers/setting.controller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/user/delete/:id', controller.deleteUser);

router.get('/profile-pic/:id', controller.profileImageById);

router.post('/user/role', controller.updateRole)

// เพิ่มสถานที่เก็บ
router.post('/storage', controller.createStorage);

// ดึงรายการสถานที่เก็บทั้งหมด
router.get('/storage', controller.getAllStorage);

// แก้ไขสถานที่เก็บ
router.put('/storage/:id', controller.updateStorage);

// ลบสถานที่เก็บ
router.delete('/storage/:id', controller.deleteStorage);


module.exports = router;
