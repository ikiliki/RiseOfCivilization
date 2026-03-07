/**
 * Selected server persistence. Stored in localStorage.
 * Clearing token on server switch is handled by ServerSelector.
 */
import { DEFAULT_SERVER_ID, getServerById } from '../config/servers';
const STORAGE_KEY = 'roc_server_id';
function loadStoredId() {
    try {
        const id = localStorage.getItem(STORAGE_KEY);
        if (id && getServerById(id))
            return id;
    }
    catch {
        // ignore
    }
    return DEFAULT_SERVER_ID;
}
let currentId = loadStoredId();
const listeners = new Set();
export function subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
}
function notify() {
    listeners.forEach((cb) => cb());
}
export function getSelectedServer() {
    const server = getServerById(currentId);
    return server ?? { id: 'scania', url: 'http://localhost:4000', displayName: 'Scania' };
}
export function getApiBase() {
    return getSelectedServer().url;
}
export function setSelectedServer(id) {
    const server = getServerById(id);
    if (server) {
        currentId = id;
        try {
            localStorage.setItem(STORAGE_KEY, id);
        }
        catch {
            // ignore
        }
        notify();
    }
}
