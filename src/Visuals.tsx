/**
 * Approved art assets extracted from the user's locked nine-screen UI design.
 * All visual surfaces use real images and vector UI icons; no emoji substitutions.
 */
type GameKey = 'wolf' | 'undercover' | 'mission' | 'truth' | 'likely' | 'bond' | 'turtle';
const art=(key:string)=>`/art/${key}.webp`;

export function MascotAvatar({index,size=42}:{index:number;size?:number}) {
  const id=((index%10)+10)%10+1;
  return <img className="real-avatar" src={`/art/avatar-${id}.webp`}
    alt={`玩家卡通头像 ${id}`} width={size} height={size} draggable={false}
    style={{width:size,height:size,borderRadius:'50%',objectFit:'cover',flexShrink:0}}/>;
}
export function HeroIllustration() {
  return <img className="hero-illustration" src={art('hero')} alt="定稿插画：粉色派对小怪物、卡牌与骰子" draggable={false} loading="eager"/>;
}
export function GameIllustration({game,className=''}:{game:GameKey;className?:string}) {
  const names:Record<GameKey,string>={wolf:'狼人',undercover:'卧底侦探',mission:'秘密任务',truth:'真心话',likely:'朋友互动',bond:'默契挑战',turtle:'海龟汤'};
  return <img className={`game-illustration ${className}`} src={art(game)} alt={`${names[game]}专属插画`} draggable={false} loading="lazy"/>;
}
export function AwardIllustration(){
  return <img className="award-illustration" src={art('celebrate')} alt="聚会战报：朋友们一起庆祝" draggable={false}/>;
}