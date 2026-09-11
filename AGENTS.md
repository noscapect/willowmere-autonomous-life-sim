# Meadow Minds project memory

Stack: Vite + React + TypeScript; all scene art is procedural HTML/CSS. Run `npm install`, then `npm run dev`. Validate with `npm run test`, `npm run lint`, and `npm run build`.

The authoritative state is `SimulationWorld` in `src/domain`. `src/simulation` owns ticks, cognition proposals, action validation/effects, and memory writes. UI in `src/ui` only renders a cloned world and sends selection/control input; it must never mutate world truth. The simulation tick is independent from browser frame rendering.

Current milestone: Situated Agents. The world has typed position/object/agent targets, short action plans (`WalkTo` then interaction), grid-A* navigation around cabins and a river bridge, interaction positions, local perception, persistent discovered knowledge, deterministic exploration, and personality-weighted social/exploration choices. The inspector exposes known world; the developer overlay exposes path and perception.

Next: save/load, richer occlusion, dynamic social plans/dialogue, schema-validated LLM provider, relationships/ownership/crafting. Never let a model directly mutate world state.
