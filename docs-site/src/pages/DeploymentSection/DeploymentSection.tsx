import { WikiDocument } from '../../components/WikiDocument/WikiDocument';

interface DeploymentSectionProps {
  markdown: string;
  sourceLabel: string;
}

export function DeploymentSection({
  markdown,
  sourceLabel
}: DeploymentSectionProps) {
  return (
    <WikiDocument
      id="deployment"
      title="Deployment"
      sourceLabel={sourceLabel}
      markdown={markdown}
    />
  );
}
