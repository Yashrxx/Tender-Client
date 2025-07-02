const Company = require('../models/CompanySchema');

const fetchCompany = async (req, res, next) => {
  try {
    const userId = req.user?.id; // Comes from token via fetchUser

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    const company = await Company.findOne({ user: userId });

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