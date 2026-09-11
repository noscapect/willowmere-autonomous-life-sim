import { afterEach, describe, expect, it, vi } from 'vitest';
import { createWorld } from '../domain/world';
import { SAVE_KEY, loadWorld, saveWorld } from './persistence';
describe('versioned persistence',()=>{const storage=new Map<string,string>();afterEach(()=>{storage.clear();vi.unstubAllGlobals();});const install=()=>vi.stubGlobal('localStorage',{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value),removeItem:(key:string)=>storage.delete(key)});
  it('round-trips serializable world state without runtime work',()=>{install();const world=createWorld();world.agents[0].needs.thirst=42;saveWorld(world);const restored=loadWorld();expect(restored?.agents[0].needs.thirst).toBe(42);expect(JSON.stringify(restored)).not.toContain('AbortController');});
  it('fails safely for corrupt saves',()=>{install();storage.set(SAVE_KEY,'not-json');expect(loadWorld()).toBeNull();});
});
