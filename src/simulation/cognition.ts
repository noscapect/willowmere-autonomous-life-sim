import type { Agent, SimulationWorld, WorldObject } from '../domain/types';
export type Decision = { goal: string; target: WorldObject; action: 'Drink' | 'Eat' | 'Sleep' | 'TalkTo' | 'Observe' };
export interface CognitionProvider { decide(agent: Agent, world: SimulationWorld): Decision | null }
/** Deterministic, replaceable cognition. It proposes intents; it cannot mutate world state. */
export class LocalCognition implements CognitionProvider {
  decide(agent: Agent, world: SimulationWorld): Decision | null {
    const find = (type: WorldObject['type']) => world.objects.find(o => o.type === type)!;
    if (agent.needs.thirst < 45) return { goal: 'Quench thirst', target: find('well'), action: 'Drink' };
    if (agent.needs.hunger < 42) return { goal: 'Find something to eat', target: find('berryBush'), action: 'Eat' };
    if (agent.needs.energy < 35) return { goal: 'Rest at home', target: world.objects.find(o => o.id === agent.homeId)!, action: 'Sleep' };
    if (agent.needs.social < 35) {
      const other = world.agents.find(a => a.id !== agent.id)!;
      return { goal: `Talk with ${other.name}`, target: { id: other.id, name: other.name, type: 'bench', position: other.position, usable: true }, action: 'TalkTo' };
    }
    return { goal: 'Take in the morning', target: find('bench'), action: 'Observe' };
  }
}
/** Contract for a future strict-schema LLM adapter. Its output remains only a proposed Decision. */
export class LlmCognitionProvider implements CognitionProvider { decide(): Decision | null { return null; } }
