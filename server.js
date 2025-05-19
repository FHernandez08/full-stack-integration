const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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