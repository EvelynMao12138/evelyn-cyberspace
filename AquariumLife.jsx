import BubbleSkin from './BubbleSkin.jsx';

import React,{useRef,useMemo} from 'react';
import {useFrame} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';
import * as THREE from 'three';
function TropicalFish({index,time}){
const fish=useRef(),material=useRef(),texture=useTexture(import.meta.env.BASE_URL+'tropical-fish-v2.png');texture.colorSpace=THREE.SRGBColorSpace;
const uniforms=useMemo(()=>({map:{value:texture},kind:{value:index%3},time:{value:0},facing:{value:1},haze:{value:.1}}),[texture,index]);
useFrame((_,dt)=>{const t=time.current,a=t*(.22+index*.017)+index*1.18;fish.current.position.set(Math.sin(a)*(1.2+index%3*.25),1+Math.sin(a*.65+index)*.75,Math.cos(a)*.55);fish.current.rotation.z=Math.cos(a*.65+index)*.065;fish.current.rotation.y=Math.sin(a)*.16;material.current.uniforms.time.value=t+index;material.current.uniforms.facing.value=THREE.MathUtils.damp(material.current.uniforms.facing.value,Math.cos(a)>=0?1:-1,4,dt);material.current.uniforms.haze.value=.12+(1-Math.cos(a))*.08;});
return <mesh ref={fish} scale={.72+index%3*.12}><planeGeometry args={[1,1,32,20]}/><shaderMaterial ref={material} uniforms={uniforms} transparent depthWrite={false} toneMapped={false} side={THREE.DoubleSide} vertexShader={"varying vec2 v;uniform float time;uniform float facing;void main(){v=uv;vec3 p=position;float tail=1.-smoothstep(.12,.45,uv.x);p.y+=sin(time*8.+uv.x*12.)*.045*tail;p.z+=sin(time*7.+uv.x*10.)*.07*tail;p.x*=facing;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}"} fragmentShader={"varying vec2 v;uniform sampler2D map;uniform float kind;uniform float time;uniform float haze;void main(){vec2 q=v;q.y+=sin(q.x*20.+time*1.2)*.002;vec4 c=texture2D(map,vec2((q.x+kind)/3.,q.y));if(c.a<.02)discard;c.rgb*=vec3(.78,.93,.97);c.rgb=mix(c.rgb,vec3(.12,.5,.64),haze);float wave=pow(max(0.,sin(v.x*20.+time*.9)*cos(v.y*24.-time*.6)),6.);c.rgb+=wave*vec3(.07,.14,.16);gl_FragColor=vec4(c.rgb,c.a*.94);\n#include <colorspace_fragment>\n}"}/></mesh>;
}
export default function AquariumLife({travel,animated}){
 const root=useRef(),bubbles=useRef(),time=useRef(0),water=useRef();
 const seeds=useMemo(()=>Array.from({length:24},(_,i)=>({x:Math.sin(i*7.3)*1.75,z:Math.cos(i*9.2)*.65,r:.025+(i%5)*.009,phase:i/24})),[]);
 useFrame(({camera,size},dt)=>{
 if(animated&&!document.hidden)time.current+=Math.min(dt,.05);
 const progress=travel.current.current;water.current.uniforms.time.value=time.current;
 root.current.visible=progress>.86;
 root.current.position.set(camera.position.x,0,travel.current.cameraZ-8);
 const aspect=size.width/size.height;
 // Match the source sphere's apparent height when the image is cropped on narrow screens.
 root.current.scale.setScalar(aspect>1.777?aspect/1.777:1);
 bubbles.current.children.forEach((m,i)=>{let s=seeds[i],y=(s.phase+time.current*(.10+(i%3)*.025))%1*3.6-.85;m.position.set(s.x+Math.sin(time.current*.8+i)*.08,y,s.z);m.scale.setScalar(s.r*Math.min(1,(2.85-y)*3));});
 });
 return <group ref={root}>{Array.from({length:9},(_,i)=><TropicalFish key={i} index={i} time={time}/>)}<group ref={bubbles}>{seeds.map((s,i)=><mesh key={i}><sphereGeometry args={[1,20,16]}/><BubbleSkin/></mesh>)}</group><mesh position={[0,1.1,1.5]} renderOrder={3}><circleGeometry args={[2.55,64]}/><shaderMaterial ref={water} uniforms={{time:{value:0}}} transparent depthWrite={false} toneMapped={false} vertexShader={"varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}"} fragmentShader={"varying vec2 v;uniform float time;void main(){vec2 p=v-.5;float r=length(p)*2.;float mask=1.-smoothstep(.88,1.,r);float wave=pow(max(0.,sin(v.x*54.+sin(v.y*39.+time*.7)*2.+time*.6)*cos(v.y*47.+time*.5)),8.);float sheen=exp(-pow((v.x-v.y*.3-.23-sin(time*.3)*.015)*22.,2.));gl_FragColor=vec4(.62,.92,1.,mask*(wave*.10+sheen*.035));}"}/></mesh></group>
}
