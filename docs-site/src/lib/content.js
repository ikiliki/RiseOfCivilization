export function loadPortalContent() {
    if (typeof window === 'undefined') {
        return null;
    }
    return window.DOCS_PORTAL_CONTENT ?? null;
}
