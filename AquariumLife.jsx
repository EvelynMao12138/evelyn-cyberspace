import BubbleSkin from './BubbleSkin.jsx';

import React,{useRef,useMemo,useEffect} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';
import * as THREE from 'three';
function TropicalFish({index,time,food,school}){
const fish=useRef(),material=useRef(),texture=useTexture(import.meta.env.BASE_URL+'tropical-fish-v2.png');texture.colorSpace=THREE.SRGBColorSpace;
const swim=useRef({velocity:new THREE.Vector3(),target:null,noticed:new WeakMap(),nextChoice:0,excitement:0,lastTime:0,initialized:false,phase:Math.random()*Math.PI*2,personality:.75+Math.random()*.5});
const scratch=useMemo(()=>({home:new THREE.Vector3(),aim:new THREE.Vector3(),desired:new THREE.Vector3(),separation:new THREE.Vector3(),offset:new THREE.Vector3()}),[]);
const uniforms=useMemo(()=>({map:{value:texture},kind:{value:index%3},time:{value:0},activity:{value:1},facing:{value:1},haze:{value:.1}}),[texture,index]);
useFrame(()=>{
 const t=time.current,state=swim.current,a=t*(.22+index*.017)+index*1.18;
 const step=Math.min(.05,Math.max(0,t-state.lastTime));state.lastTime=t;
 const {home,aim,desired,separation,offset}=scratch;
 home.set(Math.sin(a)*(1.2+index%3*.25),1+Math.sin(a*.65+index)*.75,Math.cos(a)*.55);
 if(!state.initialized){fish.current.position.copy(home);state.initialized=true;}
 const position=fish.current.position;
 school.current[index]=position;
 // Each fish notices the same food at its own time, based on its initial distance.
 for(const pellet of food.current){
  if(pellet.alive&&!state.noticed.has(pellet)){
   const distance=position.distanceTo(pellet.position);
   state.noticed.set(pellet,t+.08+distance*distance*(.24+state.personality*.1)+Math.random()*.45);
  }
 }
 if(state.target&&!state.target.alive){state.target=null;state.nextChoice=t+.3+Math.random()*.65;}
 if(!state.target&&t>=state.nextChoice){
  let best=null,score=Infinity;
  for(const pellet of food.current){
   if(!pellet.alive||t<state.noticed.get(pellet)||(pellet.chaser!==undefined&&pellet.chaser!==index))continue;
   const candidate=position.distanceToSquared(pellet.position)*( .8+ .35*Math.sin(pellet.phase+state.phase)**2);
   if(candidate<score){score=candidate;best=pellet;}
  }
  if(best){best.chaser=index;state.target=best;state.excitement=THREE.MathUtils.clamp(1-position.distanceTo(best.position)/3,.12,1);}
  state.nextChoice=t+.25+Math.random()*.65;
 }
 let speed=.42*state.personality;
 if(state.target){
  const distance=position.distanceTo(state.target.position);
  aim.copy(state.target.position);
  // Approach on a changing arc; straighten only for the final nibble.
  const bend=Math.min(.55,distance*.32)*Math.min(1,distance/.25);
  aim.x+=Math.sin(t*1.8+state.phase)*bend;
  aim.y+=Math.cos(t*1.25+state.phase)*bend*.6;
  aim.z+=Math.sin(t*1.5+state.phase)*bend*.4;
  const burst=.8+.32*Math.sin(t*(4+state.personality)+state.phase)+.12*Math.sin(t*9+index);
  speed=(.7+state.excitement*1.25)*state.personality*burst;
  speed*=THREE.MathUtils.clamp(distance/.28,.25,1);
  if(distance<.13){state.target.alive=false;state.target=null;state.nextChoice=t+.35+Math.random()*.8;}
 }else{
  aim.copy(home);aim.x+=Math.sin(t*.9+state.phase)*.2;aim.y+=Math.cos(t*.7+state.phase)*.12;
 }
 desired.copy(aim).sub(position);
 if(desired.lengthSq()>.001)desired.normalize().multiplyScalar(speed);
 // A little personal space prevents a pile of fish at the feeding point.
 separation.set(0,0,0);
 for(let i=0;i<school.current.length;i++){
  const other=school.current[i];if(i===index||!other)continue;
  offset.copy(position).sub(other);const distance=offset.length();
  if(distance>.001&&distance<.5)separation.addScaledVector(offset,(.5-distance)/(distance*.5));
 }
 desired.addScaledVector(separation,.65);
 state.velocity.lerp(desired,1-Math.exp(-(state.target?3.5:1.7)*step));
 position.addScaledVector(state.velocity,step);
 // Keep detours inside the aquarium.
 offset.set(position.x,position.y-1.1,position.z);
 if(offset.length()>2.18){offset.setLength(2.18);position.copy(offset);position.y+=1.1;state.velocity.multiplyScalar(.8);}
 const heading=state.velocity.x<0?-1:1;
 const tilt=THREE.MathUtils.clamp(Math.atan2(state.velocity.y,Math.max(.25,Math.abs(state.velocity.x)))*heading,-.35,.35);
 fish.current.rotation.z=THREE.MathUtils.damp(fish.current.rotation.z,tilt+Math.sin(t*3+state.phase)*.025,4,step);
 fish.current.rotation.y=Math.sin(a)*.12;
 material.current.uniforms.time.value=t+index;
 material.current.uniforms.activity.value=state.target?1+state.excitement:1;
 if(Math.abs(state.velocity.x)>.035)material.current.uniforms.facing.value=THREE.MathUtils.damp(material.current.uniforms.facing.value,heading,7,step);
 material.current.uniforms.haze.value=.12+(1-Math.cos(a))*.08;
});
return <mesh ref={fish} scale={.72+index%3*.12}><planeGeometry args={[1,1,32,20]}/><shaderMaterial ref={material} uniforms={uniforms} transparent depthWrite={false} toneMapped={false} side={THREE.DoubleSide} vertexShader={"varying vec2 v;uniform float time;uniform float activity;uniform float facing;void main(){v=uv;vec3 p=position;float tail=1.-smoothstep(.12,.45,uv.x);p.y+=sin(time*(8.+activity*2.)+uv.x*12.)*(.035+activity*.012)*tail;p.z+=sin(time*(7.+activity*2.)+uv.x*10.)*.07*tail;p.x*=facing;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}"} fragmentShader={"varying vec2 v;uniform sampler2D map;uniform float kind;uniform float time;uniform float haze;void main(){vec2 q=v;q.y+=sin(q.x*20.+time*1.2)*.002;vec4 c=texture2D(map,vec2((q.x+kind)/3.,q.y));if(c.a<.02)discard;c.rgb*=vec3(.78,.93,.97);c.rgb=mix(c.rgb,vec3(.12,.5,.64),haze);float wave=pow(max(0.,sin(v.x*20.+time*.9)*cos(v.y*24.-time*.6)),6.);c.rgb+=wave*vec3(.07,.14,.16);gl_FragColor=vec4(c.rgb,c.a*.94);\n#include <colorspace_fragment>\n}"}/></mesh>;
}
export default function AquariumLife({travel,animated}){
 const root=useRef(),bubbles=useRef(),time=useRef(0),water=useRef(),pellets=useRef(),food=useRef([]),school=useRef([]);
 const {camera,gl}=useThree();
 const pelletDummy=useMemo(()=>new THREE.Object3D(),[]);
 useEffect(()=>{
  let press=null;
  const down=e=>{press={x:e.clientX,y:e.clientY};};
  const feed=e=>{
   if(!press||Math.hypot(e.clientX-press.x,e.clientY-press.y)>8||Math.abs(travel.current.current-.75)>.025)return;
   press=null;
   if(e.button!==0||e.target.closest?.('button,a,input,textarea,iframe,.station-overlay,.portfolio-reader,.aquarium-projects'))return;
   const bounds=gl.domElement.getBoundingClientRect();
   const pointer=new THREE.Vector2((e.clientX-bounds.left)/bounds.width*2-1,-(e.clientY-bounds.top)/bounds.height*2+1);
   const ray=new THREE.Raycaster();ray.setFromCamera(pointer,camera);
   const hit=new THREE.Vector3();
   if(!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1),-root.current.position.z),hit))return;
   const local=root.current.worldToLocal(hit);
   if(local.x*local.x+(local.y-1.1)**2>2.35**2)return;
   food.current=food.current.filter(p=>p.alive);
   if(food.current.length>84)return;
   window.dispatchEvent(new CustomEvent('aquarium-feed-sound'));
   for(let i=0;i<7;i++){
    food.current.push({alive:true,age:0,phase:Math.random()*6.28,radius:.025+Math.random()*.018,position:new THREE.Vector3(local.x+(Math.random()-.5)*.26,local.y+(Math.random()-.5)*.15,-.12+Math.random()*.22)});
   }
  };
  window.addEventListener('pointerdown',down);window.addEventListener('pointerup',feed);
  return()=>{window.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',feed);};
 },[camera,gl,travel]);
 const seeds=useMemo(()=>Array.from({length:24},(_,i)=>({x:Math.sin(i*7.3)*1.75,z:Math.cos(i*9.2)*.65,r:.025+(i%5)*.009,phase:i/24})),[]);
 useFrame(({camera,size},dt)=>{
 if(animated&&!document.hidden)time.current+=Math.min(dt,.05);
 const progress=travel.current.current*4/3;water.current.uniforms.time.value=time.current;
 const step=animated&&!document.hidden?Math.min(dt,.05):0;
 if(progress<.86||progress>1.08)food.current=[];
 food.current.forEach(p=>{if(!p.alive)return;p.age+=step;p.position.y-=step*.15;p.position.x+=Math.sin(time.current*1.4+p.phase)*step*.025;if(p.age>14||p.position.y<-.8)p.alive=false;});
 for(let i=0;i<96;i++){
  const p=food.current[i];
  if(p)pelletDummy.position.copy(p.position);else pelletDummy.position.set(0,0,0);
  pelletDummy.scale.setScalar(p?.alive?p.radius*Math.min(1,(14-p.age)*2):0);
  pelletDummy.updateMatrix();pellets.current.setMatrixAt(i,pelletDummy.matrix);
 }
 pellets.current.instanceMatrix.needsUpdate=true;
 root.current.visible=progress>.86&&progress<1.08;
 root.current.position.set(camera.position.x,0,travel.current.cameraZ-8);
 const aspect=size.width/size.height;
 // Match the source sphere's apparent height when the image is cropped on narrow screens.
 root.current.scale.setScalar(aspect>1.777?aspect/1.777:1);
 bubbles.current.children.forEach((m,i)=>{let s=seeds[i],y=(s.phase+time.current*(.10+(i%3)*.025))%1*3.6-.85;m.position.set(s.x+Math.sin(time.current*.8+i)*.08,y,s.z);m.scale.setScalar(s.r*Math.min(1,(2.85-y)*3));});
 });
 return <group ref={root}><instancedMesh ref={pellets} args={[null,null,96]} frustumCulled={false} renderOrder={1}><icosahedronGeometry args={[1,1]}/><meshPhysicalMaterial color="#98633d" transparent opacity={.55} roughness={.22} metalness={.05} clearcoat={1} clearcoatRoughness={.12} depthWrite={false}/></instancedMesh>{Array.from({length:9},(_,i)=><TropicalFish key={i} index={i} time={time} food={food} school={school}/>)}<group ref={bubbles}>{seeds.map((s,i)=><mesh key={i}><sphereGeometry args={[1,20,16]}/><BubbleSkin/></mesh>)}</group><mesh position={[0,1.1,1.5]} renderOrder={3}><circleGeometry args={[2.55,64]}/><shaderMaterial ref={water} uniforms={{time:{value:0}}} transparent depthWrite={false} toneMapped={false} vertexShader={"varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}"} fragmentShader={"varying vec2 v;uniform float time;void main(){vec2 p=v-.5;float r=length(p)*2.;float mask=1.-smoothstep(.88,1.,r);float wave=pow(max(0.,sin(v.x*54.+sin(v.y*39.+time*.7)*2.+time*.6)*cos(v.y*47.+time*.5)),8.);float sheen=exp(-pow((v.x-v.y*.3-.23-sin(time*.3)*.015)*22.,2.));gl_FragColor=vec4(.62,.92,1.,mask*(wave*.10+sheen*.035));}"}/></mesh></group>
}
