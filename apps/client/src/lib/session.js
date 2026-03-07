/**
 * Session persistence via localStorage, per server.
 * Token persists across reloads. Each server (Scania, Bera) has its own token.
 */
function storageKey(serverId) {
    return `roc_session_token_${serverId}`;
}
export function getStoredToken(serverId) {
    try {
        return localStorage.getItem(storageKey(serverId));
    }
    catch {
        return null;
    }
}
export function setStoredToken(token, serverId) {
    try {
        localStorage.setItem(storageKey(serverId), token);
    }
    catch {
        // ignore (e.g. private mode, quota)
    }
}
export function clearStoredToken(serverId) {
    try {
        localStorage.removeItem(storageKey(serverId));
    }
    catch {
        // ignore
    }
}
