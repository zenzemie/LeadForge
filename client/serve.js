import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5173;

// --- PASSWORD PROTECTION MIDDLEWARE ---
const auth = (req, res, next) => {
  // Get the auth header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="LeadForge Private Access"');
    return res.status(401).send('Authentication required.');
  }

  // Check credentials (Username: admin, Password: YOUR_PASSWORD)
  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  // We will use the same API_AUTH_KEY as the password for simplicity
  const secretPassword = 'kali26';

  if (user === 'admin' && pass === secretPassword) {
    return next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="LeadForge Private Access"');
    return res.status(401).send('Invalid credentials.');
  }
};

// Apply protection to all frontend routes
app.use(auth);
// ---------------------------------------

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Redirect all requests to index.html (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Bind to 0.0.0.0 for Render
app.listen(port, '0.0.0.0', () => {
  console.log(`Private LeadForge server running on port ${port}`);
});
