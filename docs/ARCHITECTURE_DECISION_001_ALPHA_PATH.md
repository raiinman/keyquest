# ADR-001 — Playable Alpha Path

Date: 2026-09-14

Status: Accepted

## Context

Milestone 0 proved that the historical bootstrap SWF executes through Ruffle. Continued recovery then exposed two different missing service layers:

- the initial NeoGateway/AMF authentication contract; and
- the ElectroServer 4 realtime game service selected by `KeyQuest.xml`.

The original service contracts and server implementation are absent. AppDeploy also rejected interception of the historical auth-style AMF endpoint. Guessing those protocols would delay playability, create brittle behavior, and risk accidentally reproducing unsafe production-facing traffic.

## Decision

Build the first playable alpha as a clean-room modern browser client with a renderer-independent deterministic match engine. Retain the historical Ruffle client as a separate Preservation lane for dependency archaeology and presentation reference.

The alpha uses only local/mock identity and reward state. Production account and reward writes are not merely unconfigured; no write-capable Neopets adapter exists in the deployed slice.

## Consequences

- A complete match can be built and tested without invented legacy protocol behavior.
- Deterministic logs create a foundation for replay and eventual authoritative networking.
- Original-client archaeology can continue without blocking playable restoration work.
- Historical presentation and modern maintainability remain separate concerns.
- The alpha does not prove full rule fidelity, multiplayer, minigames, or content completeness.

## Revisit condition

Revisit original-client compatibility only when a verified service contract, surviving server artifact, or rights-holder-provided interface materially reduces uncertainty. Do not replace the modern path with speculative AMF/ElectroServer emulation.

