import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useSyncExternalStore } from 'react';
import { getServerInfo } from '../api';
import { SERVERS } from '../config/servers';
import { getSelectedServer, setSelectedServer, subscribe } from '../lib/serverStore';
import './ServerSelector.styles.css';
function getSnapshot() {
    return getSelectedServer().id;
}
export function ServerSelector() {
    const selectedId = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    const [displayNames, setDisplayNames] = useState({});
    const [statuses, setStatuses] = useState({});
    const fetchServerData = async () => {
        const names = {};
        const statuses = {};
        await Promise.all(SERVERS.map(async (s) => {
            try {
                const info = await getServerInfo(s.url);
                names[s.id] = info.displayName;
                statuses[s.id] = 'online';
            }
            catch {
                names[s.id] = s.id;
                statuses[s.id] = 'offline';
            }
        }));
        setDisplayNames((prev) => ({ ...prev, ...names }));
        setStatuses((prev) => ({ ...prev, ...statuses }));
    };
    useEffect(() => {
        void fetchServerData();
        const interval = setInterval(fetchServerData, 5000);
        return () => clearInterval(interval);
    }, []);
    const handleChange = (e) => {
        setSelectedServer(e.target.value);
    };
    const selectedStatus = statuses[selectedId] ?? 'unknown';
    return (_jsxs("div", { className: "server-selector", children: [_jsx("label", { htmlFor: "server-select", children: "Server" }), _jsxs("div", { className: "server-selector-row", children: [_jsx("select", { id: "server-select", className: "server-select", value: selectedId, onChange: handleChange, children: SERVERS.map((s) => (_jsxs("option", { value: s.id, children: [displayNames[s.id] ?? s.id, " \u00B7 ", (statuses[s.id] ?? 'unknown') === 'online' ? 'Online' : 'Offline'] }, s.id))) }), _jsx("span", { className: `server-status server-status--${selectedStatus}`, children: selectedStatus === 'online' ? 'Online' : selectedStatus === 'offline' ? 'Offline' : '…' })] })] }));
}
