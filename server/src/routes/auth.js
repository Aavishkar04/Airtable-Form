// import express from 'express';
// import jwt from 'jsonwebtoken';
// import axios from 'axios';
// import crypto from 'crypto';
// import User from '../models/User.js';

// const router = express.Router();

// // Simple test endpoint
// router.get('/test', (req, res) => {
//   res.json({ 
//     message: 'Auth routes working',
//     timestamp: new Date().toISOString(),
//     env: {
//       clientId: process.env.AIRTABLE_CLIENT_ID ? 'SET' : 'NOT SET',
//       redirectUri: process.env.AIRTABLE_OAUTH_REDIRECT_URI || 'NOT SET'
//     }
//   });
// });

// // Generate OAuth state for CSRF protection
// const generateState = () => {
//   return crypto.randomBytes(32).toString('hex');
// };

// // Store states temporarily (in production, use Redis or similar)
// const oauthStates = new Map();

// // Helper to generate a code verifier and code challenge
// const generateCodeVerifier = () => {
//   const verifier = crypto.randomBytes(32).toString('base64url'); // Using base64url encoding
//   const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
//   return { verifier, challenge };
// };

// // Redirect to Airtable OAuth
// router.get('/airtable/login', (req, res) => {
//   try {
//     console.log('Starting OAuth flow...');
//     console.log('Client ID:', process.env.AIRTABLE_CLIENT_ID ? 'SET' : 'NOT SET');
//     console.log('Redirect URI:', process.env.AIRTABLE_OAUTH_REDIRECT_URI);

//     // Validate required environment variables
//     if (!process.env.AIRTABLE_CLIENT_ID) {
//       return res.status(500).json({ 
//         error: 'AIRTABLE_CLIENT_ID not configured'
//       });
//     }
    
//     if (!process.env.AIRTABLE_OAUTH_REDIRECT_URI) {
//       return res.status(500).json({ 
//         error: 'AIRTABLE_OAUTH_REDIRECT_URI not configured'
//       });
//     }

//     // Validate redirect URI format
//     if (!process.env.AIRTABLE_OAUTH_REDIRECT_URI.startsWith('http://localhost:4000/auth/airtable/callback')) {
//       return res.status(500).json({ 
//         error: 'Invalid redirect URI format',
//         expected: 'http://localhost:4000/auth/airtable/callback',
//         actual: process.env.AIRTABLE_OAUTH_REDIRECT_URI
//       });
//     }

//     const state = generateState();
//     const { verifier, challenge } = generateCodeVerifier();
//     oauthStates.set(state, { timestamp: Date.now(), verifier });
//     console.log('OAuth state generated and stored:', state);
//     console.log('Current oauthStates size:', oauthStates.size);
    
//     // Clean up old states (older than 10 minutes)
//     for (const [key, timestamp] of oauthStates.entries()) {
//       if (Date.now() - timestamp > 10 * 60 * 1000) {
//         oauthStates.delete(key);
//         console.log('Deleted expired state:', key);
//       }
//     }

//     // Build OAuth URL manually to ensure proper encoding
//     const params = new URLSearchParams({
//       'client_id': process.env.AIRTABLE_CLIENT_ID,
//       'redirect_uri': process.env.AIRTABLE_OAUTH_REDIRECT_URI,
//       'response_type': 'code',
//       'scope': 'data.records:read data.records:write schema.bases:read',
//       'state': state,
//       'code_challenge': challenge,
//       'code_challenge_method': 'S256'
//     });

//     const authURL = `https://airtable.com/oauth2/v1/authorize?${params.toString()}`;
    
//     console.log('OAuth Parameters:');
//     console.log('- client_id:', process.env.AIRTABLE_CLIENT_ID);
//     console.log('- redirect_uri:', process.env.AIRTABLE_OAUTH_REDIRECT_URI);
//     console.log('- scope: data.records:read data.records:write schema.bases:read');
//     console.log('- state:', state);
//     console.log('- code_challenge:', challenge);
//     console.log('- code_challenge_method: S256');
//     console.log('Full URL:', authURL);
    
//     res.redirect(authURL);
//   } catch (error) {
//     console.error('OAuth login error:', error);
//     res.status(500).json({ error: 'Failed to initiate OAuth flow' });
//   }
// });

// // Handle OAuth callback
// router.get('/airtable/callback', async (req, res) => {
//   const { code, state } = req.query;

//   try {
//     // Verify state parameter (allow test123 for debugging)
//     if (!state) {
//       return res.status(400).json({ error: 'Missing state parameter' });
//     }
    
//     const storedState = oauthStates.get(state);

//     if (state !== 'test123' && (!storedState || Date.now() - storedState.timestamp > 10 * 60 * 1000)) {
//       console.log('Invalid or expired state:', state);
//       return res.status(400).json({ 
//         error: 'Invalid or expired state parameter',
//         received: state,
//         validStates: Array.from(oauthStates.keys()).map(k => ({ key: k, timestamp: oauthStates.get(k).timestamp }))
//       });
//     }

//     const codeVerifier = storedState ? storedState.verifier : null; // Retrieve verifier
    
