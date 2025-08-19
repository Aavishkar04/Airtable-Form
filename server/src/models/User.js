import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  airtableUserId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: false // Made optional as Airtable's whoami endpoint does not provide it directly
  },
  name: {
    type: String,
    required: false // Made optional as Airtable's whoami endpoint does not provide it directly
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
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