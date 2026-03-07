import { WikiDocument } from '../../components/WikiDocument/WikiDocument';

interface ArchitectureSectionProps {
  markdown: string;
  sourceLabel: string;
}

export function ArchitectureSection({
  markdown,
  sourceLabel
}: ArchitectureSectionProps) {
  return (
    <WikiDocument
      id="architecture"
      title="Architecture"
      sourceLabel={sourceLabel}
      markdown={markdown}
    />
  );
}
