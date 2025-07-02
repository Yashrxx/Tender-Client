const express = require('express');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upLoad');
const Company = require('../models/CompanySchema');
const fetchCompany = require('../middleware/fetchCompany');
const fetchUser = require('../middleware/fetchUser');

const router = express.Router();

// ✅ CREATE company profile (no fetchCompany here)
router.post('/companyProfile/create',
  fetchUser,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { name, website, industry, description, address, phone } = req.body;
      const email = req.user.email;

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const logo = req.files?.logo?.[0]
        ? `${baseUrl}/uploads/${path.basename(req.files.logo[0].path)}`
        : null;
      const coverImage = req.files?.coverImage?.[0]
        ? `${baseUrl}/uploads/${path.basename(req.files.coverImage[0].path)}`
        : null;

      const existing = await Company.findOne({ user: req.user.id });
      if (existing) {
        return res.status(400).json({ error: "Company profile already exists" });
      }

      const company = new Company({
        user: req.user.id,
        name,
        email,
        website,
        industry,
        description,
        address,
        phone,
        ...(logo && { logo }),
        ...(coverImage && { coverImage }),
      });

      await company.save();
      res.status(201).json({ message: "Company profile created", company });

    } catch (err) {
      console.error("Error creating company:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ UPDATE company profile (needs fetchCompany)
router.put('/companyProfile/update',
  fetchUser,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  fetchCompany,
  async (req, res) => {
    try {
      const { name, website, industry, description, address, phone } = req.body;
      const email = req.user.email;

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const logo = req.files?.logo?.[0]
        ? `${baseUrl}/uploads/${path.basename(req.files.logo[0].path)}`
        : null;
      const coverImage = req.files?.coverImage?.[0]
        ? `${baseUrl}/uploads/${path.basename(req.files.coverImage[0].path)}`
        : null;

      const existing = req.company;

      // delete old files if replaced
      if (logo && existing.logo) {
        const oldLogoPath = path.join(__dirname, '..', 'uploads', path.basename(existing.logo));
        fs.existsSync(oldLogoPath) && fs.unlinkSync(oldLogoPath);
      }
      if (coverImage && existing.coverImage) {
        const oldCoverPath = path.join(__dirname, '..', 'uploads', path.basename(existing.coverImage));
        fs.existsSync(oldCoverPath) && fs.unlinkSync(oldCoverPath);
      }

      const updatedCompany = await Company.findByIdAndUpdate(
        existing._id,
        {
          name,
          website,
          industry,
          description,
          address,
          email,
          phone,
          ...(logo && { logo }),
          ...(coverImage && { coverImage }),
        },
        { new: true }
      );

      res.status(200).json({ message: "Company profile updated", company: updatedCompany });

    } catch (err) {
      console.error(" Error updating company:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ GET company by email (public)
router.get('/companyProfile', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required to fetch profile" });

    const company = await Company.findOne({ email });
    if (!company) return res.status(404).json({ error: "Company not found" });

    res.json(company);
  } catch (err) {
    console.error(" Error fetching company:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/search', async (req, res) => {
  const query = req.query.query || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 6;

  try {
    const searchRegex = new RegExp(query, 'i');

    const filter = {
      $or: [
        { name: searchRegex },
        { industry: searchRegex },
        { description: searchRegex }
      ]
    };

    const results = await Company.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Company.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({ results, totalPages });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;