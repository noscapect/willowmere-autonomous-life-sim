import type { Agent, Memory, SimulationWorld } from '../domain/types';
import { actAction, validateAndApply, walkAction } from './actions';
import { LocalCognition, type CognitionProvider } from './cognition';
const cognition = new LocalCognition();
const clamp = (n:number) => Math.max(0, Math.min(100,n));
function remember(agent: Agent, world: SimulationWorld, type: string, description: string, importance=0.45) {
  const m: Memory = { id:`m-${world.tick}-${agent.id}`, timestamp:world.day * 1440 + world.minute, type, participants:[agent.id], place:'Willowmere', description, importance, confidence:1 };
  agent.recentMemories = [m, ...agent.recentMemories].slice(0, 5);
  if (importance > .6) agent.longTermMemories.push(m);
  world.events = [{...m, agentName:agent.name}, ...world.events].slice(0, 40);
}
function decay(agent: Agent) { agent.needs.hunger=clamp(agent.needs.hunger-.18); agent.needs.thirst=clamp(agent.needs.thirst-.28); agent.needs.energy=clamp(agent.needs.energy-.12); agent.needs.social=clamp(agent.needs.social-.06); agent.needs.comfort=clamp(agent.needs.comfort-.04); }
function advance(agent: Agent, world: SimulationWorld, provider: CognitionProvider) {
  const action = agent.currentAction;
  if (action.kind === 'WalkTo' && action.target) {
    const dx=action.target.x-agent.position.x, dy=action.target.y-agent.position.y, d=Math.hypot(dx,dy);
    if (d <= 1.15) { agent.position={...action.target}; action.state='success'; return; }
    const speed=1.2; agent.position={x:agent.position.x + dx/d*speed,y:agent.position.y + dy/d*speed}; agent.facing=dx < 0?'left':'right'; return;
  }
  action.progress++;
  if (action.progress < action.duration) return;
  if (action.kind !== 'Idle') { const r=validateAndApply(agent,action,world); remember(agent,world,r.ok?'action':'failure',r.message,r.ok ? .7 : .3); }
  const decision=provider.decide(agent,world);
  if (!decision) return;
  agent.currentGoal=decision.goal;
  const target = decision.target;
  const near=Math.hypot(agent.position.x-target.position.x,agent.position.y-target.position.y)<=4.2;
  agent.currentAction=near ? actAction(decision.action,target.id) : walkAction(target.position);
}
export function tickWorld(world: SimulationWorld, provider: CognitionProvider = cognition): SimulationWorld {
  const next=structuredClone(world) as SimulationWorld;
  next.tick++; next.minute += 2; if(next.minute>=1440){next.day++;next.minute-=1440;}
  next.agents.forEach(a=>{decay(a);advance(a,next,provider);});
  return next;
}
export const formatTime = (world: SimulationWorld) => `Day ${world.day} · ${String(Math.floor(world.minute/60)).padStart(2,'0')}:${String(world.minute%60).padStart(2,'0')}`;
