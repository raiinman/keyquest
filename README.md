# Key Quest Restoration

This repository now contains two deliberately separate lanes:

- **Modern Alpha** — a clean-room, current-browser implementation of one complete deterministic local match.
- **Preservation** — the read-only Ruffle proof harness for the surviving historical bootstrap SWF.

Live alpha: <https://keyquest.deadsignaldb.com>

## Playable alpha status

The alpha acceptance gate passed in current Chrome on 2026-09-14. A user can:

1. create a local/mock identity;
2. start a 2–4 player match with local bots;
3. roll deterministic dice;
4. move across a board graph and choose a branch;
5. resolve key, points, event, power-up, and portal spaces;
6. collect Red, Blue, and Gold keys;
7. unlock the exit;
8. reach final standings and a simulated Vault reward.

The scenario seed is `KQ-ALPHA-001`. Match events are sequence-numbered and exportable for debugging.

## Safety boundary

The alpha uses browser-local identity and reward state only. It contains no Neopets credentials and no write-capable Neopets integration. Live Neopoints, inventory, prize redemption, account changes, and production matchmaking are disabled.

The Preservation lane may fetch the public historical bootstrap client through the AppDeploy backend. It does not forward cookies or authentication and does not emulate or contact the retired ElectroServer endpoints.

## Source layout

```text
apps/web/                 AppDeploy source snapshot and playable alpha
  backend/index.ts        Read-only historical-client fetch endpoint
  src/game.js             Renderer-independent deterministic match engine
  src/main.js             Browser UI and Preservation lane
  src/styles.css          Responsive alpha presentation
  tests/                  Deployment acceptance contract
docs/                     Authority, recovery, architecture, and verification
tools/recovery/           Public-safe recovery utilities (no proprietary binaries)
```

## Run the modern alpha locally

```powershell
cd apps/web
npm install
npm run dev
```

The match engine has dependency-free Node tests:

```powershell
cd apps/web
npm test
```

## Project scope

This is an engineering alpha, not the complete Key Quest restoration. Multiplayer services, the full historical board/content catalog, minigames, alignments, cards, chat, Collector's Case, reconnects, persistence, and official account/reward adapters remain future work. See `docs/PROJECT_RECONCILIATION.md` for the full accounting.

## Proprietary assets

Do not commit Neopets SWFs, artwork, audio, or other proprietary binaries to this public repository. Public recovery code, manifests, hashes, and reproducible observations are welcome; redistribution requires rights-holder authorization.

