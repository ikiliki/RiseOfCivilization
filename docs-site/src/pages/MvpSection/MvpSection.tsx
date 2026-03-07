import { WikiDocument } from '../../components/WikiDocument/WikiDocument';

interface MvpSectionProps {
  markdown: string;
  sourceLabel: string;
}

export function MvpSection({ markdown, sourceLabel }: MvpSectionProps) {
  return (
    <WikiDocument id="mvp" title="Step 1: MVP" sourceLabel={sourceLabel} markdown={markdown} />
  );
}
