import type { Agent, Memory, SimulationWorld, WorldObject } from './types';
const needs = (hunger: number, thirst: number, energy: number, social = 72, comfort = 68) => ({ hunger, thirst, energy, social, comfort });
const memory = (id: string, description: string, timestamp = 0): Memory => ({ id, timestamp, type: 'arrival', participants: [], place: 'Willowmere', description, importance: 0.4, confidence: 1 });
const objects: WorldObject[] = [
  { id: 'cabin-1', name: 'Juniper Cabin', type: 'cabin', position: { x: 20, y: 32 }, usable: false },
  { id: 'cabin-2', name: 'Birch Cabin', type: 'cabin', position: { x: 75, y: 30 }, usable: false },
  { id: 'cabin-3', name: 'Moss Cottage', type: 'cabin', position: { x: 72, y: 72 }, usable: false },
  { id: 'bed-1', name: 'Mara’s bed', type: 'bed', position: { x: 28, y: 42 }, usable: true },
  { id: 'bed-2', name: 'Jonah’s bed', type: 'bed', position: { x: 70, y: 40 }, usable: true },
  { id: 'bed-3', name: 'Elena’s bed', type: 'bed', position: { x: 68, y: 78 }, usable: true },
  { id: 'well', name: 'Old stone well', type: 'well', position: { x: 47, y: 48 }, usable: true },
  { id: 'berries', name: 'Sunberry thicket', type: 'berryBush', position: { x: 42, y: 70 }, usable: true, stock: 18 },
  { id: 'bench', name: 'Shared bench', type: 'bench', position: { x: 57, y: 53 }, usable: true },
  { id: 'table', name: 'Picnic table', type: 'table', position: { x: 52, y: 58 }, usable: true },
  ...Array.from({ length: 15 }, (_, i) => ({ id: `tree-${i}`, name: 'Oak tree', type: 'tree' as const, position: { x: 7 + (i * 17) % 89, y: 8 + (i * 29) % 85 }, usable: false }))
];
function agent(id: string, name: string, age: number, color: string, shirt: string, position: {x:number;y:number}, homeId: string, traits: string[], initial: ReturnType<typeof needs>, relationships: Agent['relationships']): Agent {
  return { id, name, age, color, shirt, position, homeId, traits, preferences: ['quiet mornings', 'fresh berries'], needs: initial, inventory: [], knowledge: ['well', 'berries', homeId], recentMemories: [memory(`${id}-arrival`, `${name} woke to birdsong.`)], longTermMemories: [], relationships, currentGoal: 'Settle into the morning', currentAction: { kind: 'Idle', progress: 0, duration: 5, state: 'running' }, facing: 'right' };
}
export function createWorld(): SimulationWorld {
  const mara = agent('a-mara', 'Mara Vale', 31, '#7a4b32', '#d76c55', {x: 24,y:48}, 'bed-1', ['curious', 'warm'], needs(61, 34, 76), [{agentId:'a-jonah',affinity:0.5,label:'friend'}, {agentId:'a-elena',affinity:0.35,label:'neighbor'}]);
  const jonah = agent('a-jonah', 'Jonah Reed', 38, '#3f2c26', '#5077a4', {x: 70,y:47}, 'bed-2', ['methodical', 'reserved'], needs(35, 62, 49), [{agentId:'a-mara',affinity:0.5,label:'friend'}, {agentId:'a-elena',affinity:0.2,label:'neighbor'}]);
  const elena = agent('a-elena', 'Elena Sato', 27, '#251d1b', '#8b6cb8', {x: 52,y:75}, 'bed-3', ['generous', 'lively'], needs(28, 58, 84), [{agentId:'a-mara',affinity:0.35,label:'neighbor'}, {agentId:'a-jonah',affinity:0.2,label:'neighbor'}]);
  return { tick: 0, day: 1, minute: 7 * 60 + 20, agents: [mara, jonah, elena], objects, events: [], seed: 24601 };
}
