import React,{useState} from 'react';
export default function YouTubePreview({project}){
 const [started,setStarted]=useState(false);
 return <div className="youtube-preview">{started?<iframe src={'https://www.youtube-nocookie.com/embed/'+project.youtubeId+'?autoplay=1&rel=0'} title={project.name+' — YouTube video'} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<button type="button" className="youtube-poster" onClick={()=>setStarted(true)} aria-label={'Play '+project.name+' video'}><img src={import.meta.env.BASE_URL+project.image} alt=""/><span className="youtube-play" aria-hidden="true">▶</span><span className="youtube-caption">Play video</span></button>}</div>
}
