# Key Quest Recovery Project

A technical preservation and recovery effort focused on determining how much of the original Neopets Key Quest client still survives and what is required to make it playable in a modern browser.

## Milestone 0 — Proof of life

The first target is intentionally narrow: fetch the historical Key Quest client from Neopets' public CDN at runtime and attempt to boot it in current Chrome through Ruffle.

Historical client URL:

```text
https://images.neopets.com/keyquest/game/kq2/KeyQuest.swf?v=32
```

This repository does **not** bundle Neopets SWFs, artwork, audio, account credentials, or other proprietary assets.

## Safety boundary

The recovery harness is deliberately read-only:

- only `GET` and `HEAD` are proxied;
- only `https://images.neopets.com/` is permitted;
- no Neopets login cookies are sent;
- no score submission, Neopoints award, item award, prize redemption, or account modification exists;
- network observations are written to a local recovery ledger.

The point is to make the client run far enough to identify what survives, what is missing, and what backend behavior must be reconstructed.

## Run locally

Requires Node.js 18+ and a current Chrome/Edge build.

```powershell
npm start
```

Then open:

```text
http://127.0.0.1:8787
```

Click **Boot original client**.

## Recovery classifications

Every discovered dependency should ultimately be classified as one of:

- `SURVIVES`
- `MISSING`
- `BACKEND_REQUIRED`
- `RUFFLE_INCOMPATIBILITY`
- `UNKNOWN`

See `docs/RECOVERY_LEDGER.md` for the evidence ledger.

## Project rule

Do not add write-capable Neopets production integration. A future official integration should require explicit Neopets authorization and separate production credentials.