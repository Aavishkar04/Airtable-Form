// import 'dotenv/config';
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import helmet from 'helmet';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import authRoutes from './routes/auth.js';
// import airtableRoutes from './routes/airtable.js';
// import formRoutes from './routes/forms.js';
// import errorHandler from './middleware/errorHandler.js';





// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Security middleware (disable CSP for development)
// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginEmbedderPolicy: false
// }));
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true
// }));

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Serve uploaded files
// app.use('/uploads', express.static('uploads'));

// // Serve test page
// app.get('/test-page', (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html>
//     <head><title>Server Test</title></head>
//     <body>
//       <h1>Server is Working!</h1>
//       <p>Backend is running on port ${process.env.PORT || 4000}</p>
//       <p><a href="/health">Health Check</a></p>
//       <p><a href="/auth/test">Auth Test</a></p>
//       <p><a href="/auth/airtable/login">OAuth Login</a></p>
//     </body>
//     </html>
//   `);
// });

// // Routes
// app.use('/auth', authRoutes);
// app.use('/api/airtable', airtableRoutes);
// app.use('/api/forms', formRoutes);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// // Error handling middleware
// app.use(errorHandler);

// // Database connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// const PORT = process.env.PORT || 4000;

// // ✅ Serve frontend in production
// if (process.env.NODE_ENV === "production") {
//   const frontendPath = path.join(__dirname, "../../client/dist");
//   app.use(express.static(frontendPath));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(frontendPath, "index.html"));
//   });
// }

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// export default app;




import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import airtableRoutes from './routes/airtable.js';
import formRoutes from './routes/forms.js';
import errorHandler from './middleware/errorHandler.js';

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Test page (for quick check)
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

// API Routes
app.use('/auth', authRoutes);
app.use('/api/airtable', airtableRoutes);
app.use('/api/forms', formRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ Serve frontend (React) in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(frontendPath));

  // Catch-all to serve React app for any non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// Error handler (after routes)
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
