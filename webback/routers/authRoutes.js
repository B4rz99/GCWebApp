const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Login = require('../models/login');
require('dotenv').config();

// Ruta para el registro de nuevos usuarios
router.post('/signUp', async (req, res) => {
    try {
        // Validar datos de entrada
        const { name, lastName, email, password } = req.body;
        if (!name || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'El formato del correo electrónico no es válido.' });
        }

        // Verificar si ya existe un usuario con el mismo correo electrónico
        const existingUser = await Login.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash de la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo registro de usuario en la base de datos
        await Login.create({ name, lastName, email, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Ruta para el inicio de sesión de usuarios existentes
router.post('/signIn', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'El formato del correo electrónico no es válido.' });
        }
        

        // Buscar al usuario por correo electrónico
        const user = await Login.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Comparar la contraseña proporcionada con la almacenada
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generar token de autenticación
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Configurar cookie con el token
        res.cookie('token', token, { httpOnly: true, secure: false });
        return res.json({ message: 'User logged in successfully', token });
    } catch (error) {
        console.error('Error signing in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Ruta para cerrar sesión de usuarios
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'User logged out successfully' });
});

module.exports = router;