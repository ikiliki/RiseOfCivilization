import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import ReactMarkdown from 'react-markdown';
import { stripDocumentTitle } from '../../lib/markdown';
import { EmbeddedMermaid } from '../EmbeddedMermaid/EmbeddedMermaid';
import styles from './MarkdownContent.styles.module.css';
export function MarkdownContent({ markdown, emptyMessage = 'No content available.' }) {
    const normalizedMarkdown = stripDocumentTitle(markdown || '');
    if (!normalizedMarkdown) {
        return _jsx("p", { children: emptyMessage });
    }
    function isEmbeddedMermaidChild(child) {
        return typeof child === 'object' && child !== null && 'type' in child && child.type === EmbeddedMermaid;
    }
    return (_jsx("div", { className: styles.markdownContent, children: _jsx(ReactMarkdown, { components: {
                h2: ({ children }) => _jsx("h3", { children: children }),
                h3: ({ children }) => _jsx("h4", { children: children }),
                ul: ({ children }) => _jsx("ul", { className: "list", children: children }),
                ol: ({ children }) => _jsx("ol", { className: "list", children: children }),
                code: ({ children, className, ...props }) => {
                    const isMermaid = className?.includes('language-mermaid');
                    const value = String(children).replace(/\n$/, '');
                    if (isMermaid) {
                        return _jsx(EmbeddedMermaid, { code: value });
                    }
                    return (_jsx("code", { className: className, ...props, children: children }));
                },
                pre: ({ children }) => (Array.isArray(children)
                    ? children.some((child) => isEmbeddedMermaidChild(child))
                    : isEmbeddedMermaidChild(children)) ? (_jsx(_Fragment, { children: children })) : (_jsx("pre", { children: children })),
                a: ({ children, href }) => (_jsx("a", { href: href, target: "_blank", rel: "noreferrer", children: children }))
            }, children: normalizedMarkdown }) }));
}
