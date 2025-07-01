
const mongoose = require("mongoose");
require('dotenv').config({ path: __dirname + '/.env' });
const mongoURI = process.env.MONGO_URI;

const connectToMongo = () => {
  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Connection error:", err);
    });
};

module.exports = connectToMongo;