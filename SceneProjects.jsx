import React from 'react';
import BreathingPreview from './BreathingPreview.jsx';
import content from './content.json';

export default function SceneProjects({progress}){
 const distance=Math.abs(progress-2/3);
 if(distance>.065)return null;
 const cycle=content.projectGroups.flatMap(g=>g.projects).find(p=>p.name==='Her Cycle');
 return <section className="scene-projects" aria-label="Featured projects" style={{visibility:distance<.045?'visible':'hidden'}}>
  <div className="recent-work-bubble">My recent work :)</div>
  <article className="scene-project-card">
   <div className="scene-project-media"><BreathingPreview/></div>
   <div className="scene-project-body"><span className="scene-project-tag">MMH CAPSTONE · BREATH-CONTROLLED GAME</span><h2>Just Keep Breathing</h2><p>A storytelling video game controlled through a wearable respiration belt, sharing my experiences with PTSD and intimate partner violence.</p><a className="scene-project-details" href={import.meta.env.BASE_URL+'just-keep-breathing.html'}>View Details <span aria-hidden="true">↗</span></a><small>Currently in development</small></div>
  </article>
  <article className="scene-project-card scene-project-cycle">
   <div className="scene-project-media"><img src={import.meta.env.BASE_URL+cycle.image} alt="Her Cycle visual novel cover"/></div>
   <div className="scene-project-body"><span className="scene-project-tag">VISUAL NOVEL VIDEO GAME · WOMEN’S HEALTH</span><h2>Her Cycle</h2><p>Explore a girl’s menstrual cycle across four phases. Inspired by my own period pain, this story gives voice to often-unspoken struggles.</p><a className="scene-project-details" href={cycle.url} target="_blank" rel="noopener noreferrer">View Details <span aria-hidden="true">↗</span></a></div>
  </article>
 </section>;
}
