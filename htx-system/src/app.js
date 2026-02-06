const express = require('express');
const cors = require('cors');
const path = require('path');
const tokensRouter = require('./routes/token.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// Serve static files from 'public' directory (CSS, JS, images, fonts, etc.)
// This should come BEFORE your route handlers
app.use(express.static(path.join(__dirname, 'public')));

// API Routes - these should come before static HTML routes
app.use('/api/tokens', tokensRouter);

// Static pages rendering
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/token', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'token-page.html'));
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'game.html'));
});

// 404 handler - AFTER all other routes
app.use((req, res) => {
  // Check if it's an API request
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  // For web pages, serve 404.html
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Different error responses for API vs web
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  
  // Check if 500.html exists, otherwise send JSON
  res.status(500).sendFile(path.join(__dirname, 'views', '500.html'), (err) => {
    if (err) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;