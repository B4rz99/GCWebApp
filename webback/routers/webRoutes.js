
const express = require('express');
const router = express.Router();
const path = require('path');

const buildPath = path.join(__dirname, '/../../webfront/build');

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    } else {
        jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token unvalid' });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

// Función para servir el archivo index.html
const serveIndexHtml = (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
};

// Rutas públicas
router.get('/SignUp', serveIndexHtml);
router.get('/SignIn', serveIndexHtml);

// Rutas protegidas (requieren autenticación)
router.get('/home', verifyUser, (req, res) => {
    return res.json({ message: 'User logged in', name: req.name });
});
router.get('/Dashboard', verifyUser, serveIndexHtml);
router.get('/Profile', verifyUser, serveIndexHtml);
router.get('/Historics', verifyUser, serveIndexHtml);
router.get('/Home', verifyUser, serveIndexHtml);

module.exports = router;