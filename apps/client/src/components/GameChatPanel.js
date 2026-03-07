import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import './GameChatPanel.styles.css';
export function GameChatPanel({ messages, onSend, placeholder = 'Type a message...' }) {
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const statusRef = useRef(null);
    const statusElRef = useRef(null);
    const setInlineStatus = (text) => {
        if (!statusElRef.current)
            return;
        statusElRef.current.textContent = text;
        if (statusRef.current)
            window.clearTimeout(statusRef.current);
        statusRef.current = window.setTimeout(() => {
            if (statusElRef.current)
                statusElRef.current.textContent = '';
        }, 2000);
    };
    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const raw = inputRef.current?.value ?? '';
        const text = raw.trim();
        if (text) {
            const sent = onSend(text);
            if (sent) {
                inputRef.current.value = '';
                setInlineStatus('sent');
            }
            else {
                setInlineStatus('send failed (socket offline)');
            }
        }
    };
    return (_jsxs("div", { className: "game-chat-panel", children: [_jsx("div", { className: "game-chat-messages", ref: listRef, children: messages.map((m, i) => (_jsxs("div", { className: "game-chat-message", children: [_jsxs("span", { className: "game-chat-username", children: [m.username, ":"] }), _jsx("span", { className: "game-chat-text", children: m.text })] }, `${m.timestamp}-${i}`))) }), _jsxs("form", { className: "game-chat-input-form", onSubmit: handleSubmit, children: [_jsx("input", { ref: inputRef, type: "text", className: "game-chat-input", placeholder: placeholder, maxLength: 500, autoComplete: "off" }), _jsx("button", { type: "submit", className: "game-chat-send", children: "Send" })] }), _jsx("span", { ref: statusElRef, className: "game-chat-send-status" })] }));
}
