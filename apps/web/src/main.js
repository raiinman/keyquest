import './styles.css';
import { api } from '@appdeploy/client';
import { BOARD, EDGES, GameEngine, MATCH_SEED } from './game.js';

const engine = new GameEngine();
const app = document.querySelector('#app');
let activeView = 'alpha';
let botTimer = null;

window.__KQ_ALPHA__ = {
  engine,
  getState: () => engine.snapshot(),
  exportLog: () => engine.exportLog(),
};

function esc(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function nav() {
  return `<header class="topbar">
    <div><p class="eyebrow">KEY QUEST // RESTORATION</p><h1>Local Match Alpha</h1></div>
    <nav aria-label="Project modes">
      <button class="nav-button ${activeView === 'alpha' ? 'active' : ''}" data-view="alpha">Modern Alpha</button>
      <button class="nav-button ${activeView === 'preservation' ? 'active' : ''}" data-view="preservation">Preservation</button>
    </nav>
    <div class="safety"><span></span> MOCK DATA · PRODUCTION WRITES OFF</div>
  </header>`;
}

function lobby() {
  return `<main class="lobby-shell">
    <section class="lobby-card">
      <div class="crest">KQ</div>
      <p class="eyebrow gold">DETERMINISTIC SCENARIO ${MATCH_SEED}</p>
      <h2>Open the gates</h2>
      <p class="lede">One complete local Key Quest match: lobby, dice, branching paths, keys, spaces, exit, results, and a mock Vault reward.</p>
      <form id="lobby-form">
        <label>Local identity<input id="player-name" maxlength="24" value="Guest Adventurer" autocomplete="off"></label>
        <label>Players<select id="player-count"><option value="2">2 · You + 1 bot</option><option value="3">3 · You + 2 bots</option><option value="4" selected>4 · You + 3 bots</option></select></label>
        <fieldset><legend>Your token</legend><div class="token-picker">
          ${['🧭', '⚙️', '🪶', '🔮'].map((token, index) => `<label class="token-option"><input type="radio" name="token" value="${token}" ${index === 0 ? 'checked' : ''}><span>${token}</span></label>`).join('')}
        </div></fieldset>
        <button class="primary huge" id="start-match" type="submit">Start local match</button>
      </form>
      <p class="fineprint">No Neopets login. No live Neopoints. No inventory or prize writes. This alpha never contacts Neopets account systems.</p>
    </section>
    <aside class="briefing"><h3>Alpha rules</h3><ol><li>Collect the Red, Blue, and Gold keys.</li><li>Choose a route when the board forks.</li><li>Return to the Exit with all three keys.</li><li>The Vault result is simulated locally.</li></ol><div class="seed-card"><span>Replay seed</span><strong>${MATCH_SEED}</strong></div></aside>
  </main>`;
}

function boardSvg(state) {
  const lines = EDGES.map(([from, to]) => `<line x1="${BOARD[from].x}" y1="${BOARD[from].y}" x2="${BOARD[to].x}" y2="${BOARD[to].y}" />`).join('');
  const nodes = Object.entries(BOARD).map(([id, node]) => {
    const tokens = state.players.filter((player) => player.position === id).map((player, index) => `<text class="token-on-board" x="${node.x - 18 + index * 14}" y="${node.y - 31}">${player.token}</text>`).join('');
    return `<g class="node node-${node.type}" data-node="${id}"><circle cx="${node.x}" cy="${node.y}" r="27"></circle><text x="${node.x}" y="${node.y + 4}">${esc(node.label)}</text>${tokens}</g>`;
  }).join('');
  return `<svg class="board" viewBox="0 0 800 535" role="img" aria-label="Key Quest alpha board"><g class="paths">${lines}</g>${nodes}<text class="board-title" x="400" y="300">CLOCKWORK CROSSROADS</text><text class="board-subtitle" x="400" y="326">THREE KEYS OPEN THE GATE</text></svg>`;
}

function playerCard(player, current) {
  const keys = ['Red', 'Blue', 'Gold'].map((key) => `<span class="key-chip ${player.keys.includes(key) ? `has ${key.toLowerCase()}` : ''}" title="${key} key">◆</span>`).join('');
  return `<article class="player-card ${current ? 'current' : ''}"><div class="player-token">${player.token}</div><div><strong>${esc(player.name)}</strong><small>${player.kind === 'human' ? 'LOCAL PLAYER' : 'BOT'}</small></div><div class="keys">${keys}</div><b>${player.points} pts</b></article>`;
}

function match(state) {
  const current = state.players[state.currentPlayer];
  const humanTurn = current?.kind === 'human';
  const controls = state.phase === 'path'
    ? `<div class="choice-box"><strong>Choose your route</strong><div><button class="route sunny" data-route="sunny">Sunlit path</button><button class="route shadow" data-route="shadow">Shadow path</button></div></div>`
    : `<button class="roll-button" id="roll" ${!humanTurn || state.phase !== 'turn' ? 'disabled' : ''}><span class="die">${state.lastRoll || '⚄'}</span>${humanTurn ? 'Roll dice' : `${esc(current.name)} is moving…`}</button>`;
  return `<main class="game-shell">
    <section class="board-panel"><div class="board-header"><div><span>ROUND</span><strong>${state.round}</strong></div><div><span>SEED</span><strong>${state.seed}</strong></div><div><span>LAST ROLL</span><strong>${state.lastRoll || '—'}</strong></div></div>${boardSvg(state)}</section>
    <aside class="game-rail"><section><p class="eyebrow gold">TURN CONTROL</p><h2>${esc(current.name)}</h2>${controls}</section>
      <section class="roster">${state.players.map((player, index) => playerCard(player, index === state.currentPlayer)).join('')}</section>
      <section class="event-log"><div class="log-head"><h3>Deterministic log</h3><button id="copy-log" class="text-button">Copy</button></div><ol>${state.logs.slice(-9).reverse().map((entry) => `<li><span>${String(entry.seq).padStart(3, '0')}</span>${esc(entry.message)}</li>`).join('')}</ol></section>
    </aside>
  </main>`;
}

function results(state) {
  const winner = state.players.find((player) => player.id === state.result.winnerId);
  const reward = state.result.reward;
  return `<main class="results-shell"><section class="results-card"><p class="eyebrow gold">MATCH COMPLETE · EVENT ${String(state.sequence).padStart(3, '0')}</p><div class="vault-key">◆</div><h2>${esc(winner.name)} unlocked the gate</h2><p class="lede">The deterministic local match reached its real results state.</p><div class="reward-grid"><article><span>Vault key</span><strong>${reward.keyTier}</strong></article><article><span>Local points</span><strong>${reward.localPoints}</strong></article><article><span>Mock prize</span><strong>${reward.item}</strong></article></div><div class="hard-stop"><b>PRODUCTION WRITE: DISABLED</b><span>Reward exists only in this browser session. Nothing was sent to Neopets.</span></div><div class="result-actions"><button id="play-again" class="primary">Replay ${state.seed}</button><button id="copy-log" class="secondary">Copy match log</button></div></section><aside class="standings"><h3>Final standings</h3>${state.result.placements.map((id, index) => { const p = state.players.find((player) => player.id === id); return `<div><b>${index + 1}</b><span>${p.token} ${esc(p.name)}</span><small>${p.keys.length} keys · ${p.points} pts</small></div>`; }).join('')}</aside></main>`;
}

function preservation() {
  return `<main class="preservation-shell"><section class="preservation-card"><p class="eyebrow gold">MILESTONE 0 · RETAINED</p><h2>Original client proof-of-life</h2><p>The surviving bootstrap SWF can still be fetched read-only and executed through Ruffle. It remains a forensic lane, not the playable alpha.</p><div class="preserve-actions"><button id="boot-original" class="secondary">Boot historical client</button><button id="verify-original" class="secondary">Verify source</button></div><pre id="preservation-status">Idle. No request made.</pre><div id="ruffle-wrap"><span>Historical client renders here after boot.</span></div></section><aside class="safety-panel"><h3>Hard boundary</h3><p>Only the public bootstrap SWF is fetched. No passwords, cookies, inventory writes, prize redemption, or authenticated production traffic.</p><button class="text-button" data-view="alpha">Return to playable alpha →</button></aside></main>`;
}

function render() {
  clearTimeout(botTimer);
  const state = engine.snapshot();
  let content = preservation();
  if (activeView === 'alpha') {
    content = state.phase === 'lobby' ? lobby() : state.phase === 'results' ? results(state) : match(state);
  }
  app.innerHTML = nav() + content;
  bind();
  scheduleBot();
}

function bind() {
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => { activeView = button.dataset.view; render(); }));
  document.querySelector('#lobby-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const token = document.querySelector('input[name="token"]:checked')?.value || '🧭';
    engine.startMatch({ playerName: document.querySelector('#player-name').value, playerCount: document.querySelector('#player-count').value, token });
    render();
  });
  document.querySelector('#roll')?.addEventListener('click', () => { engine.roll(); render(); });
  document.querySelectorAll('[data-route]').forEach((button) => button.addEventListener('click', () => { engine.choosePath(button.dataset.route); render(); }));
  document.querySelector('#play-again')?.addEventListener('click', () => { engine.reset(); render(); });
  document.querySelector('#copy-log')?.addEventListener('click', async () => { await navigator.clipboard.writeText(engine.exportLog()); });
  document.querySelector('#verify-original')?.addEventListener('click', verifyOriginal);
  document.querySelector('#boot-original')?.addEventListener('click', bootOriginal);
}

