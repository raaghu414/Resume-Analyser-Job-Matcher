const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const uploadRouter = require('./routes/upload');
const matchRouter = require('./routes/match');
const authRouter = require('./routes/auth');
const mongoose = require('mongoose');

// connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/resume_analyzer';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.warn('MongoDB connection error', err));

app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/match', matchRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
