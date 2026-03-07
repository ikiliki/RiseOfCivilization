import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SocketStatusPanel, type SocketLogEntry } from './SocketStatusPanel';

const meta: Meta<typeof SocketStatusPanel> = {
  title: 'Features/SocketStatusPanel',
  component: SocketStatusPanel,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;
type Story = StoryObj<typeof SocketStatusPanel>;

function DemoPanel({ connected = true }: { connected?: boolean }) {
  const [logs, setLogs] = useState<SocketLogEntry[]>([
    { id: 1, timestamp: Date.now() - 5000, kind: 'connect', message: 'socket open' },
    { id: 2, timestamp: Date.now() - 4000, kind: 'receive', message: 'presence_update players=2' },
    { id: 3, timestamp: Date.now() - 3000, kind: 'send', message: 'position_update x=10.0 z=22.0' }
  ]);
  const [sent, setSent] = useState(8);
  const [received, setReceived] = useState(12);

  useEffect(() => {
    let id = 4;
    const timer = setInterval(() => {
      id += 1;
      const even = id % 2 === 0;
      setLogs((prev) =>
        [
          ...prev,
          {
            id,
            timestamp: Date.now(),
            kind: even ? ('send' as const) : ('receive' as const),
            message: even
              ? `position_update x=${(10 + id / 10).toFixed(1)} z=${(20 + id / 12).toFixed(1)}`
              : 'presence_update players=2'
          }
        ].slice(-120)
      );
      if (even) setSent((n) => n + 1);
      else setReceived((n) => n + 1);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0a1222' }}>
      <SocketStatusPanel connected={connected} sentUpdates={sent} receivedUpdates={received} logs={logs} />
    </div>
  );
}

export const ConnectedInteractive: Story = {
  render: () => <DemoPanel connected />
};

export const OfflineInteractive: Story = {
  render: () => <DemoPanel connected={false} />
};

