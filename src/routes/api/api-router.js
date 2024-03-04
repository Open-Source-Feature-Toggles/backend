const express = require('express');
const router = express.Router();
const { GetPayload } = require('../../controllers/api/payload');

router.get('/payload', GetPayload);

module.exports = router;
