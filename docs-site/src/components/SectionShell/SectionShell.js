import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './SectionShell.styles.module.css';
export function SectionShell({ children, id, title, sourceLabel }) {
    return (_jsxs("section", { id: id, className: `section reveal ${styles.sectionShell}`, children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: title }), _jsxs("a", { className: "meta-line", href: `#${id}`, children: ["#", id] })] }), _jsxs("p", { className: "meta-line", children: ["Source: ", _jsx("code", { children: sourceLabel })] }), children] }));
}
