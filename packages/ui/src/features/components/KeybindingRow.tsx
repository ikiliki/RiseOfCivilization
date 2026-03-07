import './KeybindingRow.styles.css';

interface KeybindingRowProps {
  action: string;
  keyValue: string;
  listening?: boolean;
  conflict?: boolean;
  onStartCapture: () => void;
}

export function KeybindingRow({
  action,
  keyValue,
  listening = false,
  conflict = false,
  onStartCapture
}: KeybindingRowProps) {
  const label = action
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

  return (
    <div className={`roc-keybind-row ${conflict ? 'roc-keybind-row--conflict' : ''}`}>
      <span>{label}</span>
      <button onClick={onStartCapture} type="button">
        {listening ? 'Press key...' : keyValue}
      </button>
      {conflict ? <small>Duplicate key</small> : null}
    </div>
  );
}
