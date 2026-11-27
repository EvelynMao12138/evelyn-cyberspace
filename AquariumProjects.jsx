import React,{useState,useEffect} from 'react';
import content from './content.json';

const captions={
 'Pocket Pixie':'A tiny AR companion for turning overwhelming tasks into small, achievable steps.',
 'Just Keep Breathing':'A wearable respiration belt turns breathing into a way to play a personal visual novel.',
 "Exhibition of Medieval Women's Daily Life":'Step into a Minecraft exhibition celebrating medieval women’s everyday expertise.',
 'My Little Planet':'Build a little ecosystem and discover how its living pieces connect.',
 'MIT MANUS Comic':'Robotic arms, games, and stroke rehabilitation—translated into a science comic.',
 'Finding James':'A playful search through the park after a lovers’ quarrel.',
 'Falling Guy':'Keep descending in a playful class project inspired by NS-SHAFT.'
};
const writingCovers={
 'The White Loong':'writing/white-loong-illustration.png',
 'People Risk Their Lives to Cross the Border, yet the White House Makes Catching Them Child’s Play':'writing/border-games-2-0.png',
 'For Some, Leaving an Abusive Partner Is Only the Beginning':'writing/covers/leaving-v1.png',
 'Who Bears Responsibility When Accessing Care: Mental Health Service Barriers at Harvard':'writing/covers/care-barriers-v1.png',
 'Secret of Shame':'writing/covers/shame-v1.png'
};
const works=content.projectGroups.flatMap((group,groupIndex)=>[0,1,3].includes(groupIndex)?group.projects.map(project=>({...project,group:groupIndex,image:writingCovers[project.name]||project.image})):[]).filter(project=>!['Just Keep Breathing','Her Cycle','The Brew Beneath'].includes(project.name));
// Start with the little companion, then make every remaining project discoverable.
works.sort((a,b)=>(a.name==='Pocket Pixie'?-1:b.name==='Pocket Pixie'?1:0));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
export default function AquariumProjects({progress,animated,onOpen}){
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false);
 const visible=progress>.97&&progress<1.04;
 useEffect(()=>{
  if(!visible||!animated||reduced||paused||hovered||focused)return;
  const timer=setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%works.length)},7000);
  return()=>clearInterval(timer);
 },[visible,animated,paused,hovered,focused,index]);
 if(!visible)return null;
 const project=works[index];
 const go=direction=>setIndex(i=>(i+direction+works.length)%works.length);
 return <aside className="aquarium-projects" aria-label="Explore more work" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false)}}>
  <header className="aquarium-projects-heading"><span className="aquarium-discovery-star" aria-hidden="true">✧</span><div><small>A LITTLE DISCOVERY</small><h2>Explore more</h2></div><button type="button" className="aquarium-autoplay" onClick={()=>setPaused(value=>!value)} aria-label={paused?'Play work slideshow':'Pause work slideshow'} aria-pressed={paused}>{paused?'▷':'Ⅱ'}</button></header>
  <div className="aquarium-project-slide" key={project.name}>
   <button className="aquarium-project-cover" type="button" onClick={event=>onOpen(project,event)} aria-label={'Explore '+project.name}><img src={import.meta.env.BASE_URL+(project.image||'breathing-screenshots/1.png')} alt={project.name+' preview'}/><span aria-hidden="true">↗</span></button>
   <div className="aquarium-project-copy"><small>{project.type}</small><h3 title={project.name}>{project.name}</h3><p>{captions[project.name]||project.desc}</p><button className="aquarium-project-link" type="button" onClick={event=>onOpen(project,event)}>{project.group===3?'Read this piece':'Discover this work'} <span aria-hidden="true">↗</span></button></div>
  </div>
  <footer className="aquarium-project-navigation"><button type="button" onClick={()=>go(-1)} aria-label="Previous featured work">‹</button><div className="aquarium-project-dots">{works.map((work,i)=><button type="button" key={work.name} onClick={()=>setIndex(i)} aria-label={'Show '+work.name} aria-current={i===index?'true':undefined}/>)}</div><button type="button" onClick={()=>go(1)} aria-label="Next featured work">›</button></footer>
 </aside>;
}
