const express = require('express');
const router = express.Router();
const { tokenController, createTokenController } = require('../controllers/token.controller');

// Initialize token controller (you might want to move this to app initialization)
tokenController.init();

// Middleware for authentication (if needed)
const authenticate = (req, res, next) => {
  // Add your authentication logic here
  // For example, check API key or admin credentials
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Use token endpoint (typically for clients)
router.post('/use', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    const result = await tokenController.useToken(token);
    
    if (result.valid) {
      res.json({ 
        success: true, 
        message: result.message 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: result.message 
      });
    }
  } catch (error) {
    console.error('Error using token:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Check token endpoint
router.post('/check', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    const result = await tokenController.checkToken(token);
    
    if (result.valid) {
      res.json({ 
        valid: true, 
        message: result.message 
      });
    } else {
      res.json({ 
        valid: false, 
        message: result.message 
      });
    }
  } catch (error) {
    console.error('Error checking token:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Admin endpoints (protected)
router.post('/admin/add', authenticate, async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    const result = await tokenController.addToken(token);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: result.message 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: result.message 
      });
    }
  } catch (error) {
    console.error('Error adding token:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Bulk add tokens
router.post('/admin/bulk-add', authenticate, async (req, res) => {
  try {
    const { tokens } = req.body;
    
    if (!Array.isArray(tokens) || tokens.length === 0) {
      return res.status(400).json({ error: 'Tokens array is required' });
    }
    
    const result = await tokenController.addTokens(tokens);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: result.message 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: result.message 
      });
    }
  } catch (error) {
    console.error('Error bulk adding tokens:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// List all tokens (admin only)
router.get('/admin/list', authenticate, async (req, res) => {
  try {
    const tokens = await tokenController.listTokens();
    res.json({ 
      success: true, 
      count: tokens.length,
      tokens 
    });
  } catch (error) {
    console.error('Error listing tokens:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Clear all tokens (admin only)
router.delete('/admin/clear', authenticate, async (req, res) => {
  try {
    const result = await tokenController.clearTokens();
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: result.message 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: result.message 
      });
    }
  } catch (error) {
    console.error('Error clearing tokens:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Create custom token controller instance
router.post('/admin/create-instance', authenticate, async (req, res) => {
  try {
    const { tokenFile } = req.body;
    
    const customController = createTokenController({ tokenFile });
    await customController.init();
    
    res.json({ 
      success: true, 
      message: 'Custom token controller created',
      tokenFile: customController.tokenFile 
    });
  } catch (error) {
    console.error('Error creating controller:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;