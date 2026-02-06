const API_BASE_URL = '/api';

export async function callApi(endpoint, method = 'GET', data = null) {
    const options = { method, headers: {'Content-Type': 'application/json'} };
    if (data) options.body = JSON.stringify(data);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
}