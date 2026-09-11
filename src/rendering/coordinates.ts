import type { Vec } from '../domain/types';
/** Rendering-only mapping. Simulation positions remain in their 0–100 coordinate system. */
export const toWorld=({x,y}:Vec):[number,number,number]=>[(x-50)/4,0,(y-50)/4];
