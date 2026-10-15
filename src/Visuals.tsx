import { useId } from 'react';

/* 正式 SVG 插画系统：所有角色、游戏封面和首页主视觉均为可缩放矢量图，非 emoji。 */
const palettes = [
  {base:'#f89c40',shadow:'#db3b78',line:'#9d2b5b',ear:'#ffc8a2'},
  {base:'#ff91cb',shadow:'#d83baf',line:'#941c87',ear:'#ffcee8'},
  {base:'#87d9ff',shadow:'#4e73ee',line:'#3e3cbd',ear:'#d5f4ff'},
  {base:'#80edc1',shadow:'#26a7a7',line:'#17666e',ear:'#c5fff0'},
  {base:'#ba9bff',shadow:'#7065d9',line:'#5141a9',ear:'#e0d2ff'},
  {base:'#ffbd77',shadow:'#fb667f',line:'#b35477',ear:'#ffe5ca'},
  {base:'#fa83bb',shadow:'#ab47eb',line:'#713aa4',ear:'#ffcae2'},
  {base:'#7aafff',shadow:'#3975da',line:'#31539d',ear:'#b0dcff'},
  {base:'#b6f7a2',shadow:'#53d2a7',line:'#2b8f7a',ear:'#e0ffd3'},
  {base:'#fa9eff',shadow:'#a161fb',line:'#7044b7',ear:'#ffdbff'},
];

type MiniProps = { index?:number; x?:number; y?:number; scale?:number; crown?:boolean; shades?:boolean };
export function MascotHead({index=0,x=0,y=0,scale=1,crown=false,shades=false}: MiniProps){
  const p=palettes[index%palettes.length]; const cat=index%5===0||index%5===2; const bunny=index%5===1;const bear=index%5===3;const ghost=index%5===4;
  return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinejoin="round" strokeLinecap="round">
    <ellipse cx="0" cy="53" rx="67" ry="16" fill="#060a27" opacity=".40"/>
    {bunny&&<><path d="M-36-28 Q-65-118 -35-123 Q-6-122 -16-28" fill={p.base} stroke={p.line} strokeWidth="6"/><path d="M14-28 Q8-125 37-124 Q65-111 39-27" fill={p.base} stroke={p.line} strokeWidth="6"/><path d="M-37-42 Q-50-102-38-105 Q-26-104-28-40 M28-42 Q25-103 38-105 Q49-97 29-40" fill={p.ear}/></>}
    {cat&&<><path d="M-57-10 L-62-90 Q-57-102 -45-96 L-9-65 M16-65 L48-96 Q61-104 62-89 L58-10" fill={p.base} stroke={p.line} strokeWidth="7"/><path d="M-49-73 L-45-41 L-19-57Z M45-72 L45-41 L21-56Z" fill={p.ear}/></>}
    {bear&&<><circle cx="-44" cy="-52" r="25" fill={p.base} stroke={p.line} strokeWidth="6"/><circle cx="44" cy="-52" r="25" fill={p.base} stroke={p.line} strokeWidth="6"/><circle cx="-44" cy="-52" r="12" fill={p.ear}/><circle cx="44" cy="-52" r="12" fill={p.ear}/></>}
    {ghost&&<><path d="M-58-1 Q-57-76 0-79 Q58-76 58-1 L58 46 Q44 31 30 47 Q14 34 0 46 Q-19 32-34 48 Q-49 35-58 45Z" fill={p.base} stroke={p.line} strokeWidth="7"/></>}
    {!ghost&&<ellipse cx="0" cy="-4" rx="66" ry="61" fill={p.base} stroke={p.line} strokeWidth="7"/>}
    <path d="M-49-30 Q-24-59 14-51" fill="none" stroke="#fff" strokeWidth="10" opacity=".24" strokeLinecap="round"/>
    <ellipse cx="-44" cy="20" rx="17" ry="10" fill="#ff5b94" opacity=".7"/><ellipse cx="44" cy="20" rx="17" ry="10" fill="#ff5b94" opacity=".7"/>
    {shades?<><rect x="-46" y="-21" width="41" height="33" rx="13" fill="#13132e" stroke="#503efa" strokeWidth="4"/><rect x="6" y="-21" width="41" height="33" rx="13" fill="#13132e" stroke="#503efa" strokeWidth="4"/><path d="M-5-10Q0-16 6-10" stroke="#503efa" strokeWidth="5" fill="none"/><path d="M-40-14h12M12-14h13" stroke="#7bd6ff" strokeWidth="4" opacity=".8"/></>:<><ellipse cx="-25" cy="-9" rx="10" ry="15" fill="#231a48"/><ellipse cx="25" cy="-9" rx="10" ry="15" fill="#231a48"/><circle cx="-29" cy="-15" r="4" fill="#fff"/><circle cx="21" cy="-15" r="4" fill="#fff"/></>}
    <path d="M-9 17 Q0 31 10 17" fill="none" stroke="#672e64" strokeWidth="6"/>
    <path d="M-2 13 L2 13" stroke="#672e64" strokeWidth="5"/>
    {crown&&<g transform="translate(-2 -88) rotate(-12)"><path d="M-29 6 L-37-22 L-15-9 L0-35 L16-10 L39-26 L28 6Z" fill="#ffcf48" stroke="#ffe68e" strokeWidth="4"/><rect x="-28" y="4" width="56" height="11" rx="5" fill="#ff9d47"/><circle cx="0" cy="-15" r="6" fill="#ef3cc3"/></g>}
    {index%7===6&&<g transform="translate(35 -53)"><path d="M0-13 L4-4 L14 0 L4 4 L0 13 L-4 4 L-14 0 L-4-4Z" fill="#ffe478" stroke="#fff1b3" strokeWidth="2"/></g>}
  </g>;
}

