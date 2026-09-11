import { describe, expect, it } from 'vitest';
import { createWorld } from '../domain/world';
import { canInteract, validateAndApply } from './actions';
import { tickWorld } from './engine';
describe('authoritative simulation', () => {
  it('decays needs on ticks', () => { const w=createWorld(); const hunger=w.agents[0].needs.hunger; expect(tickWorld(w).agents[0].needs.hunger).toBeLessThan(hunger); });
  it('drinking only succeeds while in range and restores thirst', () => { const w=createWorld(); const a=w.agents[0]; const well=w.objects.find(x=>x.id==='well')!; expect(canInteract(a,well)).toBe(false); const fail=validateAndApply(a,{kind:'Drink',targetId:'well',progress:2,duration:2,state:'running'},w); expect(fail.ok).toBe(false); a.position={...well.position}; const t=a.needs.thirst; expect(validateAndApply(a,{kind:'Drink',targetId:'well',progress:2,duration:2,state:'running'},w).ok).toBe(true); expect(a.needs.thirst).toBeGreaterThan(t); });
  it('eating consumes berries', () => { const w=createWorld(); const a=w.agents[0], b=w.objects.find(x=>x.id==='berries')!; a.position={...b.position}; const stock=b.stock!; validateAndApply(a,{kind:'Eat',targetId:b.id,progress:2,duration:2,state:'running'},w); expect(b.stock).toBe(stock-1); });
  it('is stable from the same starting state', () => { let a=createWorld(), b=createWorld(); for(let i=0;i<30;i++){a=tickWorld(a);b=tickWorld(b);} expect(a).toEqual(b); });
});
