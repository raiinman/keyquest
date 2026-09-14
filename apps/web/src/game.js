export const MATCH_SEED = 'KQ-ALPHA-001';

export const BOARD = {
  '0': { x: 400, y: 474, label: 'EXIT', type: 'exit' },
  '1': { x: 286, y: 448, label: '+20', type: 'points' },
  '2': { x: 190, y: 392, label: '?', type: 'event' },
  '3': { x: 120, y: 300, label: 'RED', type: 'key', key: 'Red' },
  '4': { x: 150, y: 190, label: 'FORK', type: 'fork' },
  '5': { x: 250, y: 112, label: '+20', type: 'points' },
  '6': { x: 365, y: 84, label: 'PWR', type: 'power' },
  '7': { x: 478, y: 112, label: '?', type: 'event' },
  '8': { x: 570, y: 182, label: 'BLUE', type: 'key', key: 'Blue' },
  '9': { x: 662, y: 245, label: 'PORTAL', type: 'portal' },
  '10': { x: 690, y: 344, label: '+20', type: 'points' },
  '11': { x: 620, y: 426, label: '?', type: 'event' },
  '12': { x: 510, y: 460, label: 'PWR', type: 'power' },
  '13': { x: 390, y: 424, label: 'GOLD', type: 'key', key: 'Gold' },
  '14': { x: 292, y: 365, label: '+20', type: 'points' },
  '15': { x: 250, y: 282, label: 'PWR', type: 'power' },
  'b1': { x: 250, y: 205, label: 'PWR', type: 'power' },
  'b2': { x: 360, y: 232, label: '+20', type: 'points' },
  'b3': { x: 470, y: 205, label: '?', type: 'event' },
};

export const EDGES = [
  ['0', '1'], ['1', '2'], ['2', '3'], ['3', '4'],
  ['4', '5'], ['5', '6'], ['6', '7'], ['7', '8'],
  ['4', 'b1'], ['b1', 'b2'], ['b2', 'b3'], ['b3', '8'],
  ['8', '9'], ['9', '10'], ['10', '11'], ['11', '12'],
  ['12', '13'], ['13', '14'], ['14', '15'], ['15', '0'],
];

const DICE = {
  human: [3, 5, 5, 3, 4, 2],
  bot1: [2, 4, 6, 1, 3, 5],
  bot2: [4, 2, 3, 6, 1, 5],
  bot3: [1, 6, 2, 4, 5, 3],
};

const TOKENS = ['🧭', '⚙️', '🪶', '🔮'];

function nextNode(position, route) {
  if (position === '4') return route === 'shadow' ? 'b1' : '5';
  const next = {
    '0': '1', '1': '2', '2': '3', '3': '4',
    '5': '6', '6': '7', '7': '8',
    'b1': 'b2', 'b2': 'b3', 'b3': '8',
    '8': '9', '9': '10', '10': '11', '11': '12',
    '12': '13', '13': '14', '14': '15', '15': '0',
  };
  return next[position];
}

