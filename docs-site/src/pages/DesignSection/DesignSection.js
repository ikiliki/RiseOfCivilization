import { jsx as _jsx } from "react/jsx-runtime";
import { WikiDocument } from '../../components/WikiDocument/WikiDocument';
export function DesignSection({ markdown, sourceLabel }) {
    return _jsx(WikiDocument, { id: "design", title: "Design", sourceLabel: sourceLabel, markdown: markdown });
}
