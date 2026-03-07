import './StatDisplay.styles.css';

interface StatDisplayProps {
  label: string;
  value: number;
}

export function StatDisplay({ label, value }: StatDisplayProps) {
  return (
    <div className="roc-stat-display">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
