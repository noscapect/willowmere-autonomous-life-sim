import * as THREE from 'three';
import type { Vec } from '../domain/types';
import { toWorld } from './coordinates';

/** Decorative-only topography. Simulation remains a 2D x/y plane. */
export function getTerrainHeight(position:Vec):number {const[x,,z]=toWorld(position);const meadow=.1*Math.sin(x*.55)*Math.cos(z*.4)+.05*Math.sin((x+z)*1.7);const river=Math.exp(-Math.pow((x-4.15)/1.45,2))*.27;const cabinPads=[[20,32],[80,30],[80,72]].reduce((sum,[px,pz])=>{const dx=position.x-px,dy=position.y-pz;return sum+Math.exp(-(dx*dx+dy*dy)/95)*.08;},0);return meadow-river+cabinPads;}
export function heightAtWorld(x:number,z:number){return getTerrainHeight({x:x*4+50,y:z*4+50});}
export function terrainGeometry(){const geometry=new THREE.PlaneGeometry(56,56,120,120);const positions=geometry.attributes.position;const colors:number[]=[];for(let i=0;i<positions.count;i++){const x=positions.getX(i),z=-positions.getY(i),edge=Math.max(Math.abs(x),Math.abs(z));let y=heightAtWorld(x,z);if(edge>20)y-=Math.pow((edge-20)/8,2)*2.4;positions.setZ(i,y);const damp=Math.exp(-Math.pow((x-4.15)/2.2,2));const hue=damp>.35?new THREE.Color('#60794a'):y>.12?new THREE.Color('#70914f'):new THREE.Color('#5f8447');colors.push(hue.r,hue.g,hue.b);}geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();return geometry;}
