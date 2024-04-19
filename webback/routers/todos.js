const router = require('express').Router();

router.get('/todos', async (req, res) => {
    res.json([
        {
            id: 1,
            title: 'Learn React',
            completed: false
        },
        {
            id: 2,
            title: 'Learn Node.js',
            completed: false
        },
        {
            id: 3,
            title: 'Learn Express',
            completed: false
        }
    ])
});

module.exports = router;