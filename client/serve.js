import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5173;
const distPath = path.resolve(__dirname, 'dist');

// Debug: Check if dist folder exists
if (fs.existsSync(distPath)) {
  console.log('✅ Dist folder found at:', distPath);
  console.log('Files in dist:', fs.readdirSync(distPath));
} else {
  console.error('❌ ERROR: Dist folder NOT FOUND. Run npm run build first.');
}

// 1. Serve assets first (NO AUTH)
app.use('/assets', express.static(path.join(distPath, 'assets'), {
  fallthrough: false // If asset not found, don't try auth, just 404
}));

// 2. Simple Auth
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="LeadForge"');
    return res.status(401).send('Auth Required');
  }
  const [user, pass] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  if (user === 'admin' && pass === 'kali26') return next();
  res.setHeader('WWW-Authenticate', 'Basic realm="LeadForge"');
  return res.status(401).send('Invalid');
};

// 3. Apply auth to HTML and other routes
app.use(auth);
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server live on port ${port}`);
});
