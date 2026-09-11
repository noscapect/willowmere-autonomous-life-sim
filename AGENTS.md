# Meadow Minds project memory

Stack: Vite + React + TypeScript; all scene art is procedural HTML/CSS. Run `npm install`, then `npm run dev`. Validate with `npm run test`, `npm run lint`, and `npm run build`.

The authoritative state is `SimulationWorld` in `src/domain`. `src/simulation` owns ticks, cognition proposals, action validation/effects, and memory writes. UI in `src/ui` only renders a cloned world and sends selection/control input; it must never mutate world truth. The simulation tick is independent from browser frame rendering.

Current milestone: a rural Willowmere scene, three distinct people, time/speed controls, movement, deterministic need-driven cognition, validated walking/drinking/eating/sleeping/observing actions, memories/event history, selection inspector, and developer overlay. `LlmCognitionProvider` is deliberately only an interface stub: future structured decisions must go through existing validation.

Next: map collision/pathfinding, true visibility and knowledge discovery, save/load, richer social action targets, sprites/audio, schema-validated LLM provider, relationships/ownership/crafting. Never let a model directly mutate world state.
