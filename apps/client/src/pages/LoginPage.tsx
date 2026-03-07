import { useState } from 'react';
import type { RecentPlayer } from '@roc/shared-types';
import { BUILD_LABEL } from '../config/version';
import { getRecentPlayers } from '../lib/recentPlayers';
import { ServerSelector } from '../components/ServerSelector';
import './LoginPage.styles.css';

interface LoginPageProps {
  serverId: string;
  onSubmit: (username: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function LoginPage({ serverId, onSubmit, loading, error }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const recentPlayers = getRecentPlayers(serverId);

  const handleSelectPlayer = (p: RecentPlayer) => {
    setUsername(p.username);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 2) {
      void onSubmit(username.trim());
    }
  };

  return (
    <div className="login-page">
      <span className="login-build-version">{BUILD_LABEL}</span>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Rise Of Civilization</h1>
        <p>First playable shared-world MVP</p>

        <ServerSelector />

        <div className="login-recent">
          <label>Recent logins</label>
          <div className="login-recent-cards">
            {recentPlayers.map((p) => (
              <button
                key={p.username}
                type="button"
                className="login-player-card"
                onClick={() => handleSelectPlayer(p)}
                disabled={loading}
              >
                <span
                  className="login-player-skin"
                  style={{ backgroundColor: p.skinColor }}
                />
                <span className="login-player-name">{p.username}</span>
              </button>
            ))}
          </div>
        </div>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          minLength={2}
          maxLength={24}
        />
        <button type="submit" disabled={loading || username.trim().length < 2}>
          {loading ? 'Entering world...' : 'Start'}
        </button>
        {error ? <small>{error}</small> : null}
      </form>
    </div>
  );
}
