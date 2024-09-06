const express = require('express');
const router = express.Router();
const logController = require('../controllers/logControllers');


router.post('/addLog', logController.addLog);
router.get('/getData/:app?/:section?/:subsection?', logController.getData);
router.get('/elasticLogs/:app/:section/:subsection?', logController.searchLogs);



module.exports = router;
