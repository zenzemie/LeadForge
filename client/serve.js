const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5173;

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Redirect all requests to index.html (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server running on port ${port}`);
});
