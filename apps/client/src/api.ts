import type {
  BootstrapResponse,
  ChunkDiscoverRequest,
  DiscoveredChunkRecord,
  InspectProfilePayload,
  LoginResponse,
  SavePlayerRequest
} from '@roc/shared-types';

import { getApiBase } from './lib/serverStore';

export interface ServerInfoResponse {
  displayName: string;
}

async function request<T>(path: string, init?: RequestInit, baseUrl?: string): Promise<T> {
  const base = baseUrl ?? getApiBase();
  const mergedHeaders: HeadersInit = {
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
  return response.json() as Promise<T>;
}

export async function getServerInfo(baseUrl: string): Promise<ServerInfoResponse> {
  return request<ServerInfoResponse>('/api/server/info', undefined, baseUrl);
}

export async function login(username: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username })
  });
}

export async function bootstrap(token: string): Promise<BootstrapResponse> {
  return request<BootstrapResponse>('/api/bootstrap', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function discoverChunk(token: string, payload: ChunkDiscoverRequest): Promise<void> {
  await request('/api/chunks/discover', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
}

export async function loadDiscoveredInRange(
  token: string,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): Promise<DiscoveredChunkRecord[]> {
  const result = await request<{ chunks: DiscoveredChunkRecord[] }>(
    `/api/chunks/discovered?minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return result.chunks;
}

export async function savePlayer(token: string, payload: SavePlayerRequest): Promise<void> {
  await request('/api/player/save', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
}

export async function inspectPlayer(token: string, userId: string): Promise<InspectProfilePayload> {
  return request<InspectProfilePayload>(`/api/player/${encodeURIComponent(userId)}/inspect`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
