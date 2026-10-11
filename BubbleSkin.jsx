import React from 'react';
// Thin soap film: transparent center, Fresnel rim and reflected softbox highlights.
export default function BubbleSkin(){return <shaderMaterial transparent depthWrite={false} toneMapped={false} vertexShader={`varying vec3 n;varying vec3 eye;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);eye=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`} fragmentShader={`varying vec3 n;varying vec3 eye;void main(){vec3 N=normalize(n);float f=pow(1.-max(0.,dot(N,normalize(eye))),3.);float rim=pow(f,.7);float arc=exp(-pow((N.x+.42)*8.,2.)-pow((N.y-.62)*5.,2.));float glint=exp(-pow((N.x-.48)*14.,2.)-pow((N.y+.55)*12.,2.));vec3 film=.65+.35*cos(vec3(0.,2.1,4.2)+atan(N.y,N.x)*2.+f*5.);vec3 c=mix(vec3(.88,.97,1.),film,.30*f);c=mix(c,vec3(1.),clamp(arc+glint,0.,1.));float a=clamp(.008+rim*.40+arc*.78+glint*.7,0.,.9);gl_FragColor=vec4(c,a);
#include <colorspace_fragment>
}`}/>}
