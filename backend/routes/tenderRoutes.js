const express = require('express');
const router = express.Router();
const Application = require("../models/ApplicationSchema");
const Company = require("../models/CompanySchema")
const fetchUser = require('../middleware/fetchUser');

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

    res.status(201).json({ message: 'Tender published successfully', tender: newTender });

  } catch (error) {
    console.error("Error saving tender:", error);
    res.status(500).json({ error: 'Failed to publish tender' });
  }
});

// GET /api/newTender (protected)
router.get('/newTender', fetchUser, async (req, res) => {
  try {
    const userTenders = await Application.find({ user: req.user.id });
    res.json(userTenders);
  } catch (err) {
    console.error('Error fetching tenders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;