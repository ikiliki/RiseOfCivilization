import { jsx as _jsx } from "react/jsx-runtime";
import { WikiDocument } from '../../components/WikiDocument/WikiDocument';
export function MvpSection({ markdown, sourceLabel }) {
    return (_jsx(WikiDocument, { id: "mvp", title: "Step 1: MVP", sourceLabel: sourceLabel, markdown: markdown }));
}
