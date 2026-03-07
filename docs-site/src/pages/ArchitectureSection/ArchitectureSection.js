import { jsx as _jsx } from "react/jsx-runtime";
import { WikiDocument } from '../../components/WikiDocument/WikiDocument';
export function ArchitectureSection({ markdown, sourceLabel }) {
    return (_jsx(WikiDocument, { id: "architecture", title: "Architecture", sourceLabel: sourceLabel, markdown: markdown }));
}
