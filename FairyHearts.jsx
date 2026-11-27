import React,{useEffect,useRef,useState} from 'react';

export default function FairyHearts(){
 const [hearts,setHearts]=useState([]),nextId=useRef(0),timers=useRef(new Set());
 useEffect(()=>{
  const burst=({detail:{x,y}})=>{
   const particles=Array.from({length:9},()=>({id:nextId.current++,x,y,size:22+Math.random()*21,dx:(Math.random()-.5)*190,rise:100+Math.random()*125,delay:Math.random()*.18}));
   setHearts(current=>[...current,...particles].slice(-54));
   const timer=setTimeout(()=>{const ids=new Set(particles.map(p=>p.id));setHearts(current=>current.filter(p=>!ids.has(p.id)));timers.current.delete(timer)},2200);
   timers.current.add(timer);
  };
  window.addEventListener('fairy-heart-burst',burst);
  return()=>{window.removeEventListener('fairy-heart-burst',burst);timers.current.forEach(clearTimeout);timers.current.clear()};
 },[]);
 return <div className="fairy-heart-layer" aria-hidden="true">{hearts.map(h=><span key={h.id} className="fairy-heart-bubble" style={{left:h.x,top:h.y,width:h.size,height:h.size,'--heart-dx':h.dx+'px','--heart-rise':-h.rise+'px',animationDelay:h.delay+'s'}}><svg viewBox="0 0 64 64" width="100%" height="100%"><defs><radialGradient id={'heart-fill-'+h.id} cx=".3" cy=".2" r=".85"><stop stopColor="#fff5fc" stopOpacity=".65"/><stop offset=".35" stopColor="#ffc2e7" stopOpacity=".12"/><stop offset=".7" stopColor="#f18fc9" stopOpacity=".3"/><stop offset="1" stopColor="#ffd3ee" stopOpacity=".85"/></radialGradient></defs><path d="M32 56C26 51 6 37 6 22C6 7 24 4 32 17C40 4 58 7 58 22C58 37 38 51 32 56Z" fill={'url(#heart-fill-'+h.id+')'} stroke="#ffe8f6" strokeWidth="1.5"/><path d="M12 24C10 14 20 10 25 15" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".85"/><path d="M52 27C50 36 40 46 34 50" fill="none" stroke="#ffafe0" strokeWidth="2" strokeLinecap="round" opacity=".7"/></svg></span>)}</div>;
}
