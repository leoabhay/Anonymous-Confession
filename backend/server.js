const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Confession Schema
const confessionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  imageURL: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Confession = mongoose.model('Confession', confessionSchema);

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'confessions',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

// Admin Authentication Middleware (Simple version)
const adminAuth = (req, res, next) => {
  const adminPassword = req.headers['admin-password'];
  if (adminPassword === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Routes

// POST - Submit new confession
app.post('/api/confessions', upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Confession text is required' });
    }

    const newConfession = new Confession({
      text: text.trim(),
      imageURL: req.file ? req.file.path : null
    });

    await newConfession.save();
    res.status(201).json({ 
      message: 'Confession submitted successfully! It will be reviewed before being published.',
      confession: newConfession 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET - Get all approved confessions (Public)
app.get('/api/confessions/approved', async (req, res) => {
  try {
    const confessions = await Confession.find({ status: 'approved' })
      .sort({ createdAt: -1 });
    res.json(confessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET - Get all pending confessions (Admin only)
app.get('/api/confessions/pending', adminAuth, async (req, res) => {
  try {
    const confessions = await Confession.find({ status: 'pending' })
      .sort({ createdAt: -1 });
    res.json(confessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT - Approve confession (Admin only)
app.put('/api/confessions/:id/approve', adminAuth, async (req, res) => {
  try {
    const confession = await Confession.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    
    if (!confession) {
      return res.status(404).json({ message: 'Confession not found' });
    }
    
    res.json({ message: 'Confession approved', confession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE - Delete confession (Admin only)
app.delete('/api/confessions/:id', adminAuth, async (req, res) => {
  try {
    const confession = await Confession.findByIdAndDelete(req.params.id);
    
    if (!confession) {
      return res.status(404).json({ message: 'Confession not found' });
    }

    // Delete image from Cloudinary if exists
    if (confession.imageURL) {
      const publicId = confession.imageURL.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    
    res.json({ message: 'Confession deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin login verification
app.post('/api/admin/verify', adminAuth, (req, res) => {
  res.json({ message: 'Admin authenticated successfully' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));