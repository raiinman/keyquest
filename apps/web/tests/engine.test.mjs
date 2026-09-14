import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine, MATCH_SEED } from '../src/game.js';

test('first deterministic human roll collects the red key', () => {
  const game = new GameEngine();
  game.startMatch({ playerName: 'Tester', playerCount: 2, token: 'T' });
  game.roll();
  assert.deepEqual(game.state.players[0].keys, ['Red']);
});

test('complete deterministic match has keys, exit, result, and no production write', () => {
  const game = new GameEngine();
  game.startMatch({ playerName: 'Tester', playerCount: 2, token: 'T' });
  while (game.state.phase !== 'results') {
    const current = game.current;
    game.roll();
    if (game.state.phase === 'path') game.choosePath('sunny');
    if (game.state.phase !== 'results' && current.kind === 'human') {
      while (game.current.kind === 'bot' && game.state.phase !== 'results') game.roll();
    }
  }
  assert.equal(game.state.seed, MATCH_SEED);
  assert.equal(game.state.result.winnerId, 'human');
  assert.equal(game.state.result.reward.productionWrite, false);
  assert.deepEqual(game.state.players[0].keys, ['Red', 'Blue', 'Gold']);
  assert.ok(game.state.logs.some((event) => event.type === 'match.finish'));
});
