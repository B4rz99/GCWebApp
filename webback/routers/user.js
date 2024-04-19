const router = require('express').Router();

router.get('/user', async (req, res) => {
    res.status(200).send('Welcome to the user page');
});

module.exports = router;