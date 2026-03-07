import { getApiBase } from './lib/serverStore';
async function request(path, init, baseUrl) {
    const base = baseUrl ?? getApiBase();
    const mergedHeaders = {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
    };
    const response = await fetch(`${base}${path}`, {
        ...init,
        headers: mergedHeaders
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed: ${response.status}`);
    }
    return response.json();
}
export async function getServerInfo(baseUrl) {
    return request('/api/server/info', undefined, baseUrl);
}
export async function login(username) {
    return request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username })
    });
}
export async function bootstrap(token) {
    return request('/api/bootstrap', {
        headers: { Authorization: `Bearer ${token}` }
    });
}
export async function discoverChunk(token, payload) {
    await request('/api/chunks/discover', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
    });
}
export async function loadDiscoveredInRange(token, minX, maxX, minY, maxY) {
    const result = await request(`/api/chunks/discovered?minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return result.chunks;
}
export async function savePlayer(token, payload) {
    await request('/api/player/save', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
    });
}
export async function inspectPlayer(token, userId) {
    return request(`/api/player/${encodeURIComponent(userId)}/inspect`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}
