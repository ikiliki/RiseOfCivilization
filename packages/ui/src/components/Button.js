import { jsx as _jsx } from "react/jsx-runtime";
import './Button.styles.css';
export function Button({ children, className = '', ...rest }) {
    return (_jsx("button", { className: `roc-button ${className}`.trim(), ...rest, children: children }));
}
