# Key Quest Project Reconciliation

Date: 2026-09-13

This document reconciles the original restoration contract against the actual project state across GitHub, the AppDeploy production snapshot, and the local working copy.

Status vocabulary: IMPLEMENTED, PARTIAL, MISSING, EXTERNALLY BLOCKED.

## Executive finding

Milestone 0 (proof-of-life) and the playable engineering ALPHA have now passed. The live project includes a complete deterministic local match from lobby through results plus a separate Preservation harness. This is still not a content-complete, multiplayer, production-integrated, or pitch-ready restoration; the remaining scope below stays in force.

## Product and delivery

| Requirement | Status | Evidence / current reality |
|---|---|---|
| Fully playable Key Quest in a current browser | PARTIAL | A clean-room engineering alpha completes one deterministic local match in current Chrome; full historical content, minigames, networking, and fidelity remain incomplete. |
| Normal URL with no Flash installation | IMPLEMENTED | The playable modern alpha runs at keyquest.deadsignaldb.com; Preservation mode keeps Ruffle optional and separate. |
| Public custom domain | IMPLEMENTED | keyquest.deadsignaldb.com is active and verified through AppDeploy. |
| TNT pitch-ready working restoration | MISSING | No end-to-end match, multiplayer, Vault, prize simulation, or pitch flow exists. |
| PRESERVATION mode using original client/presentation | PARTIAL | Original KeyQuest.swf boots; later client/server flow is not reconstructed. |
| MODERN maintainable HTML5/WebGL client sharing rules/backend | PARTIAL | `apps/web` contains a modern browser client and renderer-independent deterministic engine for the alpha slice; no authoritative multiplayer backend exists. |

## Forensic recovery and documentation

| Requirement | Status | Evidence / current reality |
|---|---|---|
| Evidence hierarchy (original assets > archives > Jellyneo > video > recollection) codified | MISSING | Not present in repository docs. |
| Recovery Ledger | PARTIAL | docs/RECOVERY_LEDGER.md exists but became stale after proof-of-life. |
| PROJECT_AUTHORITY.md | MISSING | Not present. |
| COLD_BUILD_POLICY.md | MISSING | Not present. |
| BEHAVIOR_PROVENANCE.md | MISSING | Not present. |
| IP_PROVENANCE.md | MISSING | Not present. |
| KEYQUEST_RESEARCH.md | MISSING | Research exists in chat/history but is not committed to the project. |
| Original KeyQuest.swf recovery | IMPLEMENTED | Public CDN returns HTTP 200 application/x-shockwave-flash, 10,796 bytes; original client executes through Ruffle. |
| KQFonts.swf recovery | IMPLEMENTED | Local recovery ledger records HTTP 200, 237,968 bytes. |
| KeyQuest.xml recovery | IMPLEMENTED | Local recovery ledger records HTTP 200 text/xml, 617 bytes. |
| KQStarter.swf recovery | IMPLEMENTED | Local recovery ledger records HTTP 200, 171,658 bytes. |
| Systematic SWF string/URL/service extraction | PARTIAL | Local extract-kq.cjs exists and recovered service names/URLs; it is uncommitted and not a complete parser. |
| Backend endpoint/service inventory | PARTIAL | NeoGateway URL, scripted-chat URL, and KeyQuestGameService.getPwUserName/logAppStart/logPageView recovered; inventory is incomplete. |
| Complete public Key Quest web-page inventory | PARTIAL | Prior research found about/tutorial/redeem/whatis/support pages, but this evidence is not represented in repo manifests. |
| Asset recovery manifest with URL/type/provenance/hash | MISSING | No manifest exists. |
| Boards/maps inventory and topology recovery | MISSING | No board schemas or topology files exist. |
| Power-up rules/content catalog | MISSING | No project data/schema implementation exists. |
| Cards/events catalog | MISSING | No project data/schema implementation exists. |
| Alignment/hex catalog | MISSING | No project data/schema implementation exists. |
| Token/character catalog | PARTIAL | Asset URL pattern was recovered; no complete content catalog/schema exists. |
| Minigame inventory/resources | PARTIAL | Historical sources and some URL hints were identified in research, but no project manifest or implementation exists. |
| Audio recovery/catalog | MISSING | Not represented in project. |
| Historical prize/seasonal-prize data | MISSING | Not represented in project. |

## Architecture

