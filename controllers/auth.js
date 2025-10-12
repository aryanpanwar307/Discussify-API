const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup user
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  const isAdmin = email === "aryan@gmail.com"
  try {
    const user = await User.create({ username, email, password, isAdmin });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid request body' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

