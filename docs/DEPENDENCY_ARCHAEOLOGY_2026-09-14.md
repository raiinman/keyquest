# Dependency Archaeology — 2026-09-14

## `KeyQuest.xml`

The surviving 617-byte configuration selects `kq2` by default and names two retired ElectroServer sets:

| Set | Hosts | Ports |
|---|---|---|
| `kq1` | `keyquest-2.neopets.com`, `keyquest-3.neopets.com` | 9875, 443, 80 |
| `kq2` | `keyquest-5.neopets.com`, `keyquest-6.neopets.com` | 9875, 443, 80 |

This proves that the historical startup dependency is not only an AMF method. After NeoGateway bootstrap, `KQStarter.swf` attempts a separate ElectroServer connection.

## `KQStarter.swf`

Read-only in-memory string extraction from the surviving 171,658-byte SWF recovered:

- build metadata: Adobe Flex 4 application, dated 2010-08-04;
- `Lobby.swf` as the next major client module;
- `assets/preloader.swf`;
- ElectroServer 4 classes and binary protocol references;
- `All servers failed` connection failure text;
- `KeyQuest.xml`, `KQFonts.swf`, and `KQStarter.swf` loader names;
- `Gateway Error. Please login!` and `NeoGateway` startup state;
- `CreateOrJoinGameRequest`, `FindGamesRequest`, and matching response types;
- `GateWayKickUserRequest`;
- original public asset roots for map items, tokens, events, hit tests, targets, minigame images, minigame titles, and scripted chat.

## Recovery conclusion

An original-client-compatible alpha would require reconstructing both the NeoGateway contract and enough ElectroServer 4 behavior to load `Lobby.swf`, create/join a game, and drive gameplay. That is materially larger and less certain than a single mocked AMF response. This evidence supports ADR-001: use the modern clean-room engine for the playable alpha and continue preservation work in parallel.

## Integrity

Local recovered `KeyQuest.swf` SHA-256:

`281ac3c096d637b5959582a70e14703e7363694b0557e03a6ced859ca8eefa2f`

The proprietary binary remains excluded from the public repository.

