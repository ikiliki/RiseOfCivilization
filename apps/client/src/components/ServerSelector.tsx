import { useEffect, useState } from 'react';
import { useSyncExternalStore } from 'react';
import { getServerInfo } from '../api';
import { SERVERS } from '../config/servers';
import { getSelectedServer, setSelectedServer, subscribe } from '../lib/serverStore';
import './ServerSelector.styles.css';

function getSnapshot() {
  return getSelectedServer().id;
}

type ServerStatus = 'online' | 'offline' | 'unknown';

export function ServerSelector() {
  const selectedId = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, ServerStatus>>({});

  const fetchServerData = async () => {
    const names: Record<string, string> = {};
    const statuses: Record<string, ServerStatus> = {};
    await Promise.all(
      SERVERS.map(async (s) => {
        try {
          const info = await getServerInfo(s.url);
          names[s.id] = info.displayName;
          statuses[s.id] = 'online';
        } catch {
          names[s.id] = s.id;
          statuses[s.id] = 'offline';
        }
      })
    );
    setDisplayNames((prev) => ({ ...prev, ...names }));
    setStatuses((prev) => ({ ...prev, ...statuses }));
  };

  useEffect(() => {
    void fetchServerData();
    const interval = setInterval(fetchServerData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedServer(e.target.value);
  };

  const selectedStatus = statuses[selectedId] ?? 'unknown';

  return (
    <div className="server-selector">
      <label htmlFor="server-select">Server</label>
      <div className="server-selector-row">
        <select
          id="server-select"
          className="server-select"
          value={selectedId}
          onChange={handleChange}
        >
          {SERVERS.map((s) => (
            <option key={s.id} value={s.id}>
              {displayNames[s.id] ?? s.id} · {(statuses[s.id] ?? 'unknown') === 'online' ? 'Online' : 'Offline'}
            </option>
          ))}
        </select>
        <span className={`server-status server-status--${selectedStatus}`}>
          {selectedStatus === 'online' ? 'Online' : selectedStatus === 'offline' ? 'Offline' : '…'}
        </span>
      </div>
    </div>
  );
}
