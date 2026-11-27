import React,{useState} from 'react';
const photos=[
 {file:1,width:1446,height:960,crop:[445,110,480,600]},
 {file:7,width:1280,height:1707,crop:[0,0,1280,1707]},
 {file:2,width:1280,height:1707,crop:[495,510,480,600]},
 {file:3,width:1280,height:1920,crop:[300,650,460,575]},
 {file:4,width:1279,height:1919,crop:[260,370,850,1062.5]},
 {file:6,width:960,height:1440,crop:[160,630,500,625]}
];
export default function PortraitGallery({progress}){
 const [index,setIndex]=useState(0),photo=photos[index],hidden=progress>.10;
 const [x,y,w,h]=photo.crop;
 const change=direction=>setIndex(i=>(i+direction+photos.length)%photos.length);

 return <aside className="portrait-gallery" aria-label="Evelyn's photo album" aria-hidden={hidden} inert={hidden?true:undefined} style={{opacity:Math.max(0,1-progress*12)}}>
  <div className="portrait-titlebar"><span className="portrait-orb"/><span>Evelyn · Photo Album</span><span className="portrait-sparkle" aria-hidden="true">✧</span></div>
  <div className="portrait-screen" onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();change(-1)}if(e.key==='ArrowRight'){e.preventDefault();change(1)}}} tabIndex={hidden?-1:0} aria-label="Portrait. Use left and right arrows to change photo">
   <img key={index} src={import.meta.env.BASE_URL+`evelyn-portrait-${photo.file}.jpg`} alt={`Evelyn Mao — portrait ${index+1} of ${photos.length}`} style={index===0?{width:photo.width/w*100+'%',height:'auto',left:-x/w*100+'%',top:-y/h*100+'%'}:{width:'100%',height:'100%',left:0,top:0,objectFit:'cover',objectPosition:'center'}}/>
   <span className="portrait-gloss" aria-hidden="true"/>
  </div>
  <div className="portrait-toolbar"><button aria-label="Previous photo" onClick={()=>change(-1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><span className="portrait-pagination" aria-live="polite"><b>{String(index+1).padStart(2,'0')}</b><span> / 06</span></span><button aria-label="Next photo" onClick={()=>change(1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button></div>
 </aside>
}





