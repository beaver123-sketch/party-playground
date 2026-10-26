
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
 const id=((index%10)+10)%10+1;
 return <img className="real-avatar v04-avatar" width={size} height={size} src={`/art/v04/avatars/${id}.svg`} draggable={false} alt={`玩家卡通头像 ${id}`} style={{objectFit:'cover',borderRadius:'50%',flexShrink:0}}/>;
}

export function HeroIllustration(){
 return <img className="hero-illustration" src="/art/v04/hero.svg" alt="霓虹城市中的卡通怪物朋友、游戏骰子与卡牌" draggable={false}/>;
}

type GameKey='wolf'|'undercover'|'mission'|'truth'|'likely'|'bond'|'turtle';
export function GameIllustration({game, className=''}:{game:GameKey; className?:string}) {
  const labels:Record<GameKey,string>={wolf:'饭桌狼人杀',undercover:'谁是卧底',mission:'秘密任务局',truth:'真心话大冒险',likely:'谁最有可能',bond:'默契挑战',turtle:'海龟汤'};
  return <img className={`game-illustration ${className}`} src={`/art/v04/covers/${game}.svg`} draggable={false} loading="lazy" alt={`${labels[game]}独立高清封面`}/>;
}

export function WolfCharacter({className=''}:{className?:string}) {
  return <img className={`wolf-character ${className}`} src="/art/v04/wolf-character.svg" draggable={false} alt="狼人立绘"/>;
}

export function AwardIllustration(){return <svg className="award-illustration" viewBox="0 0 480 265" role="img" aria-label="戴王冠的可爱卡通吉祥物庆祝聚会获胜">
 <defs><radialGradient id="awardGlow"><stop stopColor="#a42df4" stopOpacity=".88"/><stop offset="1" stopColor="#100a37" stopOpacity="0"/></radialGradient></defs>
 <rect width="480" height="265" fill="#0a0c29"/><circle cx="240" cy="115" r="202" fill="url(#awardGlow)"/>
 <g opacity=".9"><path d="M75 18l6 12 14 2-11 11 2 14-12-7-12 7 2-14-10-11 14-2z" fill="#ffcc46"/><path d="M395 40l6 12 14 2-10 11 2 14-12-7-12 7 2-14-10-11 14-2z" fill="#2edcff"/><circle cx="153" cy="45" r="6" fill="#ff5cba"/><circle cx="332" cy="24" r="5" fill="#ffbe55"/></g>
 <g transform="translate(104 188)"><MascotHead index={2} scale={.68}/></g><g transform="translate(240 134)"><MascotHead index={1} scale={1.0} crown/></g><g transform="translate(385 190)"><MascotHead index={3} scale={.65}/></g>
 </svg>}