# Deployment Guide

## Prerequisites

1. **Airtable OAuth App Setup**
   - Go to [Airtable Developer Hub](https://airtable.com/developers/web/api/oauth-reference)
   - Create a new OAuth integration
   - Note your Client ID and Client Secret
   - Set redirect URI (will be updated after backend deployment)

2. **MongoDB Atlas Database**
   - Create a free MongoDB Atlas cluster
   - Get connection string
   - Whitelist deployment IPs

3. **AWS S3 Bucket** (for file uploads)
   - Create S3 bucket
   - Configure CORS for your frontend domain
   - Create IAM user with S3 permissions
   - Note access keys

## Backend Deployment (Render)

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Create new Web Service
   - Connect your GitHub repository
   - Select `server` folder as root directory

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_jwt_secret_here
   AIRTABLE_CLIENT_ID=your_airtable_client_id
   AIRTABLE_CLIENT_SECRET=your_airtable_client_secret
   AIRTABLE_OAUTH_REDIRECT_URI=https://your-app-name.onrender.com/auth/airtable/callback
   S3_BUCKET=your_s3_bucket_name
   S3_REGION=your_s3_region
   S3_ACCESS_KEY_ID=your_s3_access_key
   S3_SECRET_ACCESS_KEY=your_s3_secret_key
   CLIENT_URL=https://your-frontend.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the deployed URL (e.g., `https://your-app-name.onrender.com`)

5. **Update Airtable OAuth Redirect URI**
   - Go back to Airtable Developer Hub
   - Update redirect URI to: `https://your-app-name.onrender.com/auth/airtable/callback`

## Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Select `client` folder as root directory

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-app-name.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the deployed URL (e.g., `https://your-frontend.vercel.app`)

5. **Update Backend CORS**
   - Update `CLIENT_URL` environment variable in Render
   - Set to your Vercel deployment URL

## Post-Deployment Verification

1. **Test Authentication Flow**
   - Visit your deployed frontend
   - Click "Login with Airtable"
   - Complete OAuth flow
   - Verify you're redirected back and logged in

2. **Test Form Building**
   - Create a new form
   - Select base and table
   - Add fields and conditional logic
   - Save form

3. **Test Form Submission**
   - Open form in new tab using preview link
   - Fill out and submit form
   - Verify record appears in Airtable

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_URL` is set correctly in backend
   - Check Vercel deployment URL matches exactly

2. **OAuth Redirect Issues**
   - Verify `AIRTABLE_OAUTH_REDIRECT_URI` matches Airtable app settings
   - Ensure no trailing slashes in URLs

3. **Database Connection**
   - Check MongoDB Atlas IP whitelist includes `0.0.0.0/0` for Render
   - Verify connection string format

4. **File Upload Issues**
   - Check S3 bucket CORS configuration
   - Verify AWS credentials have proper permissions

### Logs and Debugging

- **Render Logs**: Available in Render dashboard under "Logs" tab
- **Vercel Logs**: Available in Vercel dashboard under "Functions" tab
- **Browser Console**: Check for client-side errors

## Security Checklist

- [ ] All environment variables set (no hardcoded secrets)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] S3 bucket permissions restricted to necessary actions
- [ ] HTTPS enabled on all deployments
- [ ] JWT secret is random and secure
- [ ] Airtable OAuth app restricted to necessary scopes

## Monitoring

- Set up Render health checks on `/health` endpoint
- Monitor Vercel deployment status
- Set up MongoDB Atlas monitoring alerts
- Consider adding error tracking (Sentry, LogRocket, etc.)