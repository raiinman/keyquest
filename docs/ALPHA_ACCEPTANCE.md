# Playable Alpha Acceptance Record

Date: 2026-09-14

Live URL: <https://keyquest.deadsignaldb.com/>

AppDeploy snapshot: `1789369130017`

Scenario seed: `KQ-ALPHA-001`

## Decision

**PASS — the playable ALPHA gate is complete.**

This decision is based on a full production-browser interaction, not a compile, deployment status, loader, or static screenshot.

## Verified Chrome flow

1. Opened the live custom domain in current Chrome.
2. Entered local identity `Alpha Tester`.
3. Started a four-player match (one local human, three deterministic bots).
4. Rolled the deterministic sequence.
5. Collected the Red key.
6. Reached the fork and selected `Sunlit path`.
7. Collected the Blue key.
8. Collected the Gold key.
9. Returned to the Exit.
10. Reached the results screen at event sequence `090`.

## Observed result

- Winner: `Alpha Tester`
- Keys: Red, Blue, Gold
- Vault key: Gold (simulated)
- Local points: 500
- Mock prize: `Clockwork Compass (mock)`
- Production write: `DISABLED`
- Final roster: four players with deterministic standings

The browser also verified the separate Preservation source check:

- `KeyQuest.swf?v=32`
- `application/x-shockwave-flash`
- 10,796 bytes
- source status `SURVIVES`

## Automated evidence

The dependency-free engine tests cover the deterministic first key and the complete match-to-results path. The complete test asserts the winning player, all three keys, the `match.finish` event, and `productionWrite === false`.

## Known alpha limits

This pass does not claim content completeness or production readiness. The alpha currently uses one reconstructed board, one deterministic scenario, local bots, three key colors, representative spaces/events/power-ups, session-only results, and no minigames. The full project requirements remain tracked in `PROJECT_RECONCILIATION.md`.

