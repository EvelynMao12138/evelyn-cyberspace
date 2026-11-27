import React from 'react';

export default function ManusSticker(){return <div className="manus-sticker" role="img" aria-label="MIT-MANUS rehabilitation robot arm illustration">
 <svg viewBox="0 0 260 130" aria-hidden="true">
  <defs>
   <linearGradient id="manus-metal" x2="0" y2="1"><stop stopColor="#fff"/><stop offset=".4" stopColor="#d2eaf4"/><stop offset=".52" stopColor="#83aec8"/><stop offset="1" stopColor="#d8eff7"/></linearGradient>
   <radialGradient id="manus-joint" cx=".3" cy=".2"><stop stopColor="#f1ffff"/><stop offset=".4" stopColor="#64d1ef"/><stop offset="1" stopColor="#24659d"/></radialGradient>
  </defs>
  <path d="M27 111H229" stroke="#8eb8cc" strokeWidth="2" strokeDasharray="3 5" opacity=".6"/>
  <g stroke="#f5ffff" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round">
   <path d="M37 98L45 77H78L87 98Z" fill="url(#manus-metal)"/>
   <path d="M61 79L109 35L180 65" fill="none"/>
  </g>
  <path d="M61 79L109 35L180 65" stroke="url(#manus-metal)" strokeWidth="16" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
  <path d="M64 73L105 36M117 35L173 59" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".9"/>
  {[{x:61,y:79,r:13},{x:109,y:35,r:12},{x:180,y:65,r:10}].map(j=><g key={j.x}><circle cx={j.x} cy={j.y} r={j.r} fill="url(#manus-joint)" stroke="#efffff" strokeWidth="2"/><circle cx={j.x} cy={j.y} r="4" fill="#b9e9f3" stroke="#5485a6"/></g>)}
  <path d="M180 65V42" stroke="#ecffff" strokeWidth="12" strokeLinecap="round"/><path d="M180 65V42" stroke="#346f98" strokeWidth="7" strokeLinecap="round"/>
  <path d="M195 60C213 64 215 85 195 90" fill="none" stroke="#5fc7de" strokeWidth="2" strokeDasharray="3 4"/>
  <path d="M199 86L194 91L201 93" stroke="#5fc7de" strokeWidth="2" fill="none"/>
  <path d="M222 23V37M215 30H229" stroke="#7dcbe0" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 <div><strong>MIT-MANUS</strong><span>ROBOTICS × PLAY × REHABILITATION</span></div>
 </div>}
