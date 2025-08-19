import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

// Basic middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: {
      PORT: process.env.PORT,
      MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      AIRTABLE_CLIENT_ID: process.env.AIRTABLE_CLIENT_ID ? 'SET' : 'NOT SET'
    }
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Environment check:');
  console.log('- MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  console.log('- AIRTABLE_CLIENT_ID:', process.env.AIRTABLE_CLIENT_ID ? 'SET' : 'NOT SET');
});

export default app;