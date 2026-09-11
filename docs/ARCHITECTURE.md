# Architecture

## Situated Agents vertical slice

`SimulationWorld` is the serializable, authoritative world truth: clock, agents, semantic objects, and event history. The UI receives state snapshots but holds only view state such as selection, zoom, and speed.

Every fixed simulation tick advances time and gradual need decay. A distance-based perception pass writes local perception and discovered knowledge before cognition runs. Cognition receives only identity, needs, current perception, retained knowledge, and deterministic context; it does not receive raw world truth. The local deterministic provider is used now; `LlmCognitionProvider` illustrates the replacement seam.

A decision becomes a small plan: normally `WalkTo` an interaction position, then a typed object/agent action. Completion consumes the plan step and starts the following one, preventing a completed walk from trapping the agent. Navigation is a deterministic 4-unit A* grid. Cabins and deep river cells are blocked; the river's only crossing is the Willow bridge. Typed action targets distinguish positions, world objects, and agents. Conversation validates a non-self, available agent in range and benefits both participants.

This establishes the required boundary: world truth → local perception/knowledge → cognition proposal → action plan → navigation/validation → physical effect → memory. Rendering cannot write to the simulation.

## Memory and presentation

Memories include timestamps, participants, place, confidence, and importance; recent memories are bounded separately from long-term memories. The presentation is a responsive CSS 2.5D natural settlement. It deliberately remains decoupled from simulation coordinate semantics.

## Asset policy

Environment, cabins, humans, vegetation, and props are authored as CSS shapes, so there are no game-art dependencies. Web fonts are loaded from Google Fonts: Fraunces, Manrope, and DM Mono, all licensed under SIL OFL 1.1. See `THIRD_PARTY_ASSETS.md`.

## Next engineering milestones

Add occlusion-aware perception and JSON serialization; add a strict JSON-schema LLM adapter; then broaden actions and systems without widening authority beyond validated simulation rules.
