import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import mermaid from 'mermaid';
import styles from './MermaidDiagram.styles.module.css';
export function MermaidDiagram({ diagram, index }) {
    const [svg, setSvg] = useState('');
    const [copyLabel, setCopyLabel] = useState('Copy Mermaid');
    const elementId = useMemo(() => `mermaid-diagram-${index}`, [index]);
    useEffect(() => {
        let isMounted = true;
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose'
        });
        mermaid
            .render(elementId, diagram.code)
            .then((result) => {
            if (isMounted) {
                setSvg(result.svg);
            }
        })
            .catch(() => {
            if (isMounted) {
                setSvg('');
            }
        });
        return () => {
            isMounted = false;
        };
    }, [diagram.code, elementId]);
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(diagram.code);
            setCopyLabel('Copied');
            window.setTimeout(() => setCopyLabel('Copy Mermaid'), 1200);
        }
        catch {
            setCopyLabel('Copy failed');
            window.setTimeout(() => setCopyLabel('Copy Mermaid'), 1200);
        }
    }
    return (_jsxs("details", { className: "diagram", open: index === 0, children: [_jsx("summary", { children: diagram.title }), _jsx("p", { className: "diagram-intro", children: diagram.intro }), _jsx("div", { className: "diagram-toolbar", children: _jsx("button", { className: "copy-btn", type: "button", onClick: handleCopy, children: copyLabel }) }), _jsx("pre", { children: _jsx("code", { children: diagram.code }) }), _jsx("div", { className: `mermaid-wrap ${styles.mermaidWrap}`, children: svg ? (_jsx("div", { dangerouslySetInnerHTML: { __html: svg } })) : (_jsx("p", { className: styles.renderMessage, children: "Mermaid preview unavailable." })) })] }));
}
