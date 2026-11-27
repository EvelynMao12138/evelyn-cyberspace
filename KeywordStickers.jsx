import React from 'react';

export default function KeywordStickers(){return <div className="keyword-stickers" aria-hidden="true">
 <svg className="keyword-butterfly" viewBox="0 0 150 150">
  <defs>
   <linearGradient id="sticker-wing" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ecffff"/><stop offset=".3" stopColor="#6fe7eb"/><stop offset=".65" stopColor="#50a8ef"/><stop offset="1" stopColor="#b8b8ff"/></linearGradient>
   <linearGradient id="sticker-lower-wing" x2=".5" y2="1"><stop stopColor="#baf7ac"/><stop offset=".6" stopColor="#68dbd9"/><stop offset="1" stopColor="#79a9ec"/></linearGradient>
  </defs>
  <g fillOpacity=".42" stroke="#ecffff" strokeOpacity=".7" strokeWidth="2" strokeLinejoin="round">
   <path d="M73 77C55 17 10 10 13 46C15 70 42 89 73 87Z" fill="url(#sticker-wing)"/>
   <path d="M77 77C95 17 140 10 137 46C135 70 108 89 77 87Z" fill="url(#sticker-wing)"/>
   <path d="M71 85C27 72 22 108 39 121C56 133 70 111 75 91Z" fill="url(#sticker-lower-wing)"/>
   <path d="M79 85C123 72 128 108 111 121C94 133 80 111 75 91Z" fill="url(#sticker-lower-wing)"/>
  </g>
  <g fill="none" stroke="#f1ffff" strokeLinecap="round"><path d="M60 62C48 40 29 33 25 41M90 62C102 40 121 33 125 41" strokeWidth="6" opacity=".55"/><path d="M57 101L45 110M93 101L105 110" strokeWidth="4" opacity=".45"/><path d="M73 66Q59 43 56 51M77 66Q91 43 94 51" strokeWidth="3"/></g>
  <ellipse cx="75" cy="84" rx="5" ry="24" fill="#287db7" fillOpacity=".6" stroke="#edffff" strokeWidth="2"/>
  <ellipse cx="74" cy="75" rx="2" ry="13" fill="#c4ffff" opacity=".8"/>
 </svg>
 <span className="keyword-sticker-bubble bubble-blue"/>
 <span className="keyword-sticker-bubble bubble-lime"/>
 <span className="keyword-sticker-bubble bubble-mini"/>
 <span className="keyword-sticker-spark spark-left">✦</span><span className="keyword-sticker-spark spark-right">✧</span>
 </div>}
