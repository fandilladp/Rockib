const express = require('express');
const router = express.Router();
const logController = require('../controllers/logControllers');

router.post('/addLog', logController.addLog);
router.get('/getData/:app?/:section?/:subsection?', logController.getData);


module.exports = router;
