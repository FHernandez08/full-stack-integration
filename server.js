const express = require('express');
const user = require('./models/user');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const { authMiddleware } = require('./middleware/authMiddleware');
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

app.get('/protected', authMiddleware, (req, res) => {
    return res.status(200).json({ message: 'Your data is presented on a protected route! '});
});

app.get('/profile', (req, res) => {
    const profilePage = path.join(__dirname, 'public', 'profile.html');

    res.sendFile(profilePage);
});

app.get('/api/profile', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(404).json({ message: "The user is not found!" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json(userData);
    }   
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Email and password are required!");
    };

    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return res.status(401).send("Invalid Credentials!");
        };

        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (!isMatch) {
            return res.status(401).send("Invalid Credentials");
        }

        const token = jwt.sign(
            // foundUser._id is created by mongoDB automatically
            { id: foundUser._id, username: foundUser.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ token });
    }

    catch (err) {
        console.log(err);
        res.status(500).send('Server error!');
    }
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, username, password } = req.body;

    try {
        if (!firstName || !lastName || !username || !password) {
            return res.status(401).json({ message: 'Information is NOT valid' });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(200).json({ message: "User created successfully!" });
    }
    
    catch (err) {
        console.log(err);
        res.status(500).send('Server Error!');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});