| Requirement | Status | Evidence / current reality |
|---|---|---|
| Canonical monorepo apps/packages architecture | PARTIAL | GitHub now contains the deployed AppDeploy source under `apps/web` plus recovery tooling and authority docs; broader packages/services architecture remains future work. |
| Renderer-independent TypeScript rules engine | PARTIAL | The dependency-free `apps/web/src/game.js` engine owns deterministic alpha state and rules; it is not yet extracted as the planned TypeScript package. |
| Authoritative multiplayer server | MISSING | No match server exists. |
| Protocol/schema package | MISSING | No protocol package exists. |
| Board graph schema | MISSING | No board-schema implementation exists. |
| Seeded server RNG | PARTIAL | Alpha scenario `KQ-ALPHA-001` uses deterministic per-player dice tables; authoritative server RNG is not implemented. |
| Deterministic/event-sourced match log | PARTIAL | The alpha emits ordered sequence-numbered match events and exports them; persistence/replay ingestion is not implemented. |
| Replay/debug/spectator foundation | MISSING | No implementation exists. |
| Reconnect/drop handling | MISSING | No implementation exists. |
| Bots/AFK takeover | MISSING | No implementation exists. |
| PostgreSQL persistence | MISSING | No database implementation exists. |
| Redis/ephemeral match state | MISSING | No implementation exists. |
| Docker/reproducible server stack | MISSING | No container configuration exists. |
| Ruffle preservation web shell | PARTIAL | Proof harness exists and is deployed, but it does not progress into a playable game. |
| Asset-provider/asset-contract abstraction | MISSING | No package exists. |
| NeoPassAdapter | MISSING | No adapter exists. |
| NeopointsAdapter | MISSING | No adapter exists. |
| InventoryAdapter | MISSING | No adapter exists. |
| PrizeVaultAdapter | MISSING | No adapter exists. |
| AchievementAdapter | MISSING | No adapter exists. |
| AccountTokenAdapter | MISSING | No adapter exists. |
| Mock implementations by default | PARTIAL | Alpha identity, points, standings, and Vault reward are local/mock only; formal adapter packages remain missing. |
| Explicit env gates for live integration/rewards/matchmaking/deploy | PARTIAL | The deployed alpha has no write-capable Neopets adapters and exposes `productionWrite: false`; formal compile/env barriers remain to be added. |
| No write-capable Neopets production integration | IMPLEMENTED | GitHub proxy permits GET/HEAD to images.neopets.com only; deployed harness fetches only the public client and contains no account-write path. |

## Gameplay and user flow

| Requirement | Status | Evidence / current reality |
|---|---|---|
| Create/join lobby | PARTIAL | Local alpha lobby creates 2–4 participant matches; network rooms and joining remain missing. |
| Quick Play/private room | MISSING | No matchmaking implementation. |
| Up to four players | PARTIAL | One local human plus up to three deterministic bots are implemented; network multiplayer is missing. |
| Realtime chat/scripted chat | MISSING | URL discovered; no chat implementation. |
| Token selection | PARTIAL | Alpha lobby offers four original-free symbolic tokens; historical token catalog is missing. |
| Starting Neohome selection/order | MISSING | No board state. |
| Turn-order dice roll | IMPLEMENTED | Local human and bots advance in deterministic round order. |
| 2/3/4/5-key modes | MISSING | No rules/boards. |
| Dice roll 1-6 | IMPLEMENTED | Deterministic 1–6 outcomes are implemented for scenario `KQ-ALPHA-001`. |
| Branching path/route choice | IMPLEMENTED | Human path choice and deterministic bot branch choice are implemented on Clockwork Crossroads. |
| Board movement/direction | IMPLEMENTED | Tokens traverse the board graph with logged step events. |
| Five key colors and duplicate/distinct-key rules | PARTIAL | Alpha implements Red, Blue, and Gold distinct keys plus duplicate conversion; full five-key modes remain missing. |
| Exit/victory resolution | IMPLEMENTED | Returning to Exit with all alpha keys ends the match and produces standings/rewards. |
| Neopoint spaces | PARTIAL | Local point spaces are implemented; they never write live Neopoints. |
| Key spaces | PARTIAL | Three alpha key spaces and duplicate handling are implemented. |
| Power-up spaces | PARTIAL | Alpha power-up spaces grant a Loaded Die inventory item; broader effects/catalog remain missing. |
| Portal spaces | IMPLEMENTED | Alpha portal landing relocates the token and logs the destination. |
| Treasure chest spaces | MISSING | No spaces engine. |
| Character/location/alignment spaces | MISSING | No spaces engine. |
| Power-ups including Super Power-Ups | PARTIAL | One collectible alpha power-up exists; activation rules and Super Power-Ups remain missing. |
| Cards/events | PARTIAL | A deterministic crossroads point event is implemented; historical catalog and card system remain missing. |
| Alignments/reward charms/hex behavior | MISSING | No implementation. |
| Minigame framework/SDK | MISSING | No minigame engine exists. |
| At least three pitch minigames | MISSING | None implemented. |
| Collector's Case/Cabinet | MISSING | No implementation. |
| Vault/reward simulation | PARTIAL | Results award a local Gold key, local points, and a mock item with production writes visibly disabled; full Vault flow is missing. |
| Gold/Silver/Bronze/Lead key reward counts | MISSING | No reward engine. |
| Account stub/mock profile | IMPLEMENTED | Lobby accepts a local display name only and stores no Neopets credentials. |
| End-to-end playable match | IMPLEMENTED | Chrome production run completed lobby → board → branch → three keys → exit → event 090 results. See `ALPHA_ACCEPTANCE.md`. |

