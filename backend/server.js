import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Placeholder
// app.use('/api/auth', authRoutes);
// app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('AI Mental Health & Stress Detector API is running.');
});

// Start server regardless of database connection status
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Database connection (Soft fail for local testing)
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stress-detector')
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('⚠️ MongoDB not connected (Running in local test mode). Error:', err.message);
  });
