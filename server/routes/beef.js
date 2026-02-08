const express = require('express');
const router = express.Router();
const beefController = require('../controllers/beef.controller.js');

// เพิ่มข้อมูลชิ้นเนื้อ
router.post('/', beefController.create);

router.post('/delete', beefController.delete);

router.put('/:lot_id', beefController.update);

router.post('/withdraw', beefController.withdraw)


module.exports = router;
