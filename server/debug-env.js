import 'dotenv/config';

console.log('=== Environment Variables Debug ===');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET (length: ' + process.env.MONGO_URI.length + ')' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('AIRTABLE_CLIENT_ID:', process.env.AIRTABLE_CLIENT_ID ? 'SET' : 'NOT SET');
console.log('AIRTABLE_CLIENT_SECRET:', process.env.AIRTABLE_CLIENT_SECRET ? 'SET' : 'NOT SET');
console.log('AIRTABLE_OAUTH_REDIRECT_URI:', process.env.AIRTABLE_OAUTH_REDIRECT_URI);
console.log('Current working directory:', process.cwd());
console.log('=== End Debug ===');