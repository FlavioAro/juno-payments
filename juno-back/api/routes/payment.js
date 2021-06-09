var express = require('express');
var router = express.Router();
const payController = require('../controllers/pay');

router.post('/card', payController.card);
router.post('/boleto', payController.boleto);
router.post('/picpay', payController.picpay);
router.post('/pix', payController.pix);
router.get('/charge/:id', payController.charge);
  
module.exports = router;