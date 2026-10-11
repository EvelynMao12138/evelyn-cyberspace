import BubbleSkin from './BubbleSkin.jsx';
import React,{useRef,useMemo} from 'react';
import {useTexture} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
function Guide({time,stage,visibility}){
 const [texture,aquaTexture]=useTexture([import.meta.env.BASE_URL+'graduate-guide-v2.png',import.meta.env.BASE_URL+'graduate-aquarium-v1.png']),mesh=useRef(),material=useRef();
 texture.colorSpace=THREE.SRGBColorSpace;aquaTexture.colorSpace=THREE.SRGBColorSpace;
 const uniforms=useMemo(()=>({map:{value:texture},aquaMap:{value:aquaTexture},stage:{value:0},time:{value:0},opacity:{value:0}}),[texture]);
 useFrame(()=>{let t=time.current;material.current.uniforms.stage.value=stage.current;material.current.uniforms.opacity.value=visibility.current;material.current.uniforms.time.value=t;mesh.current.rotation.z=Math.sin(t*1.7)*.025;mesh.current.position.y=1.08+Math.sin(t*2.4)*.02;});
 return <mesh ref={mesh} position={[0,1.08,.08]}><planeGeometry args={[2.16*texture.image.width/texture.image.height*.29,2.16,12,24]}/><shaderMaterial ref={material} uniforms={uniforms} transparent depthWrite={false} toneMapped={false} side={THREE.DoubleSide} vertexShader={`varying vec2 v;uniform float time;void main(){v=uv;vec3 p=position;p.z+=sin(uv.y*5.+time*2.)*.025;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`} fragmentShader={`varying vec2 v;uniform sampler2D map;uniform sampler2D aquaMap;uniform float stage;uniform float time;uniform float opacity;void main(){vec2 q=v;float robe=(1.-smoothstep(.4,.58,q.y))*smoothstep(.1,.3,q.y);q.x+=sin(time*2.+q.y*10.)*.0025*robe;gl_FragColor=stage>2.5?texture2D(aquaMap,vec2(1.-q.x,q.y)):texture2D(map,vec2(q.x*.29+.075+stage*.29,q.y));gl_FragColor.a*=opacity;if(gl_FragColor.a<.03)discard;#include <colorspace_fragment>
}`.replace('discard;#include','discard;\n#include')}/></mesh>
}
export default function AeroLife({travel,animated}){
 const root=useRef(),actor=useRef(),bgroup=useRef(),drops=useRef(),time=useRef(0),stageRef=useRef(0),visibility=useRef(0),shadow=useRef();
 const bubbles=useMemo(()=>Array.from({length:12},(_,i)=>({x:Math.sin(i*12.7)*4.4,y:i*.83%5-2.5,z:-1-i%4,r:.09+i%4*.045})),[]),dummy=useMemo(()=>new THREE.Object3D(),[]);
 useFrame(({camera,size,pointer},dt)=>{if(animated&&!document.hidden)time.current+=Math.min(dt,.05);let t=time.current,z=travel.current.cameraZ;
 let progress=(5-z)/55;let g1=THREE.MathUtils.smoothstep(progress,.10,.20),g2=THREE.MathUtils.smoothstep(progress,.43,.53);
 let g3=THREE.MathUtils.smoothstep(progress,.76,.86);let s=g3>.999?3:g3>.001?-1:g2>.999?2:g1>.999&&g2<.001?1:g1<.001?0:-1;
 let settled=performance.now()-(travel.current.lastMotion||0)>90&&Math.abs(travel.current.target-travel.current.current)<.004;
 let show=settled&&s>=0;
 if(s>=0&&visibility.current<.02)stageRef.current=s;
 visibility.current=THREE.MathUtils.damp(visibility.current,show?1:0,show?10:28,Math.min(dt,.05));
 if(!show&&visibility.current<.015)visibility.current=0;
 actor.current.visible=visibility.current>.002;
 if(s>=0&&visibility.current<.02)stageRef.current=s;
 let h=8*Math.tan(Math.PI/6),w=h*size.width/size.height;
 root.current.position.set(camera.position.x,0,z-8);
 let p=[[.79,.32],[.50,.40],[.29,.30],[.76,.23]][stageRef.current];
 actor.current.position.set((p[0]-.5)*w*2,(p[1]-.5)*h*2-(1-visibility.current)*.06,0);
 actor.current.rotation.y=pointer.x*.12;
 actor.current.scale.setScalar(.76);
 shadow.current.uniforms.opacity.value=visibility.current;
 bgroup.current.children.forEach((m,i)=>{let b=bubbles[i];m.position.set(b.x+Math.sin(t*.65+i)*.35,(b.y+t*.35+3)%6-3,b.z+Math.sin(t*.4+i)*.4);});drops.current.visible=g2>.999&&progress<.76;for(let i=0;i<96;i++){let a=i*2.399,f=(t*.6+i/96)%1,r=f*.9;dummy.position.set(Math.cos(a)*r,Math.sin(f*Math.PI)*1.05,Math.sin(a)*r*.25);dummy.scale.setScalar(.015);dummy.updateMatrix();drops.current.setMatrixAt(i,dummy.matrix);}drops.current.instanceMatrix.needsUpdate=true;});
 return <group ref={root}><group ref={actor} scale={.76}><Guide time={time} stage={stageRef} visibility={visibility}/><mesh position={[0,.015,0]} rotation={[-Math.PI/2,0,0]} scale={[.54,.34,1]}><circleGeometry args={[1,48]}/><shaderMaterial ref={shadow} uniforms={{opacity:{value:0}}} transparent depthWrite={false} vertexShader="varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}" fragmentShader="varying vec2 v;uniform float opacity;void main(){gl_FragColor=vec4(.12,.22,.25,exp(-dot(v-.5,v-.5)*20.)*.28*opacity);}"/></mesh></group><group ref={bgroup}>{bubbles.map((b,i)=><mesh key={i} scale={b.r}><sphereGeometry args={[1,32,24]}/><BubbleSkin/></mesh>)}</group><instancedMesh ref={drops} args={[null,null,96]} position={[0,-.1,-.6]}><sphereGeometry args={[1,8,8]}/><meshPhysicalMaterial color="#b9f1ff" metalness={.25} roughness={.08} transparent opacity={.8}/></instancedMesh></group>
}



