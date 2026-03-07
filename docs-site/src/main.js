import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles.css';
import { App } from './App';
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Missing #root element for docs portal.');
}
const resolvedRootElement = rootElement;
function renderApp() {
    createRoot(resolvedRootElement).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
}
function loadGeneratedContentScript() {
    if (typeof window !== 'undefined' && window.DOCS_PORTAL_CONTENT) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${import.meta.env.BASE_URL}content.generated.js`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load generated docs content.'));
        document.head.appendChild(script);
    });
}
loadGeneratedContentScript()
    .catch(() => undefined)
    .finally(() => {
    renderApp();
});
