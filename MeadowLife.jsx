import React,{useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import BubbleSkin from './BubbleSkin.jsx';

export default function MeadowLife({travel,animated}){
 const root=useRef(),time=useRef(0);
 const seeds=useMemo(()=>Array.from({length:9},(_,i)=>({x:(Math.sin(i*7.13)*.5+.5)*.82+.09,phase:i/9,speed:.018+(i%3)*.004,r:.16+(i%4)*.08,z:-.7+(i%3)*.6})),[]);
 useFrame(({camera,size},dt)=>{
  if(animated&&!document.hidden)time.current+=Math.min(dt,.05);
  const appear=Math.max(0,Math.min(1,(travel.current.current-.87)/.08));
  root.current.visible=appear>0;
  if(!root.current.visible)return;
  root.current.position.set(camera.position.x,0,travel.current.cameraZ-8);
  const height=16*Math.tan(Math.PI/6),width=height*size.width/size.height,t=time.current;
  root.current.children.forEach((mesh,i)=>{
   const seed=seeds[i],phase=(seed.phase+t*seed.speed)%1;
   const fade=Math.min(1,phase*10,(1-phase)*10)*appear;
   mesh.position.set((seed.x-.5)*width+Math.sin(t*.42+i*1.7)*.24,(phase-.5)*height*1.18,seed.z);
   mesh.position.x-=camera.position.x*.4;
   mesh.rotation.y=t*.035+i;mesh.rotation.z=Math.sin(t*.3+i)*.12;
   mesh.scale.setScalar(seed.r*Math.sqrt(Math.max(0,fade)));
  });
 });
 return <group ref={root}>{seeds.map((seed,i)=><mesh key={i} renderOrder={5}><sphereGeometry args={[1,36,24]}/><BubbleSkin strength={1.7} iridescence={.95} time={time}/></mesh>)}</group>;
}