function scheduleBot() {
  const state = engine.snapshot();
  if (activeView !== 'alpha' || state.phase === 'lobby' || state.phase === 'results') return;
  const current = state.players[state.currentPlayer];
  if (current?.kind === 'bot' && state.phase === 'turn') {
    botTimer = setTimeout(() => { engine.roll(); render(); }, 260);
  }
}

async function fetchOriginal() {
  const response = await api.get('/api/client');
  return response.data;
}

async function verifyOriginal() {
  const status = document.querySelector('#preservation-status');
  status.textContent = 'Verifying public source…';
  try {
    const data = await fetchOriginal();
    status.textContent = `SURVIVES\n${data.sourceUrl}\n${data.contentType}\n${data.bytes.toLocaleString()} bytes`;
  } catch (error) { status.textContent = String(error); }
}

async function bootOriginal() {
  const status = document.querySelector('#preservation-status');
  const wrap = document.querySelector('#ruffle-wrap');
  status.textContent = 'Fetching read-only bootstrap…';
  try {
    const payload = await fetchOriginal();
    const source = window.RufflePlayer?.newest();
    if (!source) throw new Error('Ruffle did not initialize.');
    const binary = atob(payload.base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    const player = source.createPlayer();
    wrap.replaceChildren(player);
    await player.ruffle().load({ data: bytes.buffer, swfFileName: 'KeyQuest.swf', base: 'https://images.neopets.com/keyquest/game/kq2/', allowNetworking: 'all', allowScriptAccess: false, compatibilityRules: true, upgradeToHttps: true });
    status.textContent = `ORIGINAL CLIENT RUNNING\n${payload.bytes.toLocaleString()} bytes\nLegacy backend remains intentionally disconnected.`;
  } catch (error) { status.textContent = `BOOT FAILED\n${String(error)}`; }
}

render();
