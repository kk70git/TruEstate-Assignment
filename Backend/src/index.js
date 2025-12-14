require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const transactionRoutes = require('./routes/transactionRoutes');

const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Allows backend to understand JSON data

app.use('/api/transactions', transactionRoutes);
// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- Basic Route (For Testing) ---
app.get('/', (req, res) => {
  res.send('TruEstate API is Running...');
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});