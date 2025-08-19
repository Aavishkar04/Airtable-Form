# Debug Steps for Airtable Form Builder

## Step 1: Test Backend Only
```bash
cd server
npm run dev
```

**Expected Output:**
```
Server running on port 4000
Connected to MongoDB
```

**Test:** Open http://localhost:4000/health
**Expected:** `{"status":"OK","timestamp":"..."}`

## Step 2: Test OAuth Endpoint
**Test:** Open http://localhost:4000/auth/airtable/login
**Expected:** Redirect to Airtable OAuth page

## Step 3: Test Frontend Only
```bash
cd client
npm run dev
```

**Expected Output:**
```
VITE v4.5.14  ready in 556 ms
➜  Local:   http://localhost:5173/
```

**Test:** Open http://localhost:5173
**Expected:** Landing page with login button

## Step 4: Test Full Flow
1. Click "Login with Airtable" button
2. Should redirect to Airtable
3. After OAuth, should redirect back

## Common Issues:

### Issue 1: "You are being redirected" error
**Cause:** Frontend trying to access backend routes directly
**Fix:** Make sure backend is running on port 4000

### Issue 2: CORS errors
**Cause:** Frontend and backend not communicating
**Fix:** Check both servers are running

### Issue 3: MongoDB connection error
**Cause:** Invalid MONGO_URI in .env
**Fix:** Check MongoDB Atlas connection string

## Quick Test Commands:

```bash
# Test backend health
curl http://localhost:4000/health

# Test OAuth redirect
curl -I http://localhost:4000/auth/airtable/login

# Check if both servers are running
netstat -an | findstr :4000
netstat -an | findstr :5173
```