# Recovered Original Client Manifest

Date verified: 2026-09-14

These records identify surviving historical Key Quest modules. The binaries are retained only in the authorized local recovery area and must not be committed or redistributed without explicit rights-holder authorization.

| Component | Historical CDN path | Bytes | SHA-256 | Classification |
|---|---|---:|---|---|
| Bootstrap | `keyquest/game/kq2/KeyQuest.swf` | 10,796 | `281ac3c096d637b5959582a70e14703e7363694b0557e03a6ced859ca8eefa2f` | Original proprietary client; private recovery copy |
| Fonts | `keyquest/game/kq2/KQFonts.swf` | 237,968 | `a93b4bc02acd6d950618cdab66b0fc3c2d7e0013b58669c1c9bea9669b6f8d19` | Original proprietary client asset; private recovery copy |
| Bootstrap config | `keyquest/game/kq2/KeyQuest.xml` | 617 | `219fc59adce1c11bb989f5d0e5fd5d345766178138eea7f8541e5a5f437de5ac` | Historical config evidence; private recovery copy |
| Starter | `keyquest/game/kq2/KQStarter.swf` | 171,658 | `22a0ab0d6b20f239c8ebc4a1dd304ec0f46d249d67f1fbadbf525ee189a6d759` | Original proprietary client; private recovery copy |
| Lobby | `keyquest/game/kq2/Lobby.swf` | 1,148,444 | `09e073b4444bfab54ff09ef0576cc4edfe9e954e15dd3ac92a1ae2f034ba28e7` | Original proprietary client; private recovery copy |
| Waiting area | `keyquest/game/kq2/games/WaitingArea.swf` | 1,246,657 | `a924fd770949d6d74ea20741cae6b9eca9ccb377356a1493b89d3efb176f19ed` | Original proprietary client; private recovery copy |
| Metagame | `keyquest/game/kq2/games/KeyquestMetaGame.swf` | 3,056,432 | `781f417b494ec4ae25515fd83f52c426153705bf741ffafff253b314e3b7b9c8` | Original proprietary match client; private recovery copy |

## Recovered execution contract

The original bootstrap can create a local debug identity through `NeoGateway.debug()`. The lobby and waiting-area clients depend on ElectroServer 4. The waiting area receives compressed EUP board data in `WORLD_BYTES` and `AREA_BYTES`, constructs the authentic isometric world, and loads `games/KeyquestMetaGame.swf`.

The metagame module contains the original board HUD, turn and movement handlers, keys, spaces, power-ups, events, minigame transitions, overlays, and game-over/results presentation. A faithful local alpha should drive this surviving client with deterministic local fixtures. Production Neopets authentication, rewards, inventory, and account writes remain disabled.
