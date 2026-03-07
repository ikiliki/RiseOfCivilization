/**
 * Recent players for login screen, per server.
 * Each server (Scania, Bera) has its own recent players list.
 */
const STORAGE_KEY_PREFIX = 'roc_recent_players_';
const MAX_RECENT = 8;
const DEFAULT_PLAYERS = [
    { username: 'ikiliki', skinColor: '#8b5a2b' },
    { username: 'ikiliki1', skinColor: '#4f9d69' }
];
function storageKey(serverId) {
    return `${STORAGE_KEY_PREFIX}${serverId}`;
}
function loadRecent(serverId) {
    try {
        const raw = localStorage.getItem(storageKey(serverId));
        if (!raw)
            return [...DEFAULT_PLAYERS];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [...DEFAULT_PLAYERS];
        const merged = [...DEFAULT_PLAYERS];
        for (const p of parsed) {
            if (p?.username && p?.skinColor && !merged.some((m) => m.username === p.username)) {
                merged.push(p);
            }
        }
        return merged.slice(0, MAX_RECENT);
    }
    catch {
        return [...DEFAULT_PLAYERS];
    }
}
export function getRecentPlayers(serverId) {
    return loadRecent(serverId);
}
export function addRecentPlayer(username, skinColor, serverId) {
    try {
        const recent = loadRecent(serverId);
        const filtered = recent.filter((p) => p.username !== username);
        const updated = [{ username, skinColor }, ...filtered].slice(0, MAX_RECENT);
        localStorage.setItem(storageKey(serverId), JSON.stringify(updated));
    }
    catch {
        // ignore
    }
}
