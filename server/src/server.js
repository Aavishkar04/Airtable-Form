require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const airtableRoutes = require('./routes/airtable');
const formRoutes = require('./routes/forms');

const app = express();

// Security middleware (disable CSP for development)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Serve test page
app.get('/test-page', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Server Test</title></head>
    <body>
      <h1>Server is Working!</h1>
      <p>Backend is running on port ${process.env.PORT || 4000}</p>
      <p><a href="/health">Health Check</a></p>
      <p><a href="/auth/test">Auth Test</a></p>
      <p><a href="/auth/airtable/login">OAuth Login</a></p>
    </body>
    </html>
  `);
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/airtable', airtableRoutes);
app.use('/api/forms', formRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;