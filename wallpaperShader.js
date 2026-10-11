export const wallpaperShader = `
uniform sampler2D scene0;uniform sampler2D scene1;uniform sampler2D scene2;uniform sampler2D scene3;
uniform float cameraZ;uniform float aspect;uniform float imageAspect;
uniform vec2 pointer;uniform float reduced;uniform float time;uniform vec2 texel;
varying vec2 vUv;
vec2 cover(vec2 uv){if(aspect>imageAspect)uv.y=(uv.y-.5)*imageAspect/aspect+.5;else uv.x=(uv.x-.5)*aspect/imageAspect+.5;return uv;}
float gate(float z){
 float travel=(5.-cameraZ)/55.;
 float progress=z> -20.?smoothstep(.10,.20,travel):z> -45.?smoothstep(.43,.53,travel):smoothstep(.76,.86,travel);
 vec2 p=(vUv-vec2(.5,.53))*vec2(aspect,1.);
 float distance=length(p)/length(vec2(aspect*.5,.53));
 float radius=mix(-.22,1.22,progress);
 return 1.-smoothstep(radius-.18,radius+.18,distance);
}
float ellipse(vec2 uv,vec2 center,vec2 radius){return 1.-smoothstep(.7,1.,length((uv-center)/radius));}
vec3 animateScene(sampler2D scene,vec2 uv,float index){
 vec3 base=texture2D(scene,uv).rgb;
 // Color and region masks keep the architecture and lettering still.
 float grass=smoothstep(.025,.16,base.g-max(base.r,base.b))*(1.-smoothstep(.50,.64,uv.y));
 // Erode the green mask so displaced samples cannot pull architecture into the lawn.
 vec3 edgeA=texture2D(scene,uv+vec2(.006,0.)).rgb;
 vec3 edgeB=texture2D(scene,uv-vec2(.006,0.)).rgb;
 vec3 edgeC=texture2D(scene,uv+vec2(0.,.004)).rgb;
 vec3 edgeD=texture2D(scene,uv-vec2(0.,.004)).rgb;
 float innerGreen=min(min(edgeA.g-max(edgeA.r,edgeA.b),edgeB.g-max(edgeB.r,edgeB.b)),min(edgeC.g-max(edgeC.r,edgeC.b),edgeD.g-max(edgeD.r,edgeD.b)));
 grass*=smoothstep(.03,.12,innerGreen);
 vec2 jetCenter=index<.5?vec2(.509,.513):index<1.5?vec2(.503,.510):vec2(.502,.553);
 vec2 jetRadius=index<.5?vec2(.045,.038):index<1.5?vec2(.084,.055):vec2(.145,.078);
 float jets=ellipse(uv,jetCenter,jetRadius);
 float floorWater=(1.-smoothstep(.12,.40,uv.y))*smoothstep(.04,.25,base.b-base.r*.8);
 float sideWater=ellipse(uv,vec2(.22,.43),vec2(.115,.038))+ellipse(uv,vec2(.80,.43),vec2(.10,.035));
 float water=clamp(floorWater*.25+sideWater*.7+jets*.45,0.,1.);
 vec2 offset=vec2(sin(time*.72+uv.y*150.+uv.x*13.)*.0018,sin(time*.55+uv.x*120.)*.0007)*grass;
 offset+=vec2(sin(uv.y*290.+time*1.15)*.00065,cos(uv.x*170.-time*.8)*.0003)*water;
 offset.y+=sin(uv.y*470.-time*4.)*.0007*jets;
 // Slow wind crosses the lawn; the skyline and hard surfaces remain anchored.
 offset.x+=sin(time*1.1-uv.x*32.+uv.y*17.)*.0008*grass;
 float openSky=smoothstep(.72,.84,uv.y)*smoothstep(.04,.18,uv.x)*(1.-smoothstep(.82,.96,uv.x));
 float blueSky=smoothstep(.03,.14,base.b-base.r);
 float brightCloud=smoothstep(.65,.91,min(base.r,min(base.g,base.b)));
 float skyRegion=index<.5?ellipse(uv,vec2(.505,.66),vec2(.095,.07)):index<1.5?ellipse(uv,vec2(.5,.69),vec2(.18,.09)):openSky;
 float skyMask=skyRegion*clamp(blueSky+brightCloud,0.,1.)*(index<.5?.16:index<1.5?.3:1.);
 // Spatial islands sit entirely above the skyline, with a margin for drift.
 // Do not use blue/white color selection: those colors also occur on tower edges.
 float cloudIsland=index<.5?ellipse(uv,vec2(.505,.69),vec2(.043,.018)):
 index<1.5?ellipse(uv,vec2(.50,.75),vec2(.075,.027)):
 index<2.5?ellipse(uv,vec2(.44,.895),vec2(.18,.105)):0.;
 offset+=vec2(sin(time*.23)*.0065,sin(time*.17)*.0015)*cloudIsland;
 if(index>2.5){float tank=ellipse(uv,vec2(.5,.62),vec2(.225,.35));offset+=vec2(sin(uv.y*80.+time*1.3),cos(uv.x*70.-time*.9))*.0018*tank;}
 offset*=1.-reduced;
 vec2 sampleUV=clamp(uv+offset,vec2(.001),vec2(.999));
 vec3 color=texture2D(scene,sampleUV).rgb;
 // Small unsharp mask restores fine texture lost to GPU resampling.
 vec3 neighbors=(texture2D(scene,sampleUV+vec2(texel.x,0.)).rgb+texture2D(scene,sampleUV-vec2(texel.x,0.)).rgb+texture2D(scene,sampleUV+vec2(0.,texel.y)).rgb+texture2D(scene,sampleUV-vec2(0.,texel.y)).rgb)*.25;
 color=clamp(color+(color-neighbors)*.22,0.,1.);
 color+=vec3(.006,.009,.011)*sin(time*.25+uv.x*5.)*skyMask*(1.-reduced);
 float shimmer=sin(uv.x*220.+uv.y*180.+time*1.2)*sin(uv.y*310.-time*.8);
 color+=vec3(.004,.010,.012)*shimmer*water*(1.-reduced);
 color+=vec3(.012,.016,.020)*pow(max(0.,sin(uv.x*420.+uv.y*160.-time*3.)),12.)*jets*(1.-reduced);
 if(index>2.5){
  float tank=ellipse(uv,vec2(.5,.62),vec2(.225,.35));
  float caustic=pow(max(0.,sin(uv.x*105.+sin(uv.y*70.+time*.8)*2.+time*.7)*cos(uv.y*98.+sin(uv.x*85.-time*.6)*2.)),7.);
  color+=vec3(.03,.065,.075)*caustic*tank*(1.-reduced);
 }
 return color;
}
vec3 bubbles(vec3 color){
 if(reduced>.5)return color;
 for(int i=0;i<7;i++){
  float n=float(i);float seed=fract(sin(n*91.17+3.)*43758.54);
  float y=fract(seed+time*(.010+seed*.009));
  float x=.12+fract(seed*7.32)*.76+sin(time*.22+n*2.)*.020;
  vec2 p=(vUv-vec2(x,y))*vec2(aspect,1.);
  float radius=.012+seed*.022;float d=length(p)/radius;
  float edge=(1.-smoothstep(.98,1.045,d))*smoothstep(.84,.985,d);
  float fade=smoothstep(.02,.12,y)*(1.-smoothstep(.85,.98,y));
  float angle=atan(p.y,p.x);
  vec3 rainbow=.65+.35*cos(vec3(0.,2.1,4.2)+angle*2.+time*.15);
  float shine=exp(-length(p/radius-vec2(-.35,.47))*18.)*.8;
  color=mix(color,rainbow,edge*fade*.29);
  color+=vec3(shine*fade*.18);
 }
 return color;
}
void main(){
 vec2 uv=cover(vUv)+pointer*vec2(.0015,.0008)*(1.-reduced);
 float g1=gate(-14.);float g2=gate(-38.);float g3=gate(-50.);
 // Sample one scene outside transitions to keep the HD wallpaper inexpensive.
 vec3 color;
 if(g3>.999)color=animateScene(scene3,uv,3.);
 else if(g3>.001)color=mix(animateScene(scene2,uv,2.),animateScene(scene3,uv,3.),g3);
 else if(g2>.999)color=animateScene(scene2,uv,2.);
 else if(g2>.001)color=mix(animateScene(scene1,uv,1.),animateScene(scene2,uv,2.),g2);
 else if(g1>.999)color=animateScene(scene1,uv,1.);
 else if(g1>.001)color=mix(animateScene(scene0,uv,0.),animateScene(scene1,uv,1.),g1);
 else color=animateScene(scene0,uv,0.);
 // Glossy 3D soap-film spheres are rendered by AeroLife.
 float vignette=1.-smoothstep(.15,.85,length((vUv-.5)*vec2(.9,1.)));
 color*=mix(.96,1.,vignette);
 gl_FragColor=vec4(color,1.);
 #include <colorspace_fragment>
}
`;



