import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import mermaid from 'mermaid';
import styles from './EmbeddedMermaid.styles.module.css';
export function EmbeddedMermaid({ code }) {
    const [svg, setSvg] = useState('');
    const [copyLabel, setCopyLabel] = useState('Copy Mermaid');
    const elementId = useMemo(() => `embedded-mermaid-${Math.random().toString(36).slice(2, 10)}`, []);
    useEffect(() => {
        let mounted = true;
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose'
        });
        mermaid
            .render(elementId, code)
            .then((result) => {
            if (mounted) {
                setSvg(result.svg);
            }
        })
            .catch(() => {
            if (mounted) {
                setSvg('');
            }
        });
        return () => {
            mounted = false;
        };
    }, [code, elementId]);
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(code);
            setCopyLabel('Copied');
            window.setTimeout(() => setCopyLabel('Copy Mermaid'), 1200);
        }
        catch {
            setCopyLabel('Copy failed');
            window.setTimeout(() => setCopyLabel('Copy Mermaid'), 1200);
        }
    }
    return (_jsxs("div", { className: styles.panel, children: [_jsxs("div", { className: styles.toolbar, children: [_jsx("span", { className: styles.label, children: "Mermaid Graph" }), _jsx("button", { className: "copy-btn", type: "button", onClick: handleCopy, children: copyLabel })] }), _jsx("pre", { className: styles.codePanel, children: _jsx("code", { children: code }) }), _jsx("div", { className: styles.preview, children: svg ? (_jsx("div", { dangerouslySetInnerHTML: { __html: svg } })) : (_jsx("p", { className: styles.empty, children: "Mermaid preview unavailable." })) })] }));
}
