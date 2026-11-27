import React from 'react';

const themes={
 'Just Keep Breathing':['belt','Breath as Input'],
 'Her Cycle':['uterus','Menstrual Cycle'],
 "Exhibition of Medieval Women's Daily Life":['medieval','Medieval Life'],
 'My Little Planet':['planet','Living Ecosystems'],
 'MIT MANUS Comic':['manus','Rehab Robotics'],
 'Pocket Pixie':['pixie','Small Steps'],
 'Finding James':['james','Follow Your Heart'],
 'Falling Guy':['falling','Keep Descending'],
 'The Brew Beneath':['coffee','Monster Café'],
 'The White Loong':['loong','Women’s Voices'],
 'Reverberation':['sound','Echoes in Motion'],
 'Mouse Vision':['mouse','A New Perspective'],
 'Mystery':['mystery','Hidden Clues'],
};
export default function WorkSticker({project}){
 let theme=themes[project.name];
 if(!theme){const slug=project.url||'';theme=slug.includes('barriers-to-care')?['care','Access to Care']:slug.includes('border-games')?['border','Games & Politics']:slug.includes('leaving-is')?['shelter','A Safe Place']:['shame','Breaking the Silence'];}
 return <div className="work-sticker"><img src={import.meta.env.BASE_URL+'stickers/aero-v2/'+theme[0]+'.png'} alt="" loading="lazy" decoding="async"/><strong>{theme[1]}</strong></div>;
}
