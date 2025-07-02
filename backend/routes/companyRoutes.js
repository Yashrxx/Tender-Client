const express = require('express');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upLoad');
const Company = require('../models/CompanySchema');
const fetchCompany = require('../middleware/fetchCompany');
const fetchUser = require('../middleware/fetchUser');

const router = express.Router();

// ✅ Debug log to confirm this file is loaded
console.log("✅ companyRoutes.js loaded");

// ✅ Simple test route to verify import
router.get('/test', (req, res) => {
  res.send("✅ companyRoutes is working!");
});

router.post('/companyProfile',
  fetchUser,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  fetchCompany,
  async (req, res) => {
    try {
      console.log("📦 Incoming companyProfile request");

      const {
        name,
        website,
        industry,
        description,
        address,
        phone
      } = req.body;

      const email = req.user.email;

      if (!name) {
        return res.status(400).json({ error: "Name is required." });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;

      const logo = req.files?.logo?.[0]
        ? `${baseUrl}/uploads/${path.basename(req.files.logo[0].path)}`
        : null;

      const coverImage = req.files?.coverImage?.[0]
        ? `${baseUrl}/uploads/${path.basename(req.files.coverImage[0].path)}`
        : null;

      const existing = req.company;

      const companyData = {
        name,
        website,
        industry,
        description,
        address,
        email,
        phone,
        ...(logo && { logo }),
        ...(coverImage && { coverImage })
      };

      if (existing) {
        // Delete old images if replaced
        if (logo && existing.logo) {
          const oldLogoPath = path.join(__dirname, '..', 'uploads', path.basename(existing.logo));
          fs.existsSync(oldLogoPath) && fs.unlinkSync(oldLogoPath);
        }
        if (coverImage && existing.coverImage) {
          const oldCoverPath = path.join(__dirname, '..', 'uploads', path.basename(existing.coverImage));
          fs.existsSync(oldCoverPath) && fs.unlinkSync(oldCoverPath);
        }

        const updatedCompany = await Company.findByIdAndUpdate(existing._id, companyData, { new: true });
        return res.status(200).json({ message: "Company profile updated", company: updatedCompany });
      }

      const newCompany = new Company(companyData);
      await newCompany.save();

      res.status(201).json({ message: "Company profile created", company: newCompany });

    } catch (err) {
      console.error("❌ Error in company profile:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

router.get('/companyProfile', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required to fetch profile" });
    }

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(company);
  } catch (err) {
    console.error("❌ Error fetching company:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;