export function MascotAvatar({index,size=42}: {index:number;size?:number}){
 const id=useId().replace(/:/g,''); const p=palettes[index%palettes.length];
 return <svg className="real-avatar" width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`卡通头像 ${index+1}`}>
   <defs><radialGradient id={`${id}a`} cx="25%" cy="18%"><stop stopColor="#5b40bc"/><stop offset=".6" stopColor="#191346"/><stop offset="1" stopColor="#090d2a"/></radialGradient><linearGradient id={`${id}b`} x2="1" y2="1"><stop stopColor={p.base}/><stop offset="1" stopColor={p.shadow}/></linearGradient></defs>
   <circle cx="60" cy="60" r="57" fill={`url(#${id}a)`} stroke={p.base} strokeWidth="4"/>
   <g transform="translate(60 67) scale(.61)"><MascotHead index={index} x={0} y={0} scale={1} crown={index===5} shades={index===6}/></g>
   <circle cx="99" cy="19" r="5" fill="#fff" opacity=".9"/><circle cx="19" cy="92" r="3" fill="#f989e9"/>
 </svg>;
}

function GlowStars(){return <g fill="#fff4ce"><path d="M57 55l5 14 14 5-14 4-5 14-5-14-14-4 14-5z" opacity=".9"/><path d="M381 54l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#75daff"/><circle cx="402" cy="181" r="3"/><circle cx="71" cy="212" r="3" fill="#fd73d9"/></g>}
function Skyline(){return <g opacity=".8"><path d="M0 220V85l40-25v140l36-12V76l44-30v142l39-12V28l48-23v228H0" fill="#111135"/><path d="M480 220V77l-35-25v134l-31-12V58l-42-29v178l-44-17V38l-39-18v213h191" fill="#101033"/><path d="M15 123h14v20H15zM90 95h14v18H90zM115 143h14v20h-14zM177 65h15v28h-15zM365 95h13v19h-13zM440 116h17v22h-17z" fill="#f33aeb" opacity=".55"/><path d="M33 159h16v19H33zM324 128h15v24h-15zM395 94h13v18h-13z" fill="#36ccff" opacity=".8"/></g>}
function Dice(){return <g transform="translate(262 192) rotate(-10)"><ellipse cx="0" cy="110" rx="111" ry="33" fill="#8b24fa" opacity=".25"/><path d="M-82-57 L6-91 L84-45 L-6-6Z" fill="#fc49bf" stroke="#ffbaee" strokeWidth="7"/><path d="M-82-57 L-6-6 L-5 86 L-82 43Z" fill="#5e1eb0" stroke="#ff69e8" strokeWidth="7"/><path d="M-6-6 L84-45 L87 45 L-5 86Z" fill="#b326bc" stroke="#ff9ee4" strokeWidth="7"/><g fill="#fff2a5" filter="url(#softLight)"><circle cx="-46" cy="-8" r="9"/><circle cx="-46" cy="30" r="9"/><circle cx="39" cy="-3" r="9"/><circle cx="43" cy="45" r="9"/><path d="M0-67l7 12 13 5-13 6-7 12-7-12-13-6 13-5z"/></g></g>}
export function HeroIllustration(){
 return <svg className="hero-illustration" viewBox="0 0 480 315" role="img" aria-label="霓虹都市里，可爱卡通朋友围着发光骰子聚会">
  <defs><radialGradient id="homeGlow"><stop stopColor="#ba38de" stopOpacity=".8"/><stop offset="1" stopColor="#2c145c" stopOpacity="0"/></radialGradient><filter id="softLight" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="2"/></filter></defs>
  <rect width="480" height="315" fill="#070b25"/><circle cx="240" cy="160" r="200" fill="url(#homeGlow)"/><Skyline/><GlowStars/>
  <g transform="translate(107 195) rotate(-11)"><MascotHead index={2} scale={.65}/></g>
  <g transform="translate(184 108) rotate(10)"><MascotHead index={1} scale={.84} crown/></g>
  <g transform="translate(371 174) rotate(10)"><MascotHead index={3} scale={.63}/></g>
  <g transform="translate(354 75) rotate(-8)"><MascotHead index={4} scale={.53}/></g>
  <Dice/>
  <g fill="#fff"><circle cx="154" cy="52" r="4"/><circle cx="325" cy="39" r="4"/></g>
 </svg>;
}

