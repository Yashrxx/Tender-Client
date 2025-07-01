const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  website: { type: String },
  industry: { type: String },
  description: { type: String },
  address: { type: String },
  email: { type: String },
  phone: { type: String },
  logo: { type: String },
  coverImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);