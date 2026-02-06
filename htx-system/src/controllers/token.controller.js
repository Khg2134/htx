const fs = require('fs').promises;
const path = require('path');

const tokenController = {
  tokenFile: 'valid_tokens.txt',
  
  // Initialize tokens file if it doesn't exist
  async init() {
    try {
      await fs.access(this.tokenFile);
    } catch (error) {
      await fs.writeFile(this.tokenFile, '');
    }
    return this;
  },
  
  async useToken(token) {
    try {
      // Read tokens file
      const data = await fs.readFile(this.tokenFile, 'utf8');
      const tokens = data.trim().split('\n');
      
      // Find token index
      const tokenIndex = tokens.indexOf(token);
      
      if (tokenIndex === -1) {
        return { valid: false, message: 'Invalid token' };
      }
      
      // Remove token from array
      tokens.splice(tokenIndex, 1);
      
      // Save updated tokens back to file
      await fs.writeFile(this.tokenFile, tokens.join('\n'));
      
      return { valid: true, message: 'Token used successfully' };
      
    } catch (error) {
      return { valid: false, message: 'Server error' };
    }
  },
  
  async checkToken(token) {
    try {
      const data = await fs.readFile(this.tokenFile, 'utf8');
      const tokens = data.trim().split('\n');
      
      if (tokens.includes(token)) {
        return { valid: true, message: 'Token is valid' };
      }
      
      return { valid: false, message: 'Invalid token' };
      
    } catch (error) {
      return { valid: false, message: 'Server error' };
    }
  },
  
  async addToken(token) {
    try {
      await fs.appendFile(this.tokenFile, token + '\n');
      return { success: true, message: 'Token added' };
    } catch (error) {
      return { success: false, message: 'Error adding token' };
    }
  },
  
  async listTokens() {
    try {
      const data = await fs.readFile(this.tokenFile, 'utf8');
      const tokens = data.trim().split('\n').filter(t => t.length > 0);
      return tokens;
    } catch (error) {
      return [];
    }
  },
  
  // Bonus: Add a method to clear all tokens
  async clearTokens() {
    try {
      await fs.writeFile(this.tokenFile, '');
      return { success: true, message: 'All tokens cleared' };
    } catch (error) {
      return { success: false, message: 'Error clearing tokens' };
    }
  },
  
  // Bonus: Add a method to bulk add tokens
  async addTokens(tokenArray) {
    try {
      const tokens = tokenArray.join('\n') + '\n';
      await fs.appendFile(this.tokenFile, tokens);
      return { success: true, message: `${tokenArray.length} tokens added` };
    } catch (error) {
      return { success: false, message: 'Error adding tokens' };
    }
  }
};

// Factory function for creating instances with custom token files
function createTokenController(config = {}) {
  return Object.create(TokenController, {
    tokenFile: {
      value: config.tokenFile || 'valid_tokens.txt',
      writable: true,
      enumerable: true,
      configurable: true
    }
  });
}

module.exports = { tokenController, createTokenController };