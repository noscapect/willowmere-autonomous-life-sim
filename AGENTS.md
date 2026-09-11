# Meadow Minds project memory

Stack: Vite + React + TypeScript + Three.js / React Three Fiber / drei. The 3D scene uses procedural geometry; run `npm install`, then `npm run dev`. Validate with `npm run test`, `npm run lint`, and `npm run build`.

The authoritative state is `SimulationWorld` in `src/domain`. `src/simulation` owns ticks, cognition proposals, action validation/effects, and memory writes. UI in `src/ui` only renders a cloned world and sends selection/control input; it must never mutate world truth. The simulation tick is independent from browser frame rendering.

Current milestone: Visual Quality Pass. `src/rendering` is a read-only Three.js renderer: simulation x/y maps to 3D X/Z by `(value - 50) / 4`; `getTerrainHeight` supplies only decorative visual Y. It renders a broad organic terrain skirt, river/banks, bridge, terrain ribbons, instanced meadow scatter, forest surround, detailed procedural cabins, articulated residents, lighting, and camera controls. The renderer never owns simulation state. It is lazy-loaded to keep the initial UI bundle smaller.

Current milestone: Persistent Minds. `server.ts` is the local browser-to-provider boundary. `src/cognition/contracts.ts` defines candidate-bound Zod decisions; `src/runtime/cognitionCoordinator.ts` fairly queues one Ollama request at a time, separate from ticks; `src/runtime/persistence.ts` stores versioned serializable world snapshots. Critical thirst/hunger/energy use `EmergencyReflexProvider` even when LLM cognition is unavailable. The Mind UI saves only non-secret preferences locally.

Next: visual asset upgrades, richer occlusion, dynamic social plans/dialogue, relationships/ownership/crafting. Never let a model directly mutate world state.
