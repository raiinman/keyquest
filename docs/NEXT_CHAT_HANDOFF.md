# NEXT CHAT HANDOFF — Key Quest Alpha

Date: 2026-09-13
Repository: `raiinman/keyquest`
Live recovery site: `https://keyquest.deadsignaldb.com`
Local working copy: `C:\Users\mikea\Documents\keyquest`

## Read first — authority order

1. `docs/PROJECT_RECONCILIATION.md`
2. `docs/RECOVERY_LEDGER.md`
3. this handoff
4. current repository source
5. local recovery artifacts on the authorized PC

Do not reduce the project back to “prove the SWF boots.” Milestone 0 is already complete.

## Primary objective for the next chat

**Get a playable Key Quest ALPHA running.**

“Playable alpha” means a user can open the project in a current browser and complete at least one deterministic local match flow using reconstructed/mock backend state, without touching Neopets production account/reward systems.

Minimum alpha acceptance target:

- game reaches a real playable board/lobby state rather than stopping at the blue preloader;
- local/mock identity only — no Neopets credentials;
- at least one board topology;
- 2–4 local players and/or bots;
- turn order;
- dice rolls;
- movement/path selection;
- keys;
- core landing-space resolution;
- a small initial subset of power-ups/events sufficient for a complete match;
- victory/exit condition;
- results screen;
- reward/Vault simulation only, with production writes visibly disabled;
- Chrome first;
- deterministic logs for debugging/replay.

This is an engineering alpha, not content-complete Key Quest. Do not pretend missing systems are finished; mark them and keep the original full scope intact.

## What is already proven

The original public Key Quest bootstrap client survives and executes in current Chrome through Ruffle.

Verified surviving resources from the local recovery ledger:

- `KeyQuest.swf?v=32` — HTTP 200, Flash, 10,796 bytes
- `KQFonts.swf` — HTTP 200, Flash, 237,968 bytes
- `KeyQuest.xml` — HTTP 200, XML, 617 bytes
- `KQStarter.swf` — HTTP 200, Flash, 171,658 bytes

Observed client metadata:

- Flash 10
- ActionScript 3
- 980×630
- 31 FPS

Recovered original service/URL strings include:

- `KeyQuestGameService.getPwUserName`
- `KeyQuestGameService.logAppStart`
- `KeyQuestGameService.logPageView`
- `http://www.neopets.com/amfphp/gateway.php`
- `http://www.neopets.com/keyquestgame/data/chat/script_data.phtml`
- map-item, token, event, hit-test, target, and minigame asset roots

The original client currently stops after bootstrap because its historical backend contract is absent.

## Current project reality

### GitHub

GitHub is **not yet fully canonical**. It contains the original recovery harness and corrected docs, but does not contain the newer AppDeploy implementation or all local analysis tooling.

Important committed docs:

- `docs/PROJECT_RECONCILIATION.md`
- `docs/RECOVERY_LEDGER.md`
- `docs/NEXT_CHAT_HANDOFF.md`

### AppDeploy

A separate frontend+backend recovery harness is deployed and active at:

`https://keyquest.deadsignaldb.com`

It fetches the surviving original client server-side and executes it through Ruffle. Custom domain is active/verified.

AppDeploy rejected attempts to rewrite/intercept the original legacy auth-style AMF gateway. Do not treat that as a project-level blocker; it is a constraint of that hosting path.

### Local PC recovery artifacts

The authorized PC has useful untracked files under:

`C:\Users\mikea\Documents\keyquest`

Notable files:

- `KeyQuest.swf`
- `extract-kq.cjs`
- `extract_scripts.py`
- `index-dev.html`
- `index-patched.html`
- `kq-smoke.spec.cjs`
- `kq-smoke.png`
- `playwright.config.cjs`
- `recovery-ledger.jsonl`
- `server-dev.mjs`
- additional smoke/capture experiments

Do not blindly commit proprietary Neopets binaries to the public repository. Bring our code, tests, manifests, hashes, and evidence into GitHub; keep proprietary assets out unless explicitly authorized.

## Full project requirements remain in force

The eventual restoration still includes:

- PRESERVATION mode with original client/presentation where lawful;
- MODERN maintainable client;
- authoritative multiplayer server;
- renderer-independent rules engine;
- board graph schema;
- seeded RNG and deterministic/event-sourced match log;
- reconnect/drop handling;
- bots/AFK takeover;
- board/map catalog;
- power-ups;
- cards/events;
- alignments/hexes;
- token/character catalog;
- minigames;
- chat;
- Collector’s Case/Cabinet;
- Vault/reward simulation;
- NeoPass/Neopoints/Inventory/PrizeVault/Achievement/AccountToken adapters;
- mock adapters by default;
- explicit production hard gates;
- behavior provenance;
- IP provenance;
- asset/recovery manifest;
- TNT pitch-ready flow.

The alpha is only the next executable slice of that larger contract.

## Safety / cold-build requirements

Never require or capture Neopets passwords/tokens for the alpha.

Do not forward legacy auth traffic to Neopets.

No live Neopoints writes.
No live inventory writes.
No live prize redemption.
No production matchmaking.
No Neopets production credentials in source.

Use local/mock identity and local/mock reward data until official authorization exists.

## Recommended next-chat execution order

1. Read the two authority docs and inspect repo + local working tree before coding.
2. Reconcile AppDeploy source into GitHub so one source becomes canonical.
3. Preserve local recovery tooling/evidence without committing proprietary SWFs.
4. Parse `KeyQuest.xml` and inspect `KQStarter.swf`/other recovered SWFs for the next-stage dependency graph and original presentation assets.
5. Decide the fastest alpha path based on evidence:
   - original-client-compatible mock backend if practical and safe; or
   - reconstructed browser alpha using original rules/assets references and a clean local backend.
6. Build the smallest complete match state machine, not another loader demo.
7. Add deterministic automated tests covering one full match.
8. Deploy the alpha to `keyquest.deadsignaldb.com` and verify it in Chrome.
9. Update `PROJECT_RECONCILIATION.md` and `RECOVERY_LEDGER.md` after every material milestone.

## Rule for reporting progress

Do not report “alpha complete” because the app compiles, deploys, or shows the preloader.

Alpha is complete only when the acceptance flow above is playable from start to finish and the result is verified in the browser.
