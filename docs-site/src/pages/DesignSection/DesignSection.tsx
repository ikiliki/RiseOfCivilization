import { WikiDocument } from '../../components/WikiDocument/WikiDocument';

interface DesignSectionProps {
  markdown: string;
  sourceLabel: string;
}

export function DesignSection({ markdown, sourceLabel }: DesignSectionProps) {
  return <WikiDocument id="design" title="Design" sourceLabel={sourceLabel} markdown={markdown} />;
}
