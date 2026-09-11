import { DecisionSchema, contextFor, normalizeDecision, type ProviderId } from '../cognition/contracts';
import type { SimulationWorld } from '../domain/types';

export type MindRuntime={provider:ProviderId;model:string;maxConcurrent:number;cooldownMs:number};
export type MindStatus='LOCAL'|'QUEUED'|'THINKING'|'OLLAMA'|'OPENAI'|'FALLBACK'|'COOLDOWN'|'ERROR';
export type MindMetrics={queue:number;running:number;completed:number;rejected:number;fallbacks:number;stale:number;averageLatencyMs:number;lastLatencyMs:number;lastError?:string};
type Fetcher=(input:RequestInfo|URL,init?:RequestInit)=>Promise<Response>;

export class CognitionCoordinator {
  private queued:string[]=[]; private active=new Map<string,AbortController>(); private last=new Map<string,number>(); private states=new Map<string,MindStatus>(); private roundRobin=0;
  private latencies:number[]=[]; private completed=0; private rejected=0; private fallbacks=0; private stale=0; private error?:string; private epoch=0;
  private runtime:MindRuntime={provider:'local-rules',model:'',maxConcurrent:1,cooldownMs:5000};
  private getWorld:()=>SimulationWorld=()=>{throw new Error('Coordinator is not configured')};
  private onDecision:(id:string,decision:ReturnType<typeof normalizeDecision>)=>void=()=>{};

  // Keep the browser's native fetch invoked through globalThis; passing fetch by reference loses its receiver in some browsers.
  constructor(private fetcher:Fetcher=(input,init)=>globalThis.fetch(input,init)){}

  configure(runtime:MindRuntime,getWorld:()=>SimulationWorld,onDecision:(id:string,decision:ReturnType<typeof normalizeDecision>)=>void){
    const changed=runtime.provider!==this.runtime.provider||runtime.model!==this.runtime.model||runtime.maxConcurrent!==this.runtime.maxConcurrent||runtime.cooldownMs!==this.runtime.cooldownMs;
    if(changed)this.reset(); this.runtime=runtime; this.getWorld=getWorld; this.onDecision=onDecision;
  }
  reset(){this.epoch++;for(const controller of this.active.values())controller.abort();this.active.clear();this.queued=[];this.states.clear();}
  dispose(){this.reset()}
  status(id:string){return this.states.get(id)??'LOCAL'}
  metrics():MindMetrics{return{queue:this.queued.length,running:this.active.size,completed:this.completed,rejected:this.rejected,fallbacks:this.fallbacks,stale:this.stale,averageLatencyMs:this.latencies.length?Math.round(this.latencies.reduce((a,b)=>a+b,0)/this.latencies.length):0,lastLatencyMs:this.latencies.at(-1)??0,lastError:this.error}}
  schedule(){
    if(this.runtime.provider==='local-rules'||!this.runtime.model)return;
    const world=this.getWorld(),now=Date.now(),agents=world.agents,ordered=agents.map((_,i)=>agents[(i+this.roundRobin)%agents.length]);
    this.roundRobin=(this.roundRobin+1)%Math.max(1,agents.length);
    for(const agent of ordered){
      if(agent.currentAction.kind!=='Idle'||agent.plan.length||this.active.has(agent.id)||this.queued.includes(agent.id))continue;
      if(now-(this.last.get(agent.id)??0)<this.runtime.cooldownMs){this.states.set(agent.id,'COOLDOWN');continue;}
      this.queued.push(agent.id);this.states.set(agent.id,'QUEUED');
    }
    this.pump();
  }
  private pump(){
    while(this.active.size<this.runtime.maxConcurrent&&this.queued.length){
      const id=this.queued.shift()!,world=this.getWorld(),agent=world.agents.find(a=>a.id===id);
      if(!agent||agent.currentAction.kind!=='Idle'||agent.plan.length)continue;
      const context=contextFor(agent,world),controller=new AbortController(),epoch=this.epoch,runtime={...this.runtime},started=Date.now();
      this.active.set(id,controller);this.states.set(id,'THINKING');this.last.set(id,started);
      this.fetcher('/api/cognition/decision',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({provider:runtime.provider,model:runtime.model,context}),signal:controller.signal})
        .then(async response=>{if(!response.ok)throw new Error((await response.json() as {error?:string}).error??`HTTP ${response.status}`);return DecisionSchema.parse((await response.json() as {decision:unknown}).decision);})
        .then(result=>{if(epoch!==this.epoch||runtime.provider!==this.runtime.provider||runtime.model!==this.runtime.model){this.stale++;return;}const decision=normalizeDecision(result,context);if(!decision){this.rejected++;this.states.set(id,'FALLBACK');return;}this.completed++;this.latencies=[...this.latencies.slice(-19),Date.now()-started];this.states.set(id,runtime.provider==='ollama'?'OLLAMA':'OPENAI');this.onDecision(id,decision);})
        .catch(error=>{if(error instanceof DOMException&&error.name==='AbortError'){this.stale++;return;}this.fallbacks++;this.error=error instanceof Error?error.message:'Provider error';this.states.set(id,'ERROR');})
        .finally(()=>{this.active.delete(id);if(epoch===this.epoch)this.pump();});
    }
  }
}
