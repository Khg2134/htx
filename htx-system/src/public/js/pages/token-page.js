import { callApi } from '../utils/api.js';

async function checkAndUseToken() {
    const tokenInput = document.getElementById('token-input');
    const tokenButton = document.getElementById('token-button');
    const buttonText = document.getElementById('button-text');
    const buttonLoader = document.getElementById('button-loader');
    const token = tokenInput.value.trim();
    
    if (!token || token.length < 5) {
        showMessage(token ? 'Token phải có ít nhất 5 ký tự!' : 'Vui lòng nhập token!', 'error');
        return;
    }
    
    // Show loading
    buttonText.textContent = 'ĐANG XÁC THỰC...';
    buttonLoader.style.display = 'inline-block';
    tokenButton.disabled = true;
    
    try {
        const result = await callApi('/tokens/use', 'POST', { token });
        
        if (result.success) {
            localStorage.setItem('hoiTraiToken', token);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('tokenTime', Date.now().toString());
            
            sessionStorage.setItem('tokenAuthenticated', 'true');
            sessionStorage.setItem('currentToken', token);
            
            showMessage('Xác thực thành công! Đang chuyển hướng...', 'success');
            
            window.location.href = "/game";
            
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
    const isAuth = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('hoiTraiToken');
    const tokenTime = localStorage.getItem('tokenTime');
    
    if (isAuth === 'true' && token && tokenTime) {
        const currentTime = Date.now();
        const tokenAge = currentTime - parseInt(tokenTime);
        
        if (tokenAge < 86400000) {
            window.location.href = "/game";
        } else {
            clearAuthData();
        }
    }
}

function clearAuthData() {
    localStorage.removeItem('hoiTraiToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('tokenTime');
    sessionStorage.removeItem('tokenAuthenticated');
    sessionStorage.removeItem('currentToken');
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    const tokenButton = document.getElementById('token-button');
    if (tokenButton) {
        tokenButton.addEventListener('click', checkAndUseToken);
    }
    
    const tokenInput = document.getElementById('token-input');
    if (tokenInput) {
        tokenInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkAndUseToken();
        });
    }
});