import styles from './StatusFilters.styles.module.css';

type StatusValue = 'all' | 'new' | 'in_progress' | 'done';

interface StatusFiltersProps {
  phaseFilter: string;
  phaseOptions: string[];
  statusFilter: StatusValue;
  totalCount: number;
  visibleCount: number;
  onPhaseChange: (value: string) => void;
  onStatusChange: (value: StatusValue) => void;
}

const statusOptions: Array<{ label: string; value: StatusValue }> = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' }
];

export function StatusFilters({
  phaseFilter,
  phaseOptions,
  statusFilter,
  totalCount,
  visibleCount,
  onPhaseChange,
  onStatusChange
}: StatusFiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.summary}>
        <span className={styles.heading}>Work Item Filters</span>
        <span className={styles.count}>
          Showing {visibleCount} of {totalCount}
        </span>
      </div>

      <div className={styles.controls}>
        <div className={styles.statusButtons} role="tablist" aria-label="Status filters">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.filterButton} ${
                statusFilter === option.value ? styles.active : ''
              }`}
              type="button"
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className={styles.phaseSelect}>
          <span>Phase</span>
          <select value={phaseFilter} onChange={(event) => onPhaseChange(event.target.value)}>
            <option value="all">All phases</option>
            {phaseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
