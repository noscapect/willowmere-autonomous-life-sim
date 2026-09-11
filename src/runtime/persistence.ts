import { z } from 'zod';
import type { SimulationWorld } from '../domain/types';
export const SAVE_KEY='willowmere.world.v1';const Envelope=z.object({version:z.literal(1),savedAt:z.string(),world:z.unknown()});
export function saveWorld(world:SimulationWorld){localStorage.setItem(SAVE_KEY,JSON.stringify({version:1,savedAt:new Date().toISOString(),world}));}
export function loadWorld():SimulationWorld|null{try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;const parsed=Envelope.parse(JSON.parse(raw));const world=parsed.world as SimulationWorld;if(!world||!Array.isArray(world.agents)||!Array.isArray(world.objects)||typeof world.tick!=='number')return null;return world;}catch{return null;}}
export function clearWorld(){localStorage.removeItem(SAVE_KEY);}
export function loadMindPreference(){try{return JSON.parse(localStorage.getItem('willowmere.mind')??'null') as {provider:string;model:string}|null;}catch{return null;}}
export function saveMindPreference(value:{provider:string;model:string}){localStorage.setItem('willowmere.mind',JSON.stringify(value));}