//     if (oauthStates.has(state)) {
//       oauthStates.delete(state);
//       console.log('Deleted used state:', state);
//       console.log('Current oauthStates size after deletion:', oauthStates.size);
//     }

//     if (!code) {
//       return res.status(400).json({ error: 'Authorization code not provided' });
//     }

//     console.log('Attempting to exchange code for token...');
//     console.log('Using client_id:', process.env.AIRTABLE_CLIENT_ID ? 'SET' : 'NOT SET');
//     // For security, do NOT log the actual client_secret in production. Log a hash or 'SET'/'NOT SET' if needed.
//     console.log('Using client_secret:', process.env.AIRTABLE_CLIENT_SECRET ? 'SET' : 'NOT SET');
//     console.log('Client Secret Length:', process.env.AIRTABLE_CLIENT_SECRET ? process.env.AIRTABLE_CLIENT_SECRET.length : 'N/A');

//     // Exchange code for access token
//     const tokenData = new URLSearchParams({
//       client_id: process.env.AIRTABLE_CLIENT_ID,
//       redirect_uri: process.env.AIRTABLE_OAUTH_REDIRECT_URI,
//       code: code,
//       grant_type: 'authorization_code'
//     });

//     // Append code_verifier for PKCE
//     if (codeVerifier) {
//       tokenData.append('code_verifier', codeVerifier);
//     }

//     // Prepare headers (use Basic auth for confidential clients)
//     const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
//     if (process.env.AIRTABLE_CLIENT_SECRET) {
//       const basic = Buffer.from(`${process.env.AIRTABLE_CLIENT_ID}:${process.env.AIRTABLE_CLIENT_SECRET}`).toString('base64');
//       headers['Authorization'] = `Basic ${basic}`;
//       console.log('Including client_secret in token request via Basic auth header: YES');
//     } else {
//       console.log('Including client_secret in token request via Basic auth header: NO (public PKCE client)');
//     }

//     const tokenResponse = await axios.post('https://airtable.com/oauth2/v1/token', tokenData, {
//       headers
//     });

//     const { access_token, refresh_token, expires_in } = tokenResponse.data;

//     // Get user profile from Airtable
//     const profileResponse = await axios.get('https://api.airtable.com/v0/meta/whoami', {
//       headers: {
//         'Authorization': `Bearer ${access_token}`
//       }
//     });

//     console.log('Airtable User Profile Data:', profileResponse.data);

//     const { id: airtableUserId, email, name } = profileResponse.data;
//     console.log('Extracted user data:', { airtableUserId, email, name });

//     // Find or create user
//     let user = await User.findOne({ airtableUserId });
//     console.log('Existing user found:', !!user);
    
//     if (user) {
//       // Update existing user
//       console.log('Updating existing user...');
//       user.accessToken = access_token;
//       user.refreshToken = refresh_token;
//       user.tokenExpiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : null;
//       user.email = email;
//       user.name = name;
//     } else {
//       // Create new user
//       console.log('Creating new user...');
//       user = new User({
//         airtableUserId,
//         email,
//         name,
//         accessToken: access_token,
//         refreshToken: refresh_token,
//         tokenExpiresAt: expires_in ? new Date(Date.now() + expires_in * 1000) : null
//       });
//     }

//     console.log('Saving user to database...');
//     await user.save();
//     console.log('User saved successfully, ID:', user._id);

//     // Generate JWT for our app
//     console.log('Generating JWT token...');
//     const jwtToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );
//     console.log('JWT token generated successfully');

//     // Redirect to frontend with token
//     const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
//     const redirectURL = `${clientURL}/auth/callback?token=${jwtToken}`;
//     console.log('Redirecting to:', redirectURL);
//     res.redirect(redirectURL);

//   } catch (error) {
//     console.error('OAuth callback error:', error.response?.data || error.message);
//     res.status(500).json({ 
//       error: 'Authentication failed',
//       details: error.response?.data || error.message
//     });
//   }
// });

// // Get current user
// router.get('/me', async (req, res) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ error: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select('-accessToken -refreshToken');
    
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid token' });
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// });

// export default router;
import express from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import crypto from 'crypto';
import User from '../models/User.js'; // note the `.js` extension for ESM

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'Auth routes working',
    timestamp: new Date().toISOString(),
    env: {
      clientId: process.env.AIRTABLE_CLIENT_ID ? 'set' : 'missing',
      clientSecret: process.env.AIRTABLE_CLIENT_SECRET ? 'set' : 'missing',
      redirectUri: process.env.AIRTABLE_OAUTH_REDIRECT_URI || 'missing',
    }
  });
});

