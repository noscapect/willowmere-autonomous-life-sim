import { z } from 'zod';
import type { SimulationWorld } from '../domain/types';
export const SAVE_KEY='willowmere.world.v1';const Envelope=z.object({version:z.literal(1),savedAt:z.string(),world:z.unknown()});
export function saveWorld(world:SimulationWorld){localStorage.setItem(SAVE_KEY,JSON.stringify({version:1,savedAt:new Date().toISOString(),world}));}
export function loadWorld():SimulationWorld|null{try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;const parsed=Envelope.parse(JSON.parse(raw));const world=parsed.world as SimulationWorld;if(!world||!Array.isArray(world.agents)||!Array.isArray(world.objects)||typeof world.tick!=='number')return null;return world;}catch{return null;}}
export function clearWorld(){localStorage.removeItem(SAVE_KEY);}
export type MindPreference={provider:string;ollamaModel:string;openaiModel:string};
export function loadMindPreference():MindPreference|null{try{const raw=JSON.parse(localStorage.getItem('willowmere.mind')??'null') as Partial<MindPreference>&{model?:string};return raw?{provider:raw.provider??'local-rules',ollamaModel:raw.ollamaModel??raw.model??'',openaiModel:raw.openaiModel??''}:null;}catch{return null;}}
export function saveMindPreference(value:MindPreference){localStorage.setItem('willowmere.mind',JSON.stringify(value));}
