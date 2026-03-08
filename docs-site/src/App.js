import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { loadPortalContent } from './lib/content';
import { AppLayout } from './pages/AppLayout/AppLayout';
export function App() {
    const content = loadPortalContent();
    const [scrollProgress, setScrollProgress] = useState(0);
    useEffect(() => {
        function handleScroll() {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - doc.clientHeight;
            if (scrollable <= 0) {
                setScrollProgress(0);
                return;
            }
            setScrollProgress((doc.scrollTop / scrollable) * 100);
        }
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);
    if (!content || !content.sources) {
        return (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-layer", "aria-hidden": "true" }), _jsx("header", { className: "topbar", children: _jsxs("div", { className: "brand", children: [_jsx("span", { className: "brand-mark", children: "ROC" }), _jsxs("div", { children: [_jsx("h1", { children: "Rise Of Civilization" }), _jsx("p", { children: "Internal Documentation Portal" })] })] }) }), _jsx("main", { className: "content", children: _jsxs("section", { className: "section in", children: [_jsx("h2", { children: "Content Not Generated Yet" }), _jsxs("p", { children: ["Run ", _jsx("code", { children: "pnpm docs:sync" }), " from the repository root, then refresh this page."] })] }) })] }));
    }
    const currentFeature = content.overview?.currentFeature ??
        content.overview?.currentPhase ??
        content.planStatus?.feature ??
        content.planStatus?.phase ??
        'Unknown';
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-layer", "aria-hidden": "true" }), _jsxs("header", { className: "topbar", children: [_jsxs("div", { className: "brand", children: [_jsx("span", { className: "brand-mark", children: "ROC" }), _jsxs("div", { children: [_jsx("h1", { children: "Rise Of Civilization" }), _jsx("p", { children: "Internal Documentation Portal" })] })] }), _jsxs("div", { className: "topbar-meta", children: [_jsx("span", { className: "badge", children: "Internal" }), _jsx("span", { className: "badge", children: currentFeature })] }), _jsx("div", { className: "scroll-progress", children: _jsx("span", { id: "scroll-progress-bar", style: { width: `${scrollProgress}%` } }) })] }), _jsx("div", { className: "content", children: _jsx(AppLayout, { content: content }) })] }));
}
