const express = require('express')
const router = express.Router()
const User = require("../models/User")
const bcrypt = require('bcryptjs');
const { query, validationResult, body } = require('express-validator');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'yash@isarockstar'
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json({ error: 'Access Denied: No Token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid Token' });
  }
};

// === Create User ===
router.post('/createuser', async (req, res) => {
  console.log("Incoming body:", req.body);
  const { name, email, phone, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      phone,
      password: secPass,
    });

    const data = { user: { id: user._id, email: user.email } };
    const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      authToken,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) return res.status(400).json({ success: false, error: 'Invalid credentials' });

    const payload = { user: { id: user._id, email: user.email } };
    const authtoken = jwt.sign(payload, JWT_SECRET);

    res.json({
      success: true,
      authtoken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
router.post('/getUser', fetchUser,
  async (req, res) => {
    try {
      userId = req.user.user
      const user = await User.findById(userId).select("-password");
      res.json(user)
    }
    catch (error) {
      console.error(error.message)
      res.status(500).send("Some error has occured")
    }
  })

module.exports = router