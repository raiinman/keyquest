# Key Quest Recovery Ledger

This ledger records what survives, what fails, and what must be reconstructed. Evidence should be reproducible and tied to an observable request, surviving asset, historical source, or runtime behavior.

## Status values

- `SURVIVES` — resource or behavior is still directly obtainable/functional.
- `MISSING` — resource was requested/expected but is no longer available.
- `BACKEND_REQUIRED` — client behavior depends on a dead or absent service/API.
- `RUFFLE_INCOMPATIBILITY` — resource exists, but Ruffle cannot currently reproduce the required Flash behavior.
- `UNKNOWN` — insufficient evidence.

## Verified records

| ID | Component | Evidence | Status | Notes |
|---|---|---|---|---|
| KQ-CLIENT-001 | `KeyQuest.swf?v=32` | Neopets CDN + local recovery ledger + hosted AppDeploy harness | SURVIVES | HTTP 200, `application/x-shockwave-flash`, 10,796 bytes. Ruffle accepts and executes it. |
| KQ-CLIENT-002 | `KQFonts.swf` | Local recovery ledger | SURVIVES | HTTP 200, `application/x-shockwave-flash`, 237,968 bytes. |
| KQ-CONFIG-001 | `KeyQuest.xml` | Local recovery ledger | SURVIVES | HTTP 200, `text/xml`, 617 bytes. Content still needs project-level parsing/provenance. |
| KQ-CLIENT-003 | `KQStarter.swf` | Local recovery ledger | SURVIVES | HTTP 200, `application/x-shockwave-flash`, 171,658 bytes. |
| KQ-RUNTIME-001 | Modern browser execution | Ruffle 0.6.0 local + hosted proof | SURVIVES | Original SWF loaded as Flash 10 / AS3, 980x630, 31 FPS. |
| KQ-BACKEND-001 | NeoPet AMFPHP gateway | Original SWF runtime/string evidence | BACKEND_REQUIRED | Client references `http://www.neopets.com/amfphp/gateway.php`; current restoration has no compatible service implementation. |
| KQ-SERVICE-001 | `KeyQuestGameService.getPwUserName` | Original SWF string extraction | BACKEND_REQUIRED | Service name recovered; request/response contract not reconstructed. |
| KQ-SERVICE-002 | `KeyQuestGameService.logAppStart` | Original SWF string extraction | BACKEND_REQUIRED | Service name recovered; contract not reconstructed. |
| KQ-SERVICE-003 | `KeyQuestGameService.logPageView` | Original SWF string extraction | BACKEND_REQUIRED | Service name recovered; contract not reconstructed. |
| KQ-WEB-001 | Key Quest public web pages | Neopets public site research | SURVIVES | About/tutorial/redeem/whatis and supporting documentation remain reachable in part; full manifest not yet committed. |
| KQ-PROXY-001 | Read-only CDN compatibility proxy | GitHub `server.mjs` / `proxy.php` | SURVIVES | GET/HEAD only, `images.neopets.com` only, no cookies/auth forwarding. |
| KQ-DEPLOY-001 | Public recovery harness | AppDeploy + custom domain | SURVIVES | `keyquest.deadsignaldb.com` active and verified. This is proof-of-life only, not a playable game. |

## Unresolved classes

The following are not yet sufficiently inventoried to mark individually: board SWFs/assets, board topologies, minigame resources, token/character catalogs, power-ups, cards/events, alignments/hexes, audio, historical prize pools, chat data, full backend service methods, game server endpoints, and reward/account integration behavior.

## Runtime evidence template

For every request discovered by the client, record:

```text
ID:
Requested URL:
HTTP status:
Content-Type:
Observed from:
Classification:
Required by:
Notes:
```

## Milestone 0 result

Milestone 0 PASSED: the original Key Quest client is reproducibly accepted by Ruffle and begins execution in a current Chromium browser. The next project gate is no longer “does the client survive?”; it is reconstruction of the startup/backend contract and continued dependency inventory.
