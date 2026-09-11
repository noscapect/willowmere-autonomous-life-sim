# Meadow Minds project memory

Stack: Vite + React + TypeScript + Three.js / React Three Fiber / drei. The 3D scene uses procedural geometry; run `npm install`, then `npm run dev`. Validate with `npm run test`, `npm run lint`, and `npm run build`.

The authoritative state is `SimulationWorld` in `src/domain`. `src/simulation` owns ticks, cognition proposals, action validation/effects, and memory writes. UI in `src/ui` only renders a cloned world and sends selection/control input; it must never mutate world truth. The simulation tick is independent from browser frame rendering.

Current milestone: Willowmere Becomes a World. `src/rendering` is a read-only Three.js renderer: simulation x/y maps to 3D X/Z by `(value - 50) / 4`; Y is visual height. It renders procedural terrain, water, bridge, cabins, props, people, lighting, and camera controls. The renderer never owns simulation state. Navigation uses explicit `{status: 'found' | 'unreachable'}` results; failures write a low-importance memory, suppress that target, and return agents to idle.

Next: visual asset upgrades, save/load, richer occlusion, dynamic social plans/dialogue, schema-validated LLM provider, relationships/ownership/crafting. Never let a model directly mutate world state.
