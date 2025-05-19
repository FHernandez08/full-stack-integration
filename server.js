const express = require('express');
const user = require('./models/user');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.get('/', (req, res) => {
    const HTMLfile = path.join(__dirname, 'public', 'index.html');
    res.sendFile(HTMLfile);
});

app.get('/register-page', (req, res) => {
    const registerPage = path.join(__dirname, 'public', 'register.html');
    res.sendFile(registerPage);
});

app.post('/login', (req, res) => {
    
});

app.post('/register', (req, res) => {

});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})