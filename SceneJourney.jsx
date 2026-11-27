import {buildMeadowForeground} from './MeadowForeground.js';
import MeadowLife from './MeadowLife.jsx';
import React,{useMemo,useRef,useEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import {useTexture,Environment,Lightformer} from '@react-three/drei';
import * as THREE from 'three';
import {wallpaperShader} from './wallpaperShader.js';
import AeroLife from './AeroLife.jsx';
import AquariumLife from './AquariumLife.jsx';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
export default function SceneJourney({travel,animated}){
 const textures=useTexture([import.meta.env.BASE_URL+'aero-carriage-v2.png',import.meta.env.BASE_URL+'aero-link-v2.png',import.meta.env.BASE_URL+'aero-plaza-v2.png',import.meta.env.BASE_URL+'aero-aquarium-v1.png',import.meta.env.BASE_URL+'aero-rainbow-meadow-v5.png',import.meta.env.BASE_URL+'meadow-cloud-v1.png',import.meta.env.BASE_URL+'meadow-cloud-wisps-v1.png',import.meta.env.BASE_URL+'meadow-cloud-puffs-v1.png',import.meta.env.BASE_URL+'meadow-plane-realistic-v1.png']);
 const foreground=useMemo(()=>{
  const matte=buildMeadowForeground(textures[4].image),texture=new THREE.DataTexture(matte.data,matte.width,matte.height,THREE.RedFormat,THREE.UnsignedByteType);
  texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=false;texture.needsUpdate=true;return texture;
 },[textures]);
 useEffect(()=>()=>foreground.dispose(),[foreground]);
 const cloudBounds=useMemo(()=>{
  const {data,width,height}=foreground.image;
  return [0,1,2].map(i=>{
   const center=.77+i*.065,halfHeight=[.16,.10,.12][i]/2;
   let left=.99,right=0;
   for(let y=Math.max(0,Math.floor((center-halfHeight)*height));y<Math.min(height,Math.ceil((center+halfHeight)*height));y+=2){
    for(let x=Math.floor(width*.20);x<width*.84;x+=2){if(data[y*width+x]<128){left=Math.min(left,x/width);right=Math.max(right,x/width);}}
   }
   return new THREE.Vector2(left<right?left:.32,left<right?right:.75);
  });
 },[foreground]);
 const mat=useRef(),elapsed=useRef(0),mouse=useRef(new THREE.Vector2());
 useEffect(()=>{
  const move=e=>mouse.current.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);
  const reset=()=>mouse.current.set(0,0);
  window.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',reset);
  return()=>{window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',reset);};
 },[]);
 useEffect(()=>{textures.forEach(texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=false;texture.needsUpdate=true;});},[textures]);
 const uniforms=useMemo(()=>({scene0:{value:textures[0]},scene1:{value:textures[1]},scene2:{value:textures[2]},scene3:{value:textures[3]},scene4:{value:textures[4]},meadowForeground:{value:foreground},meadowCloudBounds:{value:cloudBounds},meadowPlane:{value:textures[8]},meadowPlaneAspect:{value:textures[8].image.width/textures[8].image.height},meadowCloud:{value:textures[5]},meadowCloudWisps:{value:textures[6]},meadowCloudPuffs:{value:textures[7]},cameraZ:{value:5},aspect:{value:1},imageAspect:{value:1.777},pointer:{value:new THREE.Vector2()},motion:{value:1},meadowTexel:{value:new THREE.Vector2(1/1672,1/941)},reduced:{value:reduced?1:0},time:{value:0},texel:{value:new THREE.Vector2(1/1672,1/941)}}),[textures,foreground,cloudBounds]);
 useFrame(({size,camera},dt)=>{
  const pointer=mouse.current;mat.current.uniforms.motion.value=animated&&!reduced?1:0;
  mat.current.uniforms.meadowTexel.value.set(1/textures[4].image.width,1/textures[4].image.height);
  if(animated&&!reduced&&!document.hidden)elapsed.current+=Math.min(dt,.05);mat.current.uniforms.time.value=elapsed.current;mat.current.uniforms.texel.value.set(1/textures[0].image.width,1/textures[0].image.height);
  const t=travel.current;t.current=reduced?t.target:THREE.MathUtils.damp(t.current,t.target,18,Math.min(dt,.05));
  t.cameraZ=5-t.current*(55*4/3);camera.position.set(reduced?0:pointer.x*.025,0,t.cameraZ);camera.lookAt(t.current>.82?camera.position.x:0,0,t.cameraZ-10);
  mat.current.uniforms.cameraZ.value=t.cameraZ;mat.current.uniforms.aspect.value=size.width/size.height;
  mat.current.uniforms.imageAspect.value=textures[0].image.width/textures[0].image.height;
  mat.current.uniforms.pointer.value.lerp(pointer,1-Math.exp(-3*dt));
  document.documentElement.style.setProperty('--travel',t.current);
 });
 return <><mesh frustumCulled={false} renderOrder={-10}><planeGeometry args={[2,2]}/><shaderMaterial ref={mat} uniforms={uniforms} depthTest={false} depthWrite={false} vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,.999,1.);}`} fragmentShader={wallpaperShader} toneMapped={false}/></mesh><Environment resolution={64}><Lightformer position={[0,5,0]} scale={[20,20,1]} intensity={3}/><Lightformer position={[0,0,12]} scale={[20,20,1]} intensity={3}/></Environment><ambientLight intensity={1.5}/><directionalLight position={[4,8,5]} intensity={2}/><AeroLife travel={travel} animated={animated&&!reduced}/><AquariumLife travel={travel} animated={animated&&!reduced}/><MeadowLife travel={travel} animated={animated&&!reduced}/></>
}