export class GameEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.state = {
      seed: MATCH_SEED,
      phase: 'lobby',
      players: [],
      currentPlayer: 0,
      round: 1,
      pendingSteps: 0,
      lastRoll: null,
      routeChoice: null,
      result: null,
      logs: [],
      sequence: 0,
    };
  }

  log(type, message, data = {}) {
    this.state.sequence += 1;
    this.state.logs.push({ seq: this.state.sequence, type, message, ...data });
  }

  startMatch({ playerName = 'Guest Adventurer', playerCount = 4, token = TOKENS[0] } = {}) {
    const count = Math.max(2, Math.min(4, Number(playerCount) || 4));
    const botNames = ['Clockwork Bruce', 'Lantern Aisha', 'Compass Kacheek'];
    this.reset();
    this.state.players = [
      { id: 'human', name: playerName.trim() || 'Guest Adventurer', kind: 'human', token, position: '0', keys: [], points: 0, powerups: [], rolls: 0 },
      ...botNames.slice(0, count - 1).map((name, index) => ({
        id: `bot${index + 1}`, name, kind: 'bot', token: TOKENS[index + 1], position: '0', keys: [], points: 0, powerups: [], rolls: 0,
      })),
    ];
    this.state.phase = 'turn';
    this.log('match.start', `Local match started with seed ${MATCH_SEED}.`, { playerCount: count });
    this.log('turn.start', `${this.current.name}'s turn.`, { playerId: this.current.id, round: 1 });
    return this.snapshot();
  }

  get current() {
    return this.state.players[this.state.currentPlayer];
  }

  roll() {
    if (this.state.phase !== 'turn') throw new Error('A roll is not valid in the current phase.');
    const player = this.current;
    const table = DICE[player.id] || DICE.bot1;
    const value = table[player.rolls % table.length];
    player.rolls += 1;
    this.state.lastRoll = value;
    this.state.pendingSteps = value;
    this.state.routeChoice = null;
    this.log('dice.roll', `${player.name} rolled ${value}.`, { playerId: player.id, value });
    return this.continueMovement();
  }

  choosePath(route) {
    if (this.state.phase !== 'path' || !['sunny', 'shadow'].includes(route)) {
      throw new Error('No path choice is pending.');
    }
    this.state.routeChoice = route;
    this.state.phase = 'moving';
    this.log('path.choose', `${this.current.name} chose the ${route} route.`, { playerId: this.current.id, route });
    return this.continueMovement();
  }

  continueMovement() {
    const player = this.current;
    this.state.phase = 'moving';
    while (this.state.pendingSteps > 0) {
      if (player.position === '4' && !this.state.routeChoice) {
        if (player.kind === 'bot') {
          this.state.routeChoice = (player.rolls + this.state.round) % 2 ? 'sunny' : 'shadow';
          this.log('path.choose', `${player.name} chose the ${this.state.routeChoice} route.`, { playerId: player.id, route: this.state.routeChoice });
        } else {
          this.state.phase = 'path';
          this.log('path.await', `${player.name} must choose a route.`, { playerId: player.id });
          return this.snapshot();
        }
      }
      const destination = nextNode(player.position, this.state.routeChoice);
      if (!destination) throw new Error(`No board edge from ${player.position}.`);
      player.position = destination;
      this.state.pendingSteps -= 1;
      this.log('move.step', `${player.name} moved to ${destination}.`, { playerId: player.id, position: destination });
    }
    this.resolveSpace(player);
    if (this.state.phase !== 'results') this.advanceTurn();
    return this.snapshot();
  }

  resolveSpace(player) {
    const space = BOARD[player.position];
    if (!space) return;
    if (space.type === 'key') {
      if (!player.keys.includes(space.key)) {
        player.keys.push(space.key);
        this.log('space.key', `${player.name} collected the ${space.key} key.`, { playerId: player.id, key: space.key });
      } else {
        player.points += 10;
        this.log('space.key_duplicate', `${player.name} converted a duplicate ${space.key} key into 10 points.`, { playerId: player.id, key: space.key });
      }
    } else if (space.type === 'points') {
      player.points += 20;
      this.log('space.points', `${player.name} gained 20 local points.`, { playerId: player.id, amount: 20 });
    } else if (space.type === 'power') {
      player.powerups.push('Loaded Die');
      this.log('space.powerup', `${player.name} found a Loaded Die.`, { playerId: player.id, powerup: 'Loaded Die' });
    } else if (space.type === 'event') {
      const delta = player.points >= 10 ? -10 : 10;
      player.points += delta;
      this.log('space.event', `${player.name} triggered a crossroads event (${delta > 0 ? '+' : ''}${delta} points).`, { playerId: player.id, delta });
    } else if (space.type === 'portal') {
      player.position = '1';
      this.log('space.portal', `${player.name} used the portal to node 1.`, { playerId: player.id, destination: '1' });
    } else if (space.type === 'exit') {
      if (player.keys.length >= 3) {
        this.finishMatch(player);
      } else {
        this.log('space.exit_locked', `${player.name} reached the exit without all three keys.`, { playerId: player.id, keyCount: player.keys.length });
      }
    }
  }

  advanceTurn() {
    this.state.currentPlayer = (this.state.currentPlayer + 1) % this.state.players.length;
    if (this.state.currentPlayer === 0) this.state.round += 1;
    this.state.phase = 'turn';
    this.state.pendingSteps = 0;
    this.state.routeChoice = null;
    this.log('turn.start', `${this.current.name}'s turn.`, { playerId: this.current.id, round: this.state.round });
  }

  finishMatch(winner) {
    const placements = [...this.state.players].sort((a, b) => {
      if (a.id === winner.id) return -1;
      if (b.id === winner.id) return 1;
      return b.keys.length - a.keys.length || b.points - a.points;
    });
    const reward = {
      keyTier: 'Gold',
      localPoints: 500 + winner.points,
      item: 'Clockwork Compass (mock)',
      productionWrite: false,
    };
    this.state.phase = 'results';
    this.state.result = { winnerId: winner.id, placements: placements.map((p) => p.id), reward };
    this.log('match.finish', `${winner.name} unlocked the exit.`, { winnerId: winner.id, reward });
  }

  snapshot() {
    return JSON.parse(JSON.stringify(this.state));
  }

  exportLog() {
    return JSON.stringify({ seed: this.state.seed, events: this.state.logs }, null, 2);
  }
}

