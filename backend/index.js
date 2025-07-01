const connectToMongo = require("./db");
connectToMongo();
const express = require('express');
const cors = require('cors');
const tenderRoutes = require('./routes/tenderRoutes');
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companyRoutes');

const app = express();
const port = 5000;

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

app.use(express.json());
app.use('/api/tenderRoutes', tenderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/companyRoutes', companyRoutes);
app.use('/uploads', express.static('uploads'));
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Tender-client Backend is Live!" });
});

app.listen(port, () => {
  console.log(`Tender-client backend listening on port ${port}`);
});
