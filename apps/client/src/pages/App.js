import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import { bootstrap, login } from '../api';
import { addRecentPlayer } from '../lib/recentPlayers';
import { clearStoredToken, getStoredToken, setStoredToken } from '../lib/session';
import { getSelectedServer, subscribe } from '../lib/serverStore';
import { LoginPage } from './LoginPage';
import { GamePage } from './GamePage';
function useServerId() {
    const [serverId, setServerId] = useState(() => getSelectedServer().id);
    useEffect(() => {
        const unsub = subscribe(() => setServerId(getSelectedServer().id));
        return unsub;
    }, []);
    return serverId;
}
export function App() {
    const serverId = useServerId();
    const [token, setToken] = useState(() => getStoredToken(serverId));
    const [bootstrapData, setBootstrapData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loginInFlight, setLoginInFlight] = useState(false);
    useEffect(() => {
        setToken(getStoredToken(serverId));
    }, [serverId]);
    const handleLogin = useCallback(async (username) => {
        if (loginInFlight)
            return;
        setLoginInFlight(true);
        setLoading(true);
        setError(null);
        try {
            const loginResult = await login(username);
            const boot = await bootstrap(loginResult.token);
            setStoredToken(loginResult.token, serverId);
            setToken(loginResult.token);
            setBootstrapData(boot);
            addRecentPlayer(username, boot.player.skin?.colorHex ?? '#5b8def', serverId);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to login');
        }
        finally {
            setLoading(false);
            setLoginInFlight(false);
        }
    }, [loginInFlight, serverId]);
    const handleLogout = useCallback(() => {
        clearStoredToken(serverId);
        setToken(null);
        setBootstrapData(null);
        setError(null);
    }, [serverId]);
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        let cancelled = false;
        bootstrap(token)
            .then((boot) => {
            if (!cancelled) {
                setBootstrapData(boot);
            }
        })
            .catch(() => {
            if (!cancelled) {
                clearStoredToken(serverId);
                setToken(null);
            }
        })
            .finally(() => {
            if (!cancelled)
                setLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, [token, serverId]);
    if (!token || !bootstrapData) {
        if (token && loading) {
            return (_jsx("div", { className: "app-restoring", children: _jsx("p", { children: "Restoring session..." }) }));
        }
        return (_jsx(LoginPage, { serverId: serverId, onSubmit: handleLogin, loading: loading, error: error }));
    }
    return (_jsx(GamePage, { token: token, bootstrapData: bootstrapData, onLogout: handleLogout }));
}
