import type { Action, Agent, SimulationWorld, WorldObject } from '../domain/types';
const distance = (a: {x:number;y:number}, b: {x:number;y:number}) => Math.hypot(a.x - b.x, a.y - b.y);
export const canInteract = (agent: Agent, target: WorldObject | undefined) => !!target && target.usable && distance(agent.position, target.position) <= 4.2;
export function walkAction(target: {x:number;y:number}): Action { return { kind:'WalkTo', target, progress:0, duration:1, state:'running' }; }
export function actAction(kind: Action['kind'], targetId: string): Action { return { kind, targetId, progress:0, duration: kind === 'Sleep' ? 8 : 2, state:'running' }; }
export function validateAndApply(agent: Agent, action: Action, world: SimulationWorld): { ok: boolean; message: string } {
  const target = world.objects.find(o => o.id === action.targetId);
  if (!canInteract(agent, target)) return { ok:false, message: `${action.kind} failed: target is out of reach.` };
  if (!target) return { ok:false, message: `${action.kind} failed: target does not exist.` };
  switch (action.kind) {
    case 'Drink': agent.needs.thirst = Math.min(100, agent.needs.thirst + 52); return { ok:true, message: `${agent.name} drew cool water from the well.` };
    case 'Eat': if (!target.stock) return {ok:false, message:'Eat failed: no berries remain.'}; target.stock--; agent.needs.hunger = Math.min(100, agent.needs.hunger + 44); return { ok:true, message: `${agent.name} ate a handful of sunberries.` };
    case 'Sleep': agent.needs.energy = Math.min(100, agent.needs.energy + 50); agent.needs.comfort = Math.min(100, agent.needs.comfort + 15); return { ok:true, message: `${agent.name} rested peacefully.` };
    case 'TalkTo': agent.needs.social = Math.min(100, agent.needs.social + 22); return {ok:true,message:`${agent.name} shared a few words with a neighbor.`};
    case 'Observe': agent.needs.comfort = Math.min(100, agent.needs.comfort + 5); return {ok:true,message:`${agent.name} paused to enjoy the meadow.`};
    default: return {ok:true,message:`${agent.name} completed ${action.kind}.`};
  }
}
