import { useState } from 'react';
import type { PlanTask } from '../../types/content';
import styles from './TaskCard.styles.module.css';

interface TaskCardProps {
  task: PlanTask;
}

function formatTaskForAgent(task: PlanTask): string {
  const subLines =
    task.subTasks && task.subTasks.length > 0
      ? `\n${task.subTasks.map((subTask) => `  - ${subTask}`).join('\n')}`
      : '';

  return `${task.title}${subLines}`;
}

export function TaskCard({ task }: TaskCardProps) {
  const [copyLabel, setCopyLabel] = useState('Copy for Agent');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatTaskForAgent(task));
      setCopyLabel('Copied');
      window.setTimeout(() => setCopyLabel('Copy for Agent'), 1200);
    } catch {
      setCopyLabel('Copy failed');
      window.setTimeout(() => setCopyLabel('Copy for Agent'), 1200);
    }
  }

  return (
    <article className="task-card">
      <div className="task-header">
        <strong className="task-title">{task.title}</strong>
        <button className="copy-for-agent-btn" type="button" onClick={handleCopy}>
          {copyLabel}
        </button>
      </div>

      {task.subTasks && task.subTasks.length > 0 ? (
        <details className={`task-sub ${styles.taskSub}`} open>
          <summary>
            {task.subTasks.length} sub-task{task.subTasks.length === 1 ? '' : 's'}
          </summary>
          <ul className="sub-task-list">
            {task.subTasks.map((subTask) => (
              <li key={subTask}>{subTask}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </article>
  );
}
