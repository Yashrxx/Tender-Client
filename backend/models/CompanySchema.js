const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: { type: String, trim: true },
  email: { type: String, unique: true, trim: true, lowercase: true },
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