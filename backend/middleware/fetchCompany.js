// middleware/fetchCompany.js
const Company = require('../models/CompanySchema');

const fetchCompany = async (req, res, next) => {
  try {
    const email = req.query.email || req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required to fetch company" });
    }

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    req.company = company;
    next();
  } catch (err) {
    console.error("Error in fetchCompany middleware:", err);
    res.status(500).json({ error: "Server error while fetching company" });
  }
};

module.exports = fetchCompany;