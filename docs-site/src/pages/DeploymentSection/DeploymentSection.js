import { jsx as _jsx } from "react/jsx-runtime";
import { WikiDocument } from '../../components/WikiDocument/WikiDocument';
export function DeploymentSection({ markdown, sourceLabel }) {
    return (_jsx(WikiDocument, { id: "deployment", title: "Deployment", sourceLabel: sourceLabel, markdown: markdown }));
}
