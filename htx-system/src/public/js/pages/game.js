function validateGamePage() {
    const sessionAuth = sessionStorage.getItem('tokenAuthenticated');
    const sessionToken = sessionStorage.getItem('currentToken');
    
    const localStorageAuth = localStorage.getItem('isAuthenticated');
    const localToken = localStorage.getItem('hoiTraiToken');
    const tokenTime = localStorage.getItem('tokenTime');
    
    if (sessionAuth === 'true' && sessionToken) {
        if (!localStorageAuth || !localToken) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('hoiTraiToken', sessionToken);
            localStorage.setItem('tokenTime', Date.now().toString());
        }
        return true;
    }
    
    if (localStorageAuth === 'true' && localToken && tokenTime) {
        const currentTime = Date.now();
        const tokenAge = currentTime - parseInt(tokenTime);
        
        if (tokenAge < 86400000) {
            sessionStorage.setItem('tokenAuthenticated', 'true');
            sessionStorage.setItem('currentToken', localToken);
            return true;
        } else {
            clearAuthData();
            redirectToLogin();
            return false;
        }
    }
    
    redirectToLogin();
    return false;
}

function clearAuthData() {
    localStorage.removeItem('hoiTraiToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('tokenTime');
    sessionStorage.removeItem('tokenAuthenticated');
    sessionStorage.removeItem('currentToken');
}

function redirectToLogin() {
    window.location.href = "/token";
}
document.addEventListener('DOMContentLoaded', function() {
    const isValid = validateGamePage();
    
    console.log('Authentication status:', isValid ? 'Valid' : 'Not valid');

    if (!isValid) {
        console.log('Not confirmed, changing direction...');
        redirectToLogin();
    }

    clearAuthData();
    console.log('All authentication data removed');
});