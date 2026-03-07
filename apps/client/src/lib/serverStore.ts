/**
 * Selected server persistence. Stored in localStorage.
 * Clearing token on server switch is handled by ServerSelector.
 */

import { DEFAULT_SERVER_ID, getServerById, type ServerEntry } from '../config/servers';

const STORAGE_KEY = 'roc_server_id';

function loadStoredId(): string {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    if (id && getServerById(id)) return id;
  } catch {
    // ignore
  }
  return DEFAULT_SERVER_ID;
}

let currentId = loadStoredId();
const listeners = new Set<() => void>();

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function notify(): void {
  listeners.forEach((cb) => cb());
}

export function getSelectedServer(): ServerEntry {
  const server = getServerById(currentId);
  return server ?? { id: 'scania', url: 'http://localhost:4000', displayName: 'Scania' };
}

export function getApiBase(): string {
  return getSelectedServer().url;
}

export function setSelectedServer(id: string): void {
  const server = getServerById(id);
  if (server) {
    currentId = id;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
    notify();
  }
}
