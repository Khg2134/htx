// Token System
let validTokens = [];

// Load tokens from file
async function loadTokens() {
    try {
        const response = await fetch('encoded-tokens.txt');
        const text = await response.text();
        const decodedText = atob(text);
        validTokens = decodedText.split('\n')
            .map(token => token.trim())
            .filter(token => token.length > 0);
        console.log(`Loaded ${validTokens.length} valid tokens`, validTokens);
    } catch (error) {
        console.error('Error loading tokens:', error);
        showMessage('Không thể tải danh sách token. Vui lòng liên hệ ban tổ chức.', 'error');
    }
}

// Check token function
function checkToken() {
    const tokenInput = document.getElementById('token-input');
    const tokenButton = document.getElementById('token-button');
    const buttonText = document.getElementById('button-text');
    const buttonLoader = document.getElementById('button-loader');
    const token = tokenInput.value.trim();
    
    if (!token) {
        showMessage('Vui lòng nhập token!', 'error');
        return;
    }
    
    // Show loading
    buttonText.textContent = 'ĐANG KIỂM TRA...';
    buttonLoader.style.display = 'inline-block';
    tokenButton.disabled = true;
    
    // Check token after delay
    setTimeout(() => {
        console.log('Checking token:', token);
        console.log('Valid tokens:', validTokens);
        
        if (validTokens.includes(token)) {
            showMessage('Token hợp lệ! Đang chuyển hướng...', 'success');
            
            // Save token to localStorage
            localStorage.setItem('hoiTraiToken', token);
            localStorage.setItem('isAuthenticated', 'true');
            
            // Switch to game section after 1.5 seconds
            setTimeout(() => {
                window.location.href = "game.html";
            }, 1500);
            
        } else {
            showMessage('Token không hợp lệ! Vui lòng kiểm tra lại.', 'error');
            console.log('Invalid token:', token);
        }
        
        // Hide loading
        buttonText.textContent = 'TIẾP TỤC';
        buttonLoader.style.display = 'none';
        tokenButton.disabled = false;
    }, 1000);
}

// Show message function
function showMessage(text, type) {
    const messageDiv = document.getElementById('token-message');
    messageDiv.innerHTML = `
        ${text}
    `;
    //        <i class="fas ${type === 'success' ? 'ph ph-check' : 'ph ph-x'}"></i>
    messageDiv.className = `${type}`;
    messageDiv.style.display = 'block';
    
    // Auto hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Check if already authenticated
function checkAuthentication() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
        // Nếu đã đăng nhập, chuyển thẳng sang game
        window.location.href = "game.html";
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load tokens
    loadTokens();
    
    // Check authentication
    checkAuthentication();
    
    // Token button click
    document.getElementById('token-button').addEventListener('click', checkToken);
    
    // Enter key press
    document.getElementById('token-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkToken();
        }
    });
});