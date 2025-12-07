const express = require('express');
const router = express.Router();

// test route
router.get('/test', (req, res) => {
    res.send('Owner route is working');
});

module.exports = router;