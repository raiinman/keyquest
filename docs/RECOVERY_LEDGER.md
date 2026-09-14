# Key Quest Recovery Ledger

This ledger records what survives, what fails, and what must be reconstructed. Evidence should be reproducible and tied to an observable request, surviving asset, historical source, or runtime behavior.

## Status values

- `SURVIVES` — resource or behavior is still directly obtainable/functional.
- `MISSING` — resource was requested/expected but is no longer available.
- `BACKEND_REQUIRED` — client behavior depends on a dead or absent service/API.
- `RUFFLE_INCOMPATIBILITY` — resource exists, but Ruffle cannot currently reproduce the required Flash behavior.
- `UNKNOWN` — insufficient evidence.

## Initial records

| ID | Component | Evidence | Status | Notes |
|---|---|---|---|---|
| KQ-CLIENT-001 | `KeyQuest.swf?v=32` | Historical Neopets CDN URL | UNKNOWN | First runtime target. Must verify actual body/content through harness. |
| KQ-WEB-001 | Key Quest public web pages | Neopets public site | SURVIVES | Historical supporting pages remain publicly reachable in part. |
| KQ-RUNTIME-001 | Modern browser execution | Ruffle harness | UNKNOWN | Chrome/Edge proof pending first hosted/local boot. |
| KQ-PROXY-001 | Read-only CDN compatibility proxy | This repository | SURVIVES | Node and cPanel/PHP paths implemented. |

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

## Milestone 0 acceptance test

Milestone 0 passes when at least one of these outcomes is reproducibly demonstrated:

1. The original Key Quest client is accepted by Ruffle and begins execution in current Chrome/Edge; or
2. The original client reaches a deterministic failure with the exact missing dependency or unsupported runtime behavior identified.

Either outcome advances the reconstruction because it replaces speculation with a concrete dependency chain.
