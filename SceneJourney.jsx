import React,{useMemo,useRef,useEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import {useTexture,Environment,Lightformer} from '@react-three/drei';
import * as THREE from 'three';
import {wallpaperShader} from './wallpaperShader.js';
import AeroLife from './AeroLife.jsx';
import AquariumLife from './AquariumLife.jsx';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
export default function SceneJourney({travel,animated}){
 const textures=useTexture([import.meta.env.BASE_URL+'aero-carriage-v2.png',import.meta.env.BASE_URL+'aero-link-v2.png',import.meta.env.BASE_URL+'aero-plaza-v2.png',import.meta.env.BASE_URL+'aero-aquarium-v1.png']);
 const mat=useRef(),elapsed=useRef(0);
 useEffect(()=>{textures.forEach(texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=false;texture.needsUpdate=true;});},[textures]);
 const uniforms=useMemo(()=>({scene0:{value:textures[0]},scene1:{value:textures[1]},scene2:{value:textures[2]},scene3:{value:textures[3]},cameraZ:{value:5},aspect:{value:1},imageAspect:{value:1.777},pointer:{value:new THREE.Vector2()},reduced:{value:reduced?1:0},time:{value:0},texel:{value:new THREE.Vector2(1/1672,1/941)}}),[textures]);
 useFrame(({size,pointer,camera},dt)=>{
  if(animated&&!reduced&&!document.hidden)elapsed.current+=Math.min(dt,.05);mat.current.uniforms.time.value=elapsed.current;mat.current.uniforms.texel.value.set(1/textures[0].image.width,1/textures[0].image.height);
  const t=travel.current;t.current=reduced?t.target:THREE.MathUtils.damp(t.current,t.target,18,Math.min(dt,.05));
  t.cameraZ=5-t.current*55;camera.position.set(reduced?0:pointer.x*.025,0,t.cameraZ);camera.lookAt(0,0,t.cameraZ-10);
  mat.current.uniforms.cameraZ.value=t.cameraZ;mat.current.uniforms.aspect.value=size.width/size.height;
  mat.current.uniforms.imageAspect.value=textures[0].image.width/textures[0].image.height;
  mat.current.uniforms.pointer.value.lerp(pointer,1-Math.exp(-3*dt));
  document.documentElement.style.setProperty('--travel',t.current);
 });
 return <><mesh frustumCulled={false} renderOrder={-10}><planeGeometry args={[2,2]}/><shaderMaterial ref={mat} uniforms={uniforms} depthTest={false} depthWrite={false} vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,.999,1.);}`} fragmentShader={wallpaperShader} toneMapped={false}/></mesh><Environment resolution={64}><Lightformer position={[0,5,0]} scale={[20,20,1]} intensity={3}/><Lightformer position={[0,0,12]} scale={[20,20,1]} intensity={3}/></Environment><ambientLight intensity={1.5}/><directionalLight position={[4,8,5]} intensity={2}/><AeroLife travel={travel} animated={animated&&!reduced}/><AquariumLife travel={travel} animated={animated&&!reduced}/></>
}






