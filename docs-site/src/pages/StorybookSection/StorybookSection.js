import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MarkdownContent } from '../../components/MarkdownContent/MarkdownContent';
import { SectionShell } from '../../components/SectionShell/SectionShell';
import styles from './StorybookSection.styles.module.css';
export function StorybookSection({ iframeUrl = 'http://localhost:6006', markdown, sourceLabel }) {
    return (_jsxs(SectionShell, { id: "storybook", title: "Storybook", sourceLabel: sourceLabel, children: [_jsxs("div", { className: "storybook-frame", children: [_jsxs("div", { className: "storybook-toolbar", children: [_jsx("h3", { children: "Embedded Storybook" }), _jsx("div", { className: "storybook-actions", children: _jsx("a", { className: "copy-btn", href: iframeUrl, target: "_blank", rel: "noreferrer", children: "Open in New Tab" }) })] }), _jsx("iframe", { className: `storybook-iframe ${styles.storybookIframe}`, title: "Storybook Preview", src: iframeUrl, loading: "lazy", referrerPolicy: "no-referrer" })] }), _jsx("div", { className: "card", children: _jsx(MarkdownContent, { markdown: markdown }) })] }));
}
