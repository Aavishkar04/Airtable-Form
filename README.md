# Dynamic Airtable-Connected Form Builder

A production-ready MERN full-stack application that enables users to authenticate with Airtable OAuth, select bases and tables, build dynamic forms with conditional logic, and save submissions directly to Airtable.

## 🚀 Live Demo

all at render -https://airtable-form-builder-jjcx.onrender.com
## 🎥 Demo Video

[![Watch the video](https://img.youtube.com/vi/3tbWtRJPPXo/0.jpg)](https://youtu.be/3tbWtRJPPXo?si=5mVuUPmgmSnU0bZA)

Click the thumbnail above to watch the full demo on YouTube.
or click this link here - https://youtu.be/3tbWtRJPPXo?si=5mVuUPmgmSnU0bZA
## 📋 Features

- **Airtable OAuth Integration**: Secure login with Airtable accounts
- **Dynamic Form Builder**: Create forms from Airtable table fields
- **Conditional Logic**: Show/hide fields based on user responses
- **Supported Field Types**: Short text, long text, single select, multi select, attachments
- **Real-time Preview**: Live form preview with conditional logic evaluation
- **File Upload**: S3-compatible attachment handling
- **Responsive Design**: Clean, accessible UI built with React and Tailwind CSS

## 🛠 Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- AWS S3 for file uploads
- Helmet & CORS for security

## 📚 Reference Documentation

- [Airtable Home](https://www.airtable.com)
- [Airtable OAuth Reference](https://airtable.com/developers/web/api/oauth-reference)
- [Airtable REST API](https://airtable.com/developers/web/api/introduction)
- [Airtable Create Records](https://airtable.com/developers/web/api/create-records)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/docs/) / [Mongoose](https://mongoosejs.com/docs/)
- [Vercel Deploy Docs](https://vercel.com/docs)
- [Render Deploy Docs](https://render.com/docs)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Airtable account with OAuth app
- AWS S3 bucket (for file uploads)

### Airtable OAuth Setup

1. Go to [Airtable Developer Hub](https://airtable.com/developers/web/api/oauth-reference)
2. Create a new OAuth integration
3. Set the redirect URI to: `https://your-backend-url/auth/airtable/callback`
4. Note your Client ID and Client Secret

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/airtable-form-builder.git
   cd airtable-form-builder
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # Or start individually:
   # Terminal 1 - Backend: npm run server:dev
   # Terminal 2 - Frontend: npm run client:dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

## 🔧 Environment Variables

See `.env.example` for all required environment variables.

## 📝 Supported Field Types

The form builder supports these Airtable field types:
- **Short Text** ← Single-line text
- **Long Text** ← Multi-line text
- **Single Select** ← Single select with options
- **Multi Select** ← Multiple select with options
- **Attachment** ← File upload (stored in S3)

*Note: Other Airtable field types (date, checkbox, formula, number, etc.) are not supported and will be filtered out.*

## 🔀 Conditional Logic

Forms support conditional show/hide rules with the following format:

```json
{
  "mode": "all",  // "all" (AND) or "any" (OR)
  "conditions": [
    { "fieldId": "fldA1", "operator": "equals", "value": "Engineer" },
    { "fieldId": "fldB2", "operator": "includes", "value": "JavaScript" }
  ]
}
```

**Supported Operators:**
- `equals` - Exact match
- `not_equals` - Not equal to
- `includes` - Contains value (for multi-select)
- `not_includes` - Does not contain value

## 📁 Project Structure

```
airtable-form-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   ├── public/
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── utils/         # Utility functions
│   │   └── server.js      # Main server file
│   ├── tests/             # Test files
│   └── package.json
├── .env.example           # Environment template
├── .gitignore
└── README.md
```

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication Flow**
   - [ ] Click "Login with Airtable" redirects to Airtable
   - [ ] After authorization, user is redirected back with token
   - [ ] User profile is displayed correctly

2. **Form Builder**
   - [ ] Fetch and display user's Airtable bases
   - [ ] Select base and fetch tables
   - [ ] Select table and fetch supported fields only
   - [ ] Build form with field customization
   - [ ] Add conditional logic rules
   - [ ] Save form successfully

3. **Form Viewer**
   - [ ] Form renders with correct fields
   - [ ] Conditional logic works in real-time
   - [ ] Required field validation
   - [ ] File upload functionality
   - [ ] Form submission creates Airtable record

4. **Error Handling**
   - [ ] Expired token handling
   - [ ] Network error handling
   - [ ] Invalid form data handling

### Automated Tests

Run the test suite:

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 🔒 Security Considerations

- **Token Storage**: Access tokens are stored encrypted in MongoDB
- **CSRF Protection**: OAuth state parameter prevents CSRF attacks
- **JWT Sessions**: Short-lived JWTs for user sessions
- **Input Validation**: Server-side validation for all form inputs
- **CORS**: Configured to allow only trusted origins
- **Environment Variables**: Sensitive data stored in environment variables

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Update `AIRTABLE_OAUTH_REDIRECT_URI` to deployed backend URL
4. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure these are set in your deployment platforms:
- All variables from `.env.example`
- Update URLs to production domains
- Use production MongoDB connection string
- Configure CORS for production frontend domain

## 📊 Sample Table Structure

For testing, create an Airtable base with this structure:

```json
{
  "tableName": "Contact Form",
  "fields": [
    { "name": "Name", "type": "singleLineText" },
    { "name": "Email", "type": "email" },
    { "name": "Role", "type": "singleSelect", "options": ["Developer", "Designer", "Manager"] },
    { "name": "Skills", "type": "multipleSelects", "options": ["JavaScript", "Python", "React", "Node.js"] },
    { "name": "Message", "type": "multilineText" },
    { "name": "Resume", "type": "multipleAttachments" }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/new-feature`
3. Commit changes: `git commit -m 'feat: add new feature'`
4. Push to branch: `git push origin feat/new-feature`
5. Submit a pull request


since its assignment for internship, all credentials are kepts exposed for temproary duration
