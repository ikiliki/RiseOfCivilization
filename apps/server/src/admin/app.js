const summaryEl = document.getElementById('summary');
const statusEl = document.getElementById('status');
const tbodyEl = document.getElementById('tbody');
const tableEl = document.getElementById('table');
const emptyEl = document.getElementById('empty');
const refreshBtn = document.getElementById('refreshBtn');
const realmInput = document.getElementById('realmInput');

const POLL_MS = 1000;
let timer = null;
let currentRealm = 'default';

function fmtNumber(n) {
  return Number.isFinite(n) ? n.toFixed(2) : '-';
}

function fmtTime(ts) {
  if (!ts) return '-';
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? '#ff7d7d' : '#4bd37b';
}

function render(data) {
  const { serverId, realm, onlineCount, players, generatedAt } = data;
  currentRealm = realm || 'default';
  summaryEl.textContent = `Server: ${serverId} | Realm: ${realm} | Online: ${onlineCount} | Updated: ${fmtTime(generatedAt)}`;

  if (!players || players.length === 0) {
    tableEl.style.display = 'none';
    emptyEl.style.display = 'block';
    tbodyEl.innerHTML = '';
    return;
  }

  emptyEl.style.display = 'none';
  tableEl.style.display = 'table';

  const rows = players
    .slice()
    .sort((a, b) => (a.username || '').localeCompare(b.username || ''))
    .map((p) => {
      const pos = p.position || {};
      const dir = p.direction || {};
      return `
        <tr>
          <td>${p.username || '-'}</td>
          <td>${p.userId || '-'}</td>
          <td>${fmtNumber(pos.x)}</td>
          <td>${fmtNumber(pos.z)}</td>
          <td>${fmtNumber(dir.x)}</td>
          <td>${fmtNumber(dir.z)}</td>
          <td>${fmtTime(p.lastUpdatedAt)}</td>
          <td><button data-kick-user-id="${p.userId || ''}">Remove</button></td>
        </tr>
      `;
    })
    .join('');

  tbodyEl.innerHTML = rows;
  tbodyEl.querySelectorAll('button[data-kick-user-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const userId = btn.getAttribute('data-kick-user-id');
      if (!userId) return;
      const ok = window.confirm(`Remove user ${userId}?`);
      if (!ok) return;
      btn.disabled = true;
      try {
        const res = await fetch('/api/admin/remove-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, realm: currentRealm })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setStatus(`Removed ${userId}`);
        await fetchLiveUsers();
      } catch (err) {
        setStatus(`Remove failed: ${String(err)}`, true);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

async function fetchLiveUsers() {
  const realm = (realmInput.value || 'default').trim() || 'default';
  try {
    const res = await fetch(`/api/admin/live-users?realm=${encodeURIComponent(realm)}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    render(data);
    setStatus(`Polling every ${POLL_MS / 1000}s`);
  } catch (err) {
    setStatus(`Error: ${String(err)}`, true);
  }
}

function startPolling() {
  if (timer) clearInterval(timer);
  timer = setInterval(fetchLiveUsers, POLL_MS);
}

refreshBtn.addEventListener('click', fetchLiveUsers);
realmInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchLiveUsers();
});

fetchLiveUsers();
startPolling();
