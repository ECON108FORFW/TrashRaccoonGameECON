import { has } from './utils.js';

export const ITEMS = {
  spoon:{e:'🥄',n:'Shiny spoon',p:7,tags:['shiny']}, key:{e:'🔑',n:'Brass key',p:5,tags:['shiny','key']},
  ring:{e:'💍',n:'Soda-tab ring',p:8,tags:['shiny']}, bell:{e:'🔔',n:'Little bell',p:4,tags:['shiny','music']},
  burrito:{e:'🌯',n:'Half a burrito',p:6,tags:['food','perishable']}, donut:{e:'🍩',n:'Sprinkle donut',p:5,tags:['food','perishable']},
  pizza:{e:'🍕',n:'Pizza crust',p:3,tags:['food','perishable']}, sock:{e:'🧦',n:'Wool sock',p:3,tags:['warm','soft']},
  yarn:{e:'🧶',n:'Ball of yarn',p:4,tags:['warm','soft']}, teddy:{e:'🧸',n:'Big teddy bear',p:7,tags:['big','soft']},
  radio:{e:'📻',n:'Crackly radio',p:8,tags:['big','music']}, comic:{e:'📖',n:'Soggy comic',p:4,tags:['paper']},
  umbrella:{e:'☂️',n:'Umbrella',p:5,tags:['big']}, candle:{e:'🕯️',n:'Candle stub',p:3,tags:['warm']},
};
export const FACTORS = {
  hoard:{clue:{e:'📝',n:'a scribbled note',t:'“Found another spoon today. Where am I supposed to put all these shiny things?” — {X}'},know:'{X} already has way too many shiny things',eff:(it)=>has(it,'shiny')?.35:1,hits:['shiny']},
  tiny:{clue:{e:'📦',n:'a flattened moving box',t:'Scrawled on the side: “{X}’s new den — tiny but cozy!”'},know:'{X}’s new den is tiny',eff:(it)=>has(it,'big')?.3:1,hits:['big']},
  cold:{clue:{e:'🌨️',n:'a soggy weather flyer',t:'“Frost warning all week.” Brr.'},know:'A cold snap is coming',eff:(it,s)=>has(it,'warm')?(s.has('bare')?2.2:1.3):1,hits:['warm']},
  bare:{clue:{e:'🪹',n:'a torn-up nest lining',t:'Label says: “{X}’s bedding.” It’s shredded. {X} is sleeping on bare dirt.'},know:'{X} has no bedding right now',eff:(it,s)=>has(it,'soft')&&!s.has('cold')?1.3:1,hits:['soft']},
  stuffed:{clue:{e:'🧾',n:'a bakery receipt',t:'“12 day-old croissants” — with {X}’s pawprint on it. Somebody ate well this week.'},know:'{X} just had a huge feast',eff:(it)=>has(it,'food')?.4:1,hits:['food']},
  travel:{clue:{e:'🗺️',n:'a chewed-up map',t:'A route is circled. Note: “{X} leaves at dawn — back in a week.”'},know:'{X} leaves town tomorrow for a week',eff:(it)=>has(it,'perishable')?.15:(has(it,'big')?.6:1),hits:['perishable','big']},
  music:{clue:{e:'🎧',n:'a broken headphone',t:'Scratched into it: “Can’t sleep without tunes.” — {X}'},know:'{X} loves music',eff:(it)=>has(it,'music')?2.2:1,hits:['music']},
  keys:{clue:{e:'⛓️',n:'a jangly key ring',t:'Twenty keys. None of them open anything. It’s {X}’s collection.'},know:'{X} collects keys',eff:(it)=>has(it,'key')?2.6:1,hits:['key']},
  reader:{clue:{e:'🔖',n:'a chewed bookmark',t:'“Property of {X}. Finished it in one night. Again.”'},know:'{X} reads everything',eff:(it)=>has(it,'paper')?2.2:1,hits:['paper']},
};
export const VAGUE={e:'💌',n:'an old birthday card',t:'“To my dear little one — look how you’ve grown!” That’s… everything you know about her.'};
export const JUNK=[
  {e:'🍌',n:'a banana peel',t:'Just a banana peel. Slippery. Useless.'},
  {e:'📰',n:'a wet newspaper',t:'Soggy newspaper. Can’t read a word.'},
  {e:'🥫',n:'an empty can',t:'An empty can. Licked clean by someone else.'},
  {e:'🧻',n:'a paper towel tube',t:'A cardboard tube. You look through it. Nothing.'},
  {e:'🦴',n:'a chicken bone',t:'A chicken bone. Picked bare.'},
];
export const FRIENDS=[
  {name:'Pip',role:'your best friend',pron:'them',intro:'You and Pip have shared a dumpster since you were kits. If anyone can find Pip the perfect gift, it’s you.',clues:3,vague:false,junk:0,digs:6,taste:[.8,1.25],pebbleHearts:1,filter:'none',acc:'',pebbleLine:'“Pebbles? From you? …Oh. Okay. Thanks.”'},
  {name:'Nib',role:'your cousin',pron:'them',intro:'You see Nib at family gatherings. You know… some stuff. Probably.',clues:1,vague:false,junk:2,digs:5,taste:[.6,1.5],pebbleHearts:1,filter:'hue-rotate(30deg) saturate(1.4) brightness(1.05)',acc:'',pebbleLine:'“Cool. Pebbles. …Thanks, I guess.”'},
  {name:'Great-Aunt Marlo',short:'Marlo',role:'your great-aunt',pron:'her',intro:'You met Great-Aunt Marlo once. She pinched your cheek and called you by your cousin’s name.',clues:0,vague:true,junk:2,digs:5,taste:[.4,1.8],pebbleHearts:2,filter:'grayscale(.85) sepia(.35) brightness(1.1)',acc:'👓',pebbleLine:'“Pebbles! How sensible, dear. I’ll pick something out myself.”'},
];
export const SPOTS=[
  {x:40,y:336,w:132,h:142,t:'bag'},{x:250,y:296,w:84,h:62,t:'box'},{x:196,y:404,w:112,h:82,t:'box'},
  {x:345,y:318,w:58,h:90,t:'can'},{x:425,y:340,w:132,h:142,t:'bag'},{x:580,y:300,w:60,h:97,t:'can'},
  {x:650,y:398,w:112,h:86,t:'box'},{x:776,y:330,w:104,h:134,t:'bag'},
];
