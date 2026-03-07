import type { DocsPortalContent } from '../types/content';

export function loadPortalContent(): DocsPortalContent | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.DOCS_PORTAL_CONTENT ?? null;
}
