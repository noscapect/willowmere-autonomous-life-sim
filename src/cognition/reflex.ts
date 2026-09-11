import type { CognitionProvider, Decision } from '../simulation/cognition';
import type { CognitionContext } from '../simulation/cognition';
/** Critical needs stay deterministic even while an external mind is unavailable. */
export class EmergencyReflexProvider implements CognitionProvider { decide(context:CognitionContext):Decision|null{const a=context.agent;const find=(id:string)=>a.knowledge.find(k=>k.id===id);if(a.needs.thirst<20&&find('well'))return{goal:'Urgently drink water',target:{kind:'object',objectId:'well'},action:'Drink'};if(a.needs.hunger<20&&find('berries'))return{goal:'Urgently eat food',target:{kind:'object',objectId:'berries'},action:'Eat'};if(a.needs.energy<15)return{goal:'Urgently rest',target:{kind:'object',objectId:a.homeId},action:'Sleep'};return null;} }
