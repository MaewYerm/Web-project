const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// สมัครสมาชิก
router.post('/register', upload.single('profile_pic'), userController.register);


// login
router.post('/login', userController.login);

// ดูโปรไฟล์ตัวเอง
router.get('/profile', userController.profile);


// รูปโปรไฟล์
router.get('/profile-pic', userController.profileImage);


// logout
router.get('/logout', userController.logout);



module.exports = router;