## Cold-build and pitch safety

| Requirement | Status | Evidence / current reality |
|---|---|---|
| Production Neopets writes physically disabled | PARTIAL | Current harness has no write path, but the planned adapter-level hard gates/compile barriers do not exist. |
| Vault screen visibly stops at authorization boundary | IMPLEMENTED | Results explicitly show `PRODUCTION WRITE: DISABLED` and state that the reward remains in-browser. |
| Production credentials absent from source | IMPLEMENTED | None are present in GitHub/AppDeploy project. |
| Proprietary SWF/assets not committed to public repo | IMPLEMENTED | GitHub does not contain KeyQuest.swf; local working copy has an untracked research copy. |
| Official production integration | EXTERNALLY BLOCKED | Requires TNT authorization, credentials, and rights; it should remain disabled until granted. |
| Exact live prize/inventory/account writes | EXTERNALLY BLOCKED | Requires TNT-owned production systems and authorization. |
| Public redistribution/licensing of proprietary Neopets assets | EXTERNALLY BLOCKED | Public CDN accessibility is not redistribution permission; written rights/permission are required for an official release. |
| Original lost backend/source/build infrastructure | EXTERNALLY BLOCKED | Availability is controlled by TNT/rights holders and may genuinely be lost; reconstruction must not assume it can be recovered. |
| AppDeploy interception of legacy auth-style AMF endpoint | EXTERNALLY BLOCKED | AppDeploy safety controls rejected this deployment pattern. This is a hosting/tooling blocker, not a fundamental blocker to a clean-room backend design. |

## Testing, deployment, and project hygiene

| Requirement | Status | Evidence / current reality |
|---|---|---|
| Modern Chrome proof-of-life | IMPLEMENTED | Original SWF proof remains available; the modern alpha was also played start-to-results in current Chrome on 2026-09-14. |
| Automated smoke test | PARTIAL | Dependency-free deterministic engine tests are committed and pass; deployment QA and a live Chrome acceptance run passed, but CI is not configured. |
| Public deployment | IMPLEMENTED | AppDeploy snapshot `1789369130017` is ready and serves the playable alpha. |
| keyquest.deadsignaldb.com | IMPLEMENTED | Custom domain is active/verified. |
| GitHub as canonical project source | IMPLEMENTED | The tested AppDeploy source snapshot, engine tests, recovery notes, and safety exclusions are committed under `apps/web`; the authorized PC fast-forwards from `main`. |
| CI/automated regression testing | MISSING | No GitHub Actions/CI exists. |
| Recovery evidence committed promptly | PARTIAL | Some docs committed, but current runtime evidence and local tooling remain untracked. |
| README reflects current deployment/project state | IMPLEMENTED | README now separates Modern Alpha and Preservation, links the live domain, documents local testing, and keeps full-scope caveats. |
| Recovery Ledger reflects current evidence | PARTIAL | Ledger exists but still labels client/runtime UNKNOWN despite successful proof-of-life and omits KQFonts/KeyQuest.xml/KQStarter/backend evidence. |

## Scope reductions and misses

The project was improperly reduced from “fully revive Key Quest into a pitch-ready cold build” to “prove the original SWF boots in Chrome.” Milestone 0 was valid, but it was treated as the project instead of the first gate.

Requirements that were silently dropped or deferred without preserving them in a project authority document include the full replacement backend, authoritative multiplayer, all gameplay systems, board schemas, minigames, content catalogs, Collector's Case, Vault/reward simulation, integration adapters and hard gates, deterministic logs/reconnect/bots, dual PRESERVATION/MODERN modes, IP/behavior provenance, the full recovery manifest, and the TNT pitch flow.

The project also lost canonical-source discipline: local analysis artifacts and runtime evidence were not committed, while the AppDeploy implementation evolved separately from GitHub.

## Correct interpretation of current state

Milestone 0 is complete. The full project is not close to complete. The current build proves original-client survivability and modern-browser execution; it does not yet prove normal gameplay, backend reconstruction, multiplayer, content completeness, or production readiness.
