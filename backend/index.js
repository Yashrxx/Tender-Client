const connectToMongo = require("./db");
connectToMongo();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// ✅ Create 'uploads' folder if it doesn't exist
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log("'uploads/' folder created.");
}

// ✅ ROUTES
const tenderRoutes = require('./routes/tenderRoutes');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companyRoutes');

// ✅ CORS config
const allowedOrigins = [
  "http://localhost:3001",
  "https://yashrxx.github.io"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Static file serving (for logo and coverImage URLs)
app.use('/uploads', express.static('uploads'));

// ✅ Route that DOES NOT use multipart/form-data — SAFE for JSON parser
app.use('/api/auth', authRoutes);

// ✅ JSON parser here — AFTER /auth and BEFORE other routes
app.use(express.json());

// ✅ Routes like this one use file uploads (multipart/form-data)
app.use('/api/companyRoutes', companyRoutes);

// ✅ Other JSON-safe routes
app.use('/api/tenderRoutes', tenderRoutes);

// ✅ Default root
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Tender-client Backend is Live!" });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Tender-client backend listening on port ${port}`);
});
