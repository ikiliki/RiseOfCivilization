import { useRef, useEffect } from 'react';
import type { ChatEntry } from '../hooks/useMultiplayer';
import './GameChatPanel.styles.css';

interface GameChatPanelProps {
  messages: ChatEntry[];
  onSend: (text: string) => boolean;
  placeholder?: string;
}

export function GameChatPanel({ messages, onSend, placeholder = 'Type a message...' }: GameChatPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<number | null>(null);
  const statusElRef = useRef<HTMLSpanElement>(null);

  const setInlineStatus = (text: string) => {
    if (!statusElRef.current) return;
    statusElRef.current.textContent = text;
    if (statusRef.current) window.clearTimeout(statusRef.current);
    statusRef.current = window.setTimeout(() => {
      if (statusElRef.current) statusElRef.current.textContent = '';
    }, 2000);
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputRef.current?.value ?? '';
    const text = raw.trim();
    if (text) {
      const sent = onSend(text);
      if (sent) {
        inputRef.current!.value = '';
        setInlineStatus('sent');
      } else {
        setInlineStatus('send failed (socket offline)');
      }
    }
  };

  return (
    <div className="game-chat-panel">
      <div className="game-chat-messages" ref={listRef}>
        {messages.map((m, i) => (
          <div key={`${m.timestamp}-${i}`} className="game-chat-message">
            <span className="game-chat-username">{m.username}:</span>
            <span className="game-chat-text">{m.text}</span>
          </div>
        ))}
      </div>
      <form className="game-chat-input-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="game-chat-input"
          placeholder={placeholder}
          maxLength={500}
          autoComplete="off"
        />
        <button type="submit" className="game-chat-send">
          Send
        </button>
      </form>
      <span ref={statusElRef} className="game-chat-send-status" />
    </div>
  );
}
