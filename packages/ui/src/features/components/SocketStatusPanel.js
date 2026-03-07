import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import './SocketStatusPanel.styles.css';
export function SocketStatusPanel({ connected, sentUpdates, receivedUpdates, logs }) {
    const [minimized, setMinimized] = useState(false);
    const [position, setPosition] = useState({ x: 12, y: 12 });
    const dragRef = useRef({
        active: false,
        startMouseX: 0,
        startMouseY: 0,
        startX: 12,
        startY: 12
    });
    const logRef = useRef(null);
    const stickToBottomRef = useRef(true);
    useEffect(() => {
        const el = logRef.current;
        if (!el)
            return;
        if (stickToBottomRef.current) {
            el.scrollTop = el.scrollHeight;
        }
    }, [logs, minimized]);
    const onMouseDownHeader = (event) => {
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
        const onMove = (event) => {
            if (!dragRef.current.active)
                return;
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
    return (_jsxs("section", { className: "socket-panel", "aria-live": "polite", style: { left: `${position.x}px`, top: `${position.y}px` }, children: [_jsxs("div", { className: "socket-panel-header socket-panel-draggable", onMouseDown: onMouseDownHeader, children: [_jsx("strong", { children: "Socket Status" }), _jsxs("div", { className: "socket-panel-header-actions", children: [_jsx("span", { className: connected ? 'socket-pill socket-pill-on' : 'socket-pill socket-pill-off', children: connected ? 'ON' : 'OFF' }), _jsx("button", { type: "button", className: "socket-toggle", onClick: () => setMinimized((v) => !v), "aria-label": minimized ? 'Expand panel' : 'Minimize panel', children: minimized ? '+' : '-' })] })] }), _jsxs("div", { className: "socket-panel-counters", children: [_jsxs("span", { children: ["Sent: ", sentUpdates] }), _jsxs("span", { children: ["Received: ", receivedUpdates] })] }), !minimized && (_jsx("div", { className: "socket-panel-log", ref: logRef, onScroll: (event) => {
                    const el = event.currentTarget;
                    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
                }, children: logs.length === 0 ? (_jsx("div", { className: "socket-log-empty", children: "No socket events yet." })) : (logs.map((entry) => (_jsxs("div", { className: "socket-log-row", children: [_jsx("span", { className: `socket-kind socket-kind-${entry.kind}`, children: entry.kind.toUpperCase() }), _jsx("span", { className: "socket-time", children: new Date(entry.timestamp).toLocaleTimeString() }), _jsx("span", { className: "socket-msg", children: entry.message })] }, entry.id)))) }))] }));
}
