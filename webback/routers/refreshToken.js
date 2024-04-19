const router = require('express').Router();

router.get('/refreshToken', async (req, res) => {
    res.send('refreshToken');
});

module.exports = router;