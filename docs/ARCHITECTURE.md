# Architecture

## Current vertical slice

`SimulationWorld` is the serializable, authoritative world truth: clock, agents, semantic objects, and event history. The UI receives state snapshots but holds only view state such as selection, zoom, and speed.

Every fixed simulation tick advances time and gradual need decay. Cognition receives compact agent/world context and returns a proposed typed decision. The local deterministic provider is used now; `LlmCognitionProvider` illustrates the replacement seam. Decisions become `WalkTo` or physical interaction actions. The engine moves agents towards targets and `validateAndApply` enforces proximity, usability, and resource preconditions before any effect occurs. Successful and failed validated actions create event memories.

This establishes the required boundary: world truth → local perception/knowledge (foundation currently captured by `knowledge`) → cognition proposal → intention/action → validation → physical effect → memory. Rendering cannot write to the simulation.

## Memory and presentation

Memories include timestamps, participants, place, confidence, and importance; recent memories are bounded separately from long-term memories. The presentation is a responsive CSS 2.5D natural settlement. It deliberately remains decoupled from simulation coordinate semantics.

## Asset policy

Environment, cabins, humans, vegetation, and props are authored as CSS shapes, so there are no game-art dependencies. Web fonts are loaded from Google Fonts: Fraunces, Manrope, and DM Mono, all licensed under SIL OFL 1.1. See `THIRD_PARTY_ASSETS.md`.

## Next engineering milestones

Add a spatial/navmesh layer and occlusion-aware perception; serialize to JSON; add a strict JSON-schema LLM adapter; then broaden actions and systems without widening authority beyond validated simulation rules.
