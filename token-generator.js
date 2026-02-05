const fs = require('fs');

// Generate random token
function generateRandomToken(length = 12) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let token = "";
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        token += charset[randomIndex];
    }
    
    return token;
}

// Generate multiple tokens
function generateTokenSet(count = 5) {
    const tokens = [];
    
    for (let i = 0; i < count; i++) {
        const length = i % 3 === 0 ? 10 : i % 3 === 1 ? 12 : 14;
        tokens.push(generateRandomToken(length));
    }
    
    return tokens;
}

// Generate tokens
const randomTokens = generateTokenSet(1000);

// Create content for tokens.txt
const tokensContent = randomTokens.join('\n');

// Encode to base64 for tokens-encode.txt
const encodedTokens = Buffer.from(tokensContent).toString('base64');

// Write both files
fs.writeFileSync('tokens.txt', tokensContent, 'utf8');
fs.writeFileSync('encoded-tokens.txt', encodedTokens, 'utf8');

console.log('Tokens saved to tokens.txt');
console.log('Encoded tokens saved to tokens-encode.txt');