import React,{useEffect,useRef,useState} from 'react';
export default function BreathingPreview(){
 const [index,setIndex]=useState(0),[visible,setVisible]=useState(false),[playing,setPlaying]=useState(true);
 const root=useRef(null),track=useRef(null),videos=useRef([]);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.35});observer.observe(root.current);return()=>observer.disconnect()},[]);
 useEffect(()=>{videos.current.forEach((video,i)=>{if(!video)return;if(i===index&&visible&&playing&&!reduced){video.play().catch(()=>{})}else video.pause()})},[index,visible,playing,reduced]);
 const go=i=>{const next=(i+6)%6;track.current?.scrollTo({left:track.current.clientWidth*next,behavior:reduced?'instant':'smooth'})};
 return <div className="breathing-preview" ref={root} aria-label="Just Keep Breathing video previews">
  <div className="breathing-track" ref={track} onScroll={e=>setIndex(Math.round(e.currentTarget.scrollLeft/e.currentTarget.clientWidth))}>
   {[1,2,3,4,5,6].map((n,i)=><video key={n} ref={el=>videos.current[i]=el} src={import.meta.env.BASE_URL+`breathing-preview/${n}.mp4`} muted playsInline preload={i===index?'auto':'metadata'} onEnded={()=>go(index+1)} aria-label={`Just Keep Breathing preview ${n} of 6`}/>)}
  </div>
  <div className="breathing-toolbar"><button type="button" onClick={()=>go(index-1)} aria-label="Previous Breathing preview">‹</button><span>{String(index+1).padStart(2,'0')} / 06</span><button type="button" onClick={()=>setPlaying(v=>!v)} aria-label={playing?'Pause Breathing preview':'Play Breathing preview'}>{playing?'Ⅱ':'▷'}</button><button type="button" onClick={()=>go(index+1)} aria-label="Next Breathing preview">›</button></div>
 </div>
}