// Step 1: Login redirect to Airtable
router.get('/airtable/login', (req, res) => {
  console.log('OAuth login initiated');
  
  const clientId = process.env.AIRTABLE_CLIENT_ID;
  const redirectUri = process.env.AIRTABLE_OAUTH_REDIRECT_URI;

  // Validate required environment variables
  if (!clientId) {
    console.error('AIRTABLE_CLIENT_ID not configured');
    return res.status(500).json({ error: 'AIRTABLE_CLIENT_ID not configured' });
  }

  if (!redirectUri) {
    console.error('AIRTABLE_OAUTH_REDIRECT_URI not configured');
    return res.status(500).json({ error: 'AIRTABLE_OAUTH_REDIRECT_URI not configured' });
  }

  const state = crypto.randomBytes(16).toString('hex');
  const scope = 'data.records:read data.records:write schema.bases:read';

  // Build the authorization URL with proper encoding
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    state: state
  });

  const authUrl = `https://airtable.com/oauth2/v1/authorize?${params.toString()}`;
  
  console.log('OAuth Parameters:');
  console.log('- client_id:', clientId);
  console.log('- redirect_uri:', redirectUri);
  console.log('- scope:', scope);
  console.log('- state:', state);
  console.log('- Full URL:', authUrl);

  res.redirect(authUrl);
});

// Step 2: OAuth callback from Airtable
router.get('/airtable/callback', async (req, res) => {
  console.log('OAuth callback received');
  console.log('Query params:', req.query);
  
  const { code, state, error, error_description } = req.query;

  if (error) {
    console.error('OAuth error from Airtable:', error, error_description);
    const clientURL = process.env.CLIENT_URL || 'https://airtable-form-builder-jjcx.onrender.com';
    return res.redirect(`${clientURL}/?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || 'OAuth failed')}`);
  }
  
  if (!code) {
    console.error('No authorization code received');
    const clientURL = process.env.CLIENT_URL || 'https://airtable-form-builder-jjcx.onrender.com';
    return res.redirect(`${clientURL}/?error=no_code&error_description=${encodeURIComponent('No authorization code received')}`);
  }

  try {
    console.log('Exchanging code for tokens...');
    
    // Exchange code for tokens
    const tokenResponse = await axios.post(
      'https://airtable.com/oauth2/v1/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.AIRTABLE_CLIENT_ID,
        client_secret: process.env.AIRTABLE_CLIENT_SECRET,
        redirect_uri: process.env.AIRTABLE_OAUTH_REDIRECT_URI
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    
    console.log('Token exchange successful');

    const tokens = tokenResponse.data;
    console.log('Tokens received:', { 
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      tokenType: tokens.token_type,
      expiresIn: tokens.expires_in
    });

    // Get user info from Airtable
    console.log('Fetching user info from Airtable...');
    const userInfoResponse = await axios.get('https://api.airtable.com/v0/meta/whoami', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    const airtableUser = userInfoResponse.data;
    console.log('Airtable user info:', airtableUser);

    // Find or create user
    let user = await User.findOne({ airtableUserId: airtableUser.id });
    
    if (!user) {
      console.log('Creating new user...');
      user = new User({
        provider: 'airtable',
        airtableUserId: airtableUser.id,
        email: airtableUser.email,
        name: airtableUser.name,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenType: tokens.token_type,
        expiresIn: tokens.expires_in,
        scope: tokens.scope,
        tokenExpiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null
      });
    } else {
      console.log('Updating existing user...');
      user.accessToken = tokens.access_token;
      user.refreshToken = tokens.refresh_token;
      user.tokenType = tokens.token_type;
      user.expiresIn = tokens.expires_in;
      user.scope = tokens.scope;
      user.tokenExpiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null;
      user.email = airtableUser.email;
      user.name = airtableUser.name;
    }

    await user.save();
    console.log('User saved successfully:', user._id);

    // Create JWT for app sessions
    const appToken = jwt.sign(
      { userId: user._id, provider: 'airtable' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const clientURL = process.env.CLIENT_URL || 'https://airtable-form-builder-jjcx.onrender.com';
    const redirectURL = `${clientURL}/auth/callback?token=${appToken}`;
    console.log('Redirecting to:', redirectURL);
    res.redirect(redirectURL);

  } catch (err) {
    console.error('OAuth callback error:', err.response?.data || err.message);
    console.error('Full error:', err);
    
    const clientURL = process.env.CLIENT_URL || 'https://airtable-form-builder-jjcx.onrender.com';
    const errorMessage = err.response?.data?.error || err.message || 'Token exchange failed';
    return res.redirect(`${clientURL}/?error=token_exchange_failed&error_description=${encodeURIComponent(errorMessage)}`);
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-accessToken -refreshToken');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Test endpoint for debugging OAuth configuration
router.get('/debug', (req, res) => {
  res.json({
    message: 'Auth debug endpoint',
    env: {
      clientId: process.env.AIRTABLE_CLIENT_ID ? 'set' : 'missing',
      clientSecret: process.env.AIRTABLE_CLIENT_SECRET ? 'set' : 'missing',
      redirectUri: process.env.AIRTABLE_OAUTH_REDIRECT_URI || 'missing',
      clientUrl: process.env.CLIENT_URL || 'missing',
      serverUrl: process.env.SERVER_URL || 'missing'
    },
    oauth: {
      authUrl: `https://airtable.com/oauth2/v1/authorize?client_id=${process.env.AIRTABLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.AIRTABLE_OAUTH_REDIRECT_URI)}&response_type=code&scope=data.records:read%20data.records:write%20schema.bases:read&state=test`,
      tokenUrl: 'https://airtable.com/oauth2/v1/token'
    }
  });
});

export default router;
