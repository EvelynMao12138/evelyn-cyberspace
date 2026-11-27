// Derive a rendering matte from the exact background pixels, without repainting the art.
// Region connectivity keeps blue glass windows enclosed by their building frames opaque.
export function buildMeadowForeground(image){
 const width=image.width,height=image.height,canvas=document.createElement('canvas');
 canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
 const pixels=ctx.getImageData(0,0,width,height).data,count=width*height;
 const eligible=new Uint8Array(count),sky=new Uint8Array(count),queue=new Int32Array(count);
 for(let y=0;y<height*.72;y++)for(let x=0;x<width;x++){
  const i=y*width+x,j=i*4,r=pixels[j],g=pixels[j+1],b=pixels[j+2],nx=x/width,ny=y/height;
  const blue=b>145&&g>65&&b>g*1.05+9&&b>r*1.22+24;
  const rainbow=nx>.385&&nx<.69&&Math.abs(ny-(.14+2.7*(nx-.64)**2))<.045;
  eligible[i]=blue||rainbow?1:0;
 }
 // Close subpixel gaps in chrome frames before region growing, so the sky
 // cannot leak into a glass facade through a tiny blue connection.
 const originalEligible=eligible.slice();
 for(let y=2;y<height-2;y++)for(let x=2;x<width-2;x++){
  const i=y*width+x;if(!originalEligible[i])continue;
  if(!originalEligible[i-1]||!originalEligible[i+1]||!originalEligible[i-width]||!originalEligible[i+width]||!originalEligible[i-2]||!originalEligible[i+2]||!originalEligible[i-width*2]||!originalEligible[i+width*2])eligible[i]=0;
 }
 let head=0,tail=0;
 const visit=i=>{if(eligible[i]&&!sky[i]){sky[i]=1;queue[tail++]=i;}};
 // These seeds are in the central open sky, above all distant tower roofs.
 for(const nx of [.50,.55,.60])for(const ny of [.05,.15,.28,.40,.49])visit(Math.floor(ny*height)*width+Math.floor(nx*width));
 while(head<tail){const i=queue[head++],x=i%width;if(x>0)visit(i-1);if(x<width-1)visit(i+1);if(i>=width)visit(i-width);if(i<count-width)visit(i+width);}
 // Restore the two-pixel safety margin only along the reached sky boundary.
 for(let pass=0;pass<2;pass++){
  const previous=sky.slice();
  for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
   const i=y*width+x;if(!sky[i]&&originalEligible[i]&&(previous[i-1]||previous[i+1]||previous[i-width]||previous[i+width]))sky[i]=1;
  }
 }
 // Remove tiny isolated sky islands (e.g. the sparkle on a cloud-free blue patch).
 // Real buildings, antennas and tree silhouettes remain joined to the image boundary.
 const foreground=new Uint8Array(count);head=0;tail=0;
 const edge=i=>{if(!sky[i]&&!foreground[i]){foreground[i]=1;queue[tail++]=i;}};
 for(let x=0;x<width;x++){edge(x);edge((height-1)*width+x);}
 for(let y=0;y<height;y++){edge(y*width);edge(y*width+width-1);}
 while(head<tail){const i=queue[head++],x=i%width;if(x>0)edge(i-1);if(x<width-1)edge(i+1);if(i>=width)edge(i-width);if(i<count-width)edge(i+width);}
 const data=new Uint8Array(count);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)data[(height-1-y)*width+x]=foreground[y*width+x]?255:0;
 return {data,width,height};
}
