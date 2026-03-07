import { WikiDocument } from '../../components/WikiDocument/WikiDocument';

interface LocalDevSectionProps {
  markdown: string;
  sourceLabel: string;
}

export function LocalDevSection({ markdown, sourceLabel }: LocalDevSectionProps) {
  return (
    <WikiDocument id="local-dev" title="Local Dev" sourceLabel={sourceLabel} markdown={markdown} />
  );
}
