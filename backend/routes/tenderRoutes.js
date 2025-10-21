const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require("../models/ApplicationSchema");
const Company = require("../models/CompanySchema");
const fetchUser = require('../middleware/fetchUser');

// POST /api/tenderRoutes/application
router.post('/application', fetchUser, async (req, res) => {
  try {
    const { title, description, deadline, budget, category, location } = req.body;

    if (!title || !description || !deadline || !budget) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userEmail = req.user.email;
    console.log("User email from token:", req.user);

    const company = await Company.findOne({ email: userEmail });
    if (!company) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    const newTender = new Application({
      title,
      description,
      deadline,
      budget,
      category,
      location,
      user: req.user.id,
      status: 'Open',
      company: {
        _id: company._id,
        name: company.name,
        website: company.website,
        industry: company.industry,
        description: company.description,
        address: company.address,
        email: company.email,
        phone: company.phone,
        logo: company.logo,
        coverImage: company.coverImage
      }
    });

    await newTender.save();
    console.log("Tender saved:", newTender._id);

    res.status(201).json({ message: 'Tender published successfully', tender: newTender });

  } catch (error) {
    console.error("Error saving tender:", error);
    res.status(500).json({ error: 'Failed to publish tender' });
  }
});

// GET /api/tenderRoutes/newTender
router.get('/newTender', fetchUser, async (req, res) => {
  try {
    console.log('Logged-in user:', req.user);

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    let userTenders;
    try {
      const userId = new mongoose.Types.ObjectId(req.user.id); // <-- convert string to ObjectId
      userTenders = await Application.find({ user: userId }).sort({ createdAt: -1 });
      console.log('Fetched tender data:', userTenders);
    } catch (err) {
      console.error('Mongo query failed:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.json(Array.isArray(userTenders) ? userTenders : []);

  } catch (err) {
    console.error('Unexpected server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;