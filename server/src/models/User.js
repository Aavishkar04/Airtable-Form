import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  // OAuth provider info
  provider: {
    type: String,
    default: 'airtable'
  },
  airtableUserId: {
    type: String,
    unique: true,
    sparse: true // Allow null values but ensure uniqueness when present
  },
  email: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  // OAuth tokens
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  tokenType: {
    type: String,
    default: 'Bearer'
  },
  expiresIn: {
    type: Number
  },
  scope: {
    type: String
  },
  tokenExpiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Simple base64 encoding for development (not secure for production)
userSchema.pre('save', function(next) {
  if (this.isModified('accessToken')) {
    this.accessToken = Buffer.from(this.accessToken).toString('base64');
  }
  next();
});

// Method to decode access token
userSchema.methods.getDecryptedToken = function() {
  try {
    return Buffer.from(this.accessToken, 'base64').toString('utf8');
  } catch (error) {
    // If decoding fails, return the token as-is
    return this.accessToken;
  }
};

export default mongoose.model('User', userSchema);