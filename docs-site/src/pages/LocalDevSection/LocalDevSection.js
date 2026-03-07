import { jsx as _jsx } from "react/jsx-runtime";
import { WikiDocument } from '../../components/WikiDocument/WikiDocument';
export function LocalDevSection({ markdown, sourceLabel }) {
    return (_jsx(WikiDocument, { id: "local-dev", title: "Local Dev", sourceLabel: sourceLabel, markdown: markdown }));
}
