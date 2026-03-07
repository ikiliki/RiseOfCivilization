import { useEffect, useRef, useState } from 'react';
import './SocketStatusPanel.styles.css';

export interface SocketLogEntry {
  id: number;
  timestamp: number;
  kind: 'connect' | 'send' | 'receive' | 'error' | 'close';
  message: string;
}

interface SocketStatusPanelProps {
  connected: boolean;
  sentUpdates: number;
  receivedUpdates: number;
  logs: SocketLogEntry[];
}

export function SocketStatusPanel({
  connected,
  sentUpdates,
  receivedUpdates,
  logs
}: SocketStatusPanelProps) {
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 12, y: 12 });
  const dragRef = useRef<{
    active: boolean;
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
  }>({
    active: false,
    startMouseX: 0,
    startMouseY: 0,
    startX: 12,
    startY: 12
  });
  const logRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    if (stickToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs, minimized]);

  const onMouseDownHeader = (event: React.MouseEvent) => {
    dragRef.current = {
      active: true,
      startMouseX: event.clientX,
      startMouseY: event.clientY,
      startX: position.x,
      startY: position.y
    };
    event.preventDefault();
  };

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!dragRef.current.active) return;
      const dx = event.clientX - dragRef.current.startMouseX;
      const dy = event.clientY - dragRef.current.startMouseY;
      setPosition({
        x: Math.max(0, dragRef.current.startX + dx),
        y: Math.max(0, dragRef.current.startY + dy)
      });
    };
    const onUp = () => {
      dragRef.current.active = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <section
      className="socket-panel"
      aria-live="polite"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="socket-panel-header socket-panel-draggable" onMouseDown={onMouseDownHeader}>
        <strong>Socket Status</strong>
        <div className="socket-panel-header-actions">
          <span className={connected ? 'socket-pill socket-pill-on' : 'socket-pill socket-pill-off'}>
            {connected ? 'ON' : 'OFF'}
          </span>
          <button
            type="button"
            className="socket-toggle"
            onClick={() => setMinimized((v) => !v)}
            aria-label={minimized ? 'Expand panel' : 'Minimize panel'}
          >
            {minimized ? '+' : '-'}
          </button>
        </div>
      </div>
      <div className="socket-panel-counters">
        <span>Sent: {sentUpdates}</span>
        <span>Received: {receivedUpdates}</span>
      </div>
      {!minimized && (
        <div
          className="socket-panel-log"
          ref={logRef}
          onScroll={(event) => {
            const el = event.currentTarget;
            stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
          }}
        >
          {logs.length === 0 ? (
            <div className="socket-log-empty">No socket events yet.</div>
          ) : (
            logs.map((entry) => (
              <div key={entry.id} className="socket-log-row">
                <span className={`socket-kind socket-kind-${entry.kind}`}>{entry.kind.toUpperCase()}</span>
                <span className="socket-time">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                <span className="socket-msg">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

