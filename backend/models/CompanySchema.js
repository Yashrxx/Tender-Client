const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  website: { type: String, trim: true },
  industry: { type: String },
  description: { type: String },
  address: { type: String },
  logo: { type: String },
  coverImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);