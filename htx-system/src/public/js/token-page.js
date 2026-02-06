const API_BASE_URL = '/api';

async function callApi(endpoint, method = 'GET', data = null) {
    const options = { method, headers: {'Content-Type': 'application/json'} };
    if (data) options.body = JSON.stringify(data);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
}

async function checkAndUseToken() {
    const tokenInput = document.getElementById('token-input');
    const tokenButton = document.getElementById('token-button');
    const buttonText = document.getElementById('button-text');
    const buttonLoader = document.getElementById('button-loader');
    const token = tokenInput.value.trim();
    
    if (!token || token.length < 10) {
        showMessage(token ? 'Token phải có ít nhất 10 ký tự!' : 'Vui lòng nhập token!', 'error');
        return;
    }
    
    // Show loading
    buttonText.textContent = 'ĐANG XÁC THỰC...';
    buttonLoader.style.display = 'inline-block';
    tokenButton.disabled = true;
    
    try {
        const result = await callApi('/tokens/use', 'POST', { token });
        
        if (result.success) {
            showMessage('Xác thực thành công! Đang chuyển hướng...', 'success');
            
            // localStorage.setItem('hoiTraiToken', token);
            // localStorage.setItem('isAuthenticated', 'true');
            
            setTimeout(() => {
                window.location.href = "/game";
            }, 1500);
            
        } else {
            showMessage('Token không hợp lệ hoặc đã được sử dụng!', 'error');
            resetButton(buttonText, buttonLoader, tokenButton);
        }
        
    } catch (error) {
        console.error('Error:', error);
        showMessage('Lỗi kết nối máy chủ. Vui lòng thử lại sau.', 'error');
        resetButton(buttonText, buttonLoader, tokenButton);
    }
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('token-message');
    messageDiv.innerHTML = text;
    messageDiv.className = type;
    messageDiv.style.display = 'block';
    
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

function resetButton(buttonText, buttonLoader, tokenButton) {
    buttonText.textContent = 'TIẾP TỤC';
    buttonLoader.style.display = 'none';
    tokenButton.disabled = false;
}

function checkAuth() {
    if (localStorage.getItem('isAuthenticated') === 'true') {
        window.location.href = "game.html";
    }
}

function validateGamePage() {
    if (!localStorage.getItem('hoiTraiToken') || localStorage.getItem('isAuthenticated') !== 'true') {
        window.location.href = "index.html";
        return false;
    }
    return true;
}

// function logout() {
//     // localStorage.removeItem('hoiTraiToken');
//     // localStorage.removeItem('isAuthenticated');
//     window.location.href = "index.html";
// }

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    document.getElementById('token-button').addEventListener('click', checkAndUseToken);
    
    document.getElementById('token-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkAndUseToken();
    });
});