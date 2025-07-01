const express = require('express');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upLoad');
const Company = require('../models/CompanySchema');
const fetchCompany = require('../middleware/fetchCompany');
const router = express.Router();

router.post('/companyProfile', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const data = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const logo = req.files?.logo?.[0]
      ? `${baseUrl}/uploads/${path.basename(req.files.logo[0].path)}`
      : null;

    const coverImage = req.files?.coverImage?.[0]
      ? `${baseUrl}/uploads/${path.basename(req.files.coverImage[0].path)}`
      : null;

    const existing = await Company.findOne({ email: data.email });

    if (existing) {
      // Delete old logo if new one uploaded
      if (logo && existing.logo) {
        const oldLogoPath = path.join(__dirname, '..', 'uploads', path.basename(existing.logo));
        fs.existsSync(oldLogoPath) && fs.unlinkSync(oldLogoPath);
      }

      // Delete old cover image if new one uploaded
      if (coverImage && existing.coverImage) {
        const oldCoverPath = path.join(__dirname, '..', 'uploads', path.basename(existing.coverImage));
        fs.existsSync(oldCoverPath) && fs.unlinkSync(oldCoverPath);
      }

      const updatedCompany = await Company.findByIdAndUpdate(
        existing._id,
        {
          ...data,
          ...(logo && { logo }),
          ...(coverImage && { coverImage })
        },
        { new: true }
      );

      return res.status(200).json({ message: "Company profile updated", company: updatedCompany });
    }

    const newCompany = new Company({ ...data, logo, coverImage });
    await newCompany.save();

    res.status(201).json({ message: "Company profile created", company: newCompany });

  } catch (err) {
    console.error("Error in company profile:", err);
    res.status(500).json({ error: err.message });
  }
});

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
    console.error("Error fetching company:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;