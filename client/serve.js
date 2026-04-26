import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5173;

const distPath = path.resolve(__dirname, 'dist');

// Middleware to log requests (helps debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 1. Serve static assets (JS, CSS, images) WITHOUT auth
// These have hashed filenames, so they are secure by obscurity.
// This prevents "Blank Screen" issues where the browser fails to send auth for assets.
app.use('/assets', express.static(path.join(distPath, 'assets')));
app.use('/favicon.svg', express.static(path.join(distPath, 'favicon.svg')));

// 2. PASSWORD PROTECTION MIDDLEWARE for everything else (HTML)
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="LeadForge Private Access"');
    return res.status(401).send('Authentication required.');
  }

  try {
    const authData = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = authData[0];
    const pass = authData[1];

    if (user === 'admin' && pass === 'kali26') {
      return next();
    }
  } catch (err) {
    console.error('Auth parsing error:', err);
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="LeadForge Private Access"');
  return res.status(401).send('Invalid credentials.');
};

app.use(auth);

// 3. Serve the main app after authentication
app.use(express.static(distPath));

// Redirect all requests to index.html (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Private LeadForge server running on port ${port}`);
});
