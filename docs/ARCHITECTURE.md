# Architecture

## Situated Agents vertical slice

`SimulationWorld` is the serializable, authoritative world truth: clock, agents, semantic objects, and event history. The UI receives state snapshots but holds only view state such as selection, zoom, and speed.

Every fixed simulation tick advances time and gradual need decay. A distance-based perception pass writes local perception and discovered knowledge before cognition runs. Cognition receives only identity, needs, current perception, retained knowledge, and deterministic context; it does not receive raw world truth. The local deterministic provider is used now; `LlmCognitionProvider` illustrates the replacement seam.

A decision becomes a small plan: normally `WalkTo` an interaction position, then a typed object/agent action. Completion consumes the plan step and starts the following one, preventing a completed walk from trapping the agent. Navigation is a deterministic 4-unit A* grid. Cabins and deep river cells are blocked; the river's only crossing is the Willow bridge. Typed action targets distinguish positions, world objects, and agents. Conversation validates a non-self, available agent in range and benefits both participants.

This establishes the required boundary: world truth → local perception/knowledge → cognition proposal → action plan → navigation/validation → physical effect → memory. Rendering cannot write to the simulation.

## Rendering boundary and presentation

Memories include timestamps, participants, place, confidence, and importance; recent memories are bounded separately from long-term memories. `src/rendering` consumes simulation snapshots but contains no simulation effects or Three.js types in the domain. `toWorld` maps simulation x/y into render X/Z with `(value - 50) / 4`; `getTerrainHeight` maps that same position to decorative visual Y only. React Three Fiber renders a broad terrain skirt beyond the authoritative area, river banks, physical path ribbons, instanced grass/flower scatter, background forest, detailed cabins, articulated procedural people, time-aware lighting, and an observer camera. Decoration derives from deterministic numeric seeds and never affects navigation.

The authoritative world remains the central 0–100 area. Visual terrain/forest extends beyond it solely to conceal map edges and establish landscape context. The renderer is lazy-loaded from the React UI, moving the heavier Three.js code out of the initial application chunk.

Navigation now returns a `PathResult`: either found points or an explicit unreachable result. The engine never substitutes a direct line. It writes a low-importance navigation failure, suppresses the failed target for that agent, and returns to an idle state for fresh cognition.

## Asset policy

Environment, cabins, humans, vegetation, and props are procedural Three.js geometry, so there are no bundled game-art dependencies. Renderer libraries are MIT-licensed; web fonts are loaded from Google Fonts under SIL OFL 1.1. See `THIRD_PARTY_ASSETS.md`.

## Next engineering milestones

Add occlusion-aware perception and JSON serialization; add a strict JSON-schema LLM adapter; then broaden actions and systems without widening authority beyond validated simulation rules.

## Persistent minds

`server.ts` exposes same-origin cognition endpoints. It probes Ollama model tags and sends compact, candidate-bound structured requests to Ollama; OpenAI has the same normalized provider shape and remains unavailable without a server-side key. The browser never talks to an LLM server directly.

The asynchronous `CognitionCoordinator` is outside `tickWorld`: it uses a fair round-robin queue, permits one in-flight local request by default, applies a real-time cooldown, and delivers completed proposals through a mailbox-like callback. `applyExternalDecision` clones and revalidates a proposal before it becomes a plan. Model text can never mutate simulation truth. An emergency reflex provider maintains survival when remote/local inference is pending or unavailable.

Saves are versioned local-storage envelopes containing only serializable world truth. Provider preferences are separate and non-secret; pending work, controllers, telemetry, and credentials are never serialized.
