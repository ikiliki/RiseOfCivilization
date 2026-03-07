/**
 * Server list for multiplayer. Display names are fetched from each server via /api/server/info.
 */
export const SERVERS = [
    { id: 'scania', url: 'http://localhost:4000' },
    { id: 'bera', url: 'http://localhost:4001' }
];
export const DEFAULT_SERVER_ID = 'scania';
export function getServerById(id) {
    return SERVERS.find((s) => s.id === id);
}
export function getDefaultServer() {
    const env = import.meta.env.VITE_API_BASE_URL;
    if (env) {
        const match = SERVERS.find((s) => s.url === env);
        if (match)
            return match;
        return { id: 'env', url: env, displayName: 'Env' };
    }
    return SERVERS[0];
}