type GameKey='wolf'|'undercover'|'mission'|'truth'|'likely'|'bond'|'turtle';
export function GameIllustration({game, className=''}:{game: GameKey;className?:string}){
 const uid=useId().replace(/:/g,'');
 const palette:Record<GameKey,[string,string,string]>={wolf:['#290c41','#f5428e','#ffb1dd'],undercover:['#072759','#27c8ff','#c67cff'],mission:['#32104e','#ffad4b','#ff5bd6'],truth:['#47104f','#fc63bf','#ffc8e6'],likely:['#3d1550','#ffae49','#e57cff'],bond:['#17245d','#7a9aff','#ff6cdc'],turtle:['#06374c','#4fe8d2','#b0fff1']}; const [deep,accent,light]=palette[game];
 return <svg className={`game-illustration ${className}`} viewBox="0 0 480 300" role="img" aria-label={`${game} 专属原创矢量插画`} preserveAspectRatio="xMidYMid slice">
   <defs><radialGradient id={`${uid}bg`} cx="65%" cy="25%" r="90%"><stop stopColor={accent} stopOpacity=".63"/><stop offset=".55" stopColor={deep}/><stop offset="1" stopColor="#080b2e"/></radialGradient><radialGradient id={`${uid}moon`}><stop stopColor={light}/><stop offset="1" stopColor={accent}/></radialGradient><filter id={`${uid}blur`}><feGaussianBlur stdDeviation="17"/></filter></defs>
   <rect width="480" height="300" fill={`url(#${uid}bg)`}/><circle cx="245" cy="118" r="120" fill={accent} opacity=".18" filter={`url(#${uid}blur)`}/>
   <g opacity=".85"><path d="M0 245L65 180 111 234 185 170 252 230 348 155 480 246v54H0z" fill="#080d2c"/><path d="M0 271l120-78 49 48 87-80 64 77 82-44 78 52v54H0z" fill="#101235"/></g>
   <GlowStars/>
   {game==='wolf'&&<g><circle cx="343" cy="105" r="95" fill={`url(#${uid}moon)`} opacity=".87"/><g transform="translate(215 165) scale(1.3)"><path d="M-75-16L-89-129 -21-85 43-93 98-140 81-21Q109 40 67 89L-61 89Q-99 46-75-16Z" fill="#101632" stroke="#aa6bff" strokeWidth="5"/><path d="M-61-31L-71-108-26-68M62-32l26-82L33-65" fill="#d645ac"/><path d="M-64 10Q-18 34-5 9Q28 30 68 7" fill="#26264b"/><path d="M-54-7l45 13-25 13z M16 5l48-18-14 34z" fill="#ff4f9c"/><path d="M-6 34l-7 19 21 0z" fill="#8a6db0"/><path d="M-6 53Q-37 49-48 39M6 53Q37 49 48 39" stroke="#c2a8ff" strokeWidth="5" fill="none"/></g><path d="M388 205l34-24 32 24-8 53-50 0z" fill="#4a2eb9" stroke="#e369ff" strokeWidth="6"/><path d="M400 205l20 17 19-17" stroke="#dcb6ff" fill="none" strokeWidth="4"/></g>}
   {game==='undercover'&&<g><g transform="translate(230 160) scale(1.06)"><MascotHead index={4} scale={.95} shades/><path d="M-83-59l60-70 67 12 52 59z" fill="#0c1331" stroke="#25bde4" strokeWidth="7"/><path d="M-106-51H106" stroke="#1d2b60" strokeWidth="17"/><path d="M-47-92l75 3" stroke="#fb57bf" strokeWidth="7"/></g><g transform="translate(370 205) rotate(-25)"><circle cx="0" cy="-36" r="52" fill="none" stroke="#7ce5ff" strokeWidth="13"/><rect x="-7" y="9" width="18" height="90" rx="8" fill="#7ce5ff"/></g></g>}
   {game==='mission'&&<g><g transform="translate(209 169) rotate(-10)"><rect x="-111" y="-64" width="226" height="153" rx="18" fill="#f79a44" stroke="#fff0b0" strokeWidth="8"/><path d="M-101-60L4 21 109-60" fill="#ffcb6d" stroke="#fff0b0" strokeWidth="7"/><path d="M-102 81L-20 4M110 84L28 4" stroke="#e76a66" strokeWidth="7" fill="none"/><path d="M0-12l12 10 15-10-2 18L12 17 0 6Z" fill="#f943a9"/></g><g transform="translate(371 92)"><MascotHead index={0} scale={.47} crown/></g></g>}
   {game==='truth'&&<g><path d="M230 251C145 181 100 143 115 92Q126 42 181 47Q218 45 244 88Q275 45 316 55Q377 69 365 128Q358 168 230 251Z" fill="#ff78ce" stroke="#ffd5ff" strokeWidth="10"/><g transform="translate(232 140)"><MascotHead index={1} scale={.63}/></g><g transform="translate(88 174) rotate(-13)"><rect x="-28" y="-40" width="57" height="83" rx="28" fill="#55bfff" stroke="#b4f8ff" strokeWidth="7"/><path d="M0 42v38" stroke="#c9fbff" strokeWidth="10"/></g></g>}
   {game==='likely'&&<g><g transform="translate(243 176)"><MascotHead index={0} scale={1.17} crown/></g><path d="M69 81l5 14 14 5-14 4-5 14-5-14-14-4 14-5z" fill="#ffda5a"/></g>}
   {game==='bond'&&<g><g transform="translate(165 176) rotate(-9)"><MascotHead index={2} scale={.92}/></g><g transform="translate(312 170) rotate(9)"><MascotHead index={1} scale={.92}/></g><path d="M240 71Q206 36 195 70Q185 98 240 136Q298 96 282 68Q270 38 240 71Z" fill="#ff7ad0" stroke="#ffc0ed" strokeWidth="7"/></g>}
   {game==='turtle'&&<g><circle cx="370" cy="85" r="75" fill="#69f2e8" opacity=".5"/><g transform="translate(240 165)"><ellipse cx="0" cy="0" rx="111" ry="80" fill="#1ed8ad" stroke="#8dffdd" strokeWidth="8"/><path d="M-68-36l56-22 62 22 24 45-62 43-65-31z" fill="#17716f" stroke="#6af5d3" strokeWidth="7"/><path d="M-12-58L12 50 M-68-36L50-36M-53 21L74 9" stroke="#72e8d0" strokeWidth="5"/><circle cx="-112" cy="-2" r="36" fill="#70efc8" stroke="#b7ffe9" strokeWidth="7"/><ellipse cx="-126" cy="-5" rx="6" ry="10" fill="#124348"/><path d="M-128 17Q-115 27-102 14" stroke="#10555a" fill="none" strokeWidth="4"/><path d="M65 35l56 49-5-64zM-58 58l-47 35 2-53z" fill="#4ecac5" stroke="#72e8d0" strokeWidth="7"/></g></g>}
   <path d="M5 263Q250 229 475 265" stroke={accent} strokeWidth="3" opacity=".42" fill="none"/>
 </svg>;
}

export function AwardIllustration(){return <svg className="award-illustration" viewBox="0 0 480 265" role="img" aria-label="戴王冠的可爱卡通吉祥物庆祝聚会获胜">
 <defs><radialGradient id="awardGlow"><stop stopColor="#a42df4" stopOpacity=".88"/><stop offset="1" stopColor="#100a37" stopOpacity="0"/></radialGradient></defs>
 <rect width="480" height="265" fill="#0a0c29"/><circle cx="240" cy="115" r="202" fill="url(#awardGlow)"/>
 <g opacity=".9"><path d="M75 18l6 12 14 2-11 11 2 14-12-7-12 7 2-14-10-11 14-2z" fill="#ffcc46"/><path d="M395 40l6 12 14 2-10 11 2 14-12-7-12 7 2-14-10-11 14-2z" fill="#2edcff"/><circle cx="153" cy="45" r="6" fill="#ff5cba"/><circle cx="332" cy="24" r="5" fill="#ffbe55"/></g>
 <g transform="translate(104 188)"><MascotHead index={2} scale={.68}/></g><g transform="translate(240 134)"><MascotHead index={1} scale={1.0} crown/></g><g transform="translate(385 190)"><MascotHead index={3} scale={.65}/></g>
 </svg>}