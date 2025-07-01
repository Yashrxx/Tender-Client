const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: 'General'
  },
  location: {
    type: String,
    default: 'Not Specified'
  },
  status: {
    type: String,
    default: 'Open',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  company: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    name: String,
    website: String,
    industry: String,
    description: String,
    address: String,
    email: String,
    phone: String,
    logo: String,
    coverImage: String
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Tender", tenderSchema, "newTender");