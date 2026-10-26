import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AwardIllustration, GameIllustration, HeroIllustration, MascotAvatar } from './Visuals';

// 本机单设备 MVP：不依赖后端，聚会信息持久化到浏览器 localStorage。
type Screen = 'home' | 'create' | 'room' | 'library' | 'game' | 'result' | 'report' | 'history' | 'me';
type GameId = 'truth' | 'undercover' | 'wolf' | 'mission' | 'likely' | 'bond' | 'turtle';
type Category = '全部' | '推理' | '互动' | '整活' | '破冰';
type Player = { id: string; name: string; avatar: number };
type HostMode = 'phone' | 'player';
type Game = { id: GameId; name: string; subtitle: string; min: number; max: number; mins: number; icon: string; theme: string; category: Exclude<Category, '全部'>; description: string; rules: string[] };
type RecordEntry = { id: string; gameId: GameId; gameName: string; summary: string; scores: Record<string, number>; when: number };
type Party = { id: string; title: string; players: Player[]; hostMode: HostMode; hostId: string; created: number; scores: Record<string, number>; records: RecordEntry[] };
type RoundResult = { title: string; subtitle: string; winners: string[]; points: Record<string, number> };
type RoundData = { roleIndex: number; revealed: boolean; phase: 'intro' | 'deal' | 'play' | 'judge'; undercoverId: string; pairIndex: number; wolfId: string; taskIndex: number; missions: number[]; time: number; timerRunning: boolean; questionIndex: number; truthMode: 'truth' | 'dare'; playerTurn: number; votes: string[]; selected: string; missionDone: Record<string, boolean>; actionDone: boolean; answerShown: boolean; bondMatches: number };

const GAMES: Game[] = [
  { id: 'wolf', name: '饭桌狼人杀', subtitle: '在聊天中完成秘密暗杀', min: 4, max: 10, mins: 10, icon: '', theme: 'wolf', category: '推理', description: '一个人是隐藏的狼人。狼人要在正常聊天中触发指定行为，其他人需要找出 TA！', rules: ['轮流传递手机，秘密查看身份。', '狼人领取暗杀任务，所有人正常聊天。', '倒计时结束后，主持人确认任务是否完成。', '全员讨论后投票找狼人。'] },
  { id: 'undercover', name: '谁是卧底', subtitle: '描述关键词，找出不同的人', min: 3, max: 10, mins: 8, icon: '', theme: 'undercover', category: '推理', description: '大部分人拿到同一个词，卧底拿到另一个相近的词。说得太像或太不像，都有危险！', rules: ['依次秘密查看自己的关键词。', '所有人轮流描述关键词，不能直接说出来。', '讨论并投票选出最可疑的卧底。', '投对平民赢，投错卧底赢。'] },
  { id: 'mission', name: '秘密任务局', subtitle: '边聊边偷偷完成挑战', min: 3, max: 10, mins: 10, icon: '', theme: 'mission', category: '整活', description: '每个人都收到一张秘密任务卡，在聚会中自然完成，别让朋友们猜到你的目的。', rules: ['每个人秘密领取一张任务卡。', '倒计时内正常聚会，偷偷尝试完成任务。', '结束后大家公布并核对任务结果。', '完成任务的玩家每人加 5 分。'] },
  { id: 'truth', name: '真心话大冒险', subtitle: '轮流抽题，笑点不断', min: 2, max: 10, mins: 5, icon: '', theme: 'truth', category: '互动', description: '真心话和大冒险随心切换。内容偏向朋友聚会，不设置强制饮酒或令人不适的挑战。', rules: ['选择真心话或大冒险。', '当前玩家自主决定接受、换题或跳过。', '点击下一位，手机交给下一个人。'] },
  { id: 'likely', name: '谁最有可能', subtitle: '朋友互选，看看谁上榜', min: 3, max: 10, mins: 5, icon: '', theme: 'likely', category: '破冰', description: '如果遇到某件离谱的事，大家最先想到谁？匿名轮流投出你的答案。', rules: ['系统随机给出一个有趣问题。', '玩家依次传递手机，选出最符合的人。', '全部投完票后公布本题结果。', '可以继续下一题或结束游戏。'] },
  { id: 'bond', name: '默契挑战', subtitle: '看看朋友有多懂你', min: 2, max: 10, mins: 5, icon: '', theme: 'bond', category: '互动', description: '看看你和朋友是否心有灵犀。同一题同时回答，答案一致就加分。', rules: ['手机展示问题，大家先想好答案。', '一起说出答案，看看是否一致。', '如果大家答案一致，手动确认加分。', '继续下一题，或结束本局。'] },
  { id: 'turtle', name: '海龟汤', subtitle: '一句话谜题，追查真相', min: 2, max: 10, mins: 10, icon: '', theme: 'turtle', category: '推理', description: '通过只能回答「是、否、无关」的问题，还原谜底。手机可以显示汤底供主持人查看。', rules: ['所有玩家先阅读汤面。', '推理者逐个提出「是/否」问题。', '手机主持时，由一人临时查看答案后进行回应。', '揭晓汤底并切换下一题。'] },
];
const truthQs = ['如果可以和这里一个人交换一天人生，你选谁？', '你做过最离谱但没人发现的事是什么？', '最想和这群朋友一起去哪里旅行？', '最近一次笑到停不下来是什么时候？', '小时候相信过什么奇怪的事情？', '这群朋友里谁最适合去参加综艺？'];
const dareQs = ['用夸张的播音腔介绍自己的晚餐。', '给左边的朋友想一个超酷的超级英雄名字。', '模仿一种小动物，让其他人猜出来。', '用三个表情演出你今天的心情。', '用广告口吻安利桌上的一种食物。', '为全场即兴编一句押韵口号。'];
const likelyQs = ['谁最有可能突然辞职去环游世界？', '谁最有可能在旅行前十分钟才收拾行李？', '谁最有可能在朋友圈突然宣布开店？', '谁最有可能在荒岛上第一个找到食物？', '谁最有可能成为综艺里的搞笑担当？'];
const bondQs = ['如果突然放假三天，我们会先去哪里？', '聚餐点菜时，我们最可能先点什么？', '我们当中谁最容易在电影里哭？', '如果一起开店，最可能开什么店？', '突然收到一笔奖金，我们最想买什么？'];
const undercoverPairs: [string, string][] = [['奶茶', '果茶'], ['火锅', '麻辣烫'], ['熊猫', '考拉'], ['电影院', '剧院'], ['滑雪', '滑冰'], ['猫咪', '兔子'], ['地铁', '公交车']];
const wolfTasks = ['让至少一位玩家主动说出「真的假的」', '让一位玩家主动向你提一个问题', '让一位玩家说出「随便」', '让一位玩家主动推荐一部电影', '让一位玩家主动谈论最近一次旅行'];
const secretTasks = ['让一个人主动夸你一句。', '让某个人自然地说出「好离谱」。', '让两个人一起说出一个地名。', '在聊天中自然地提到三次「企鹅」。', '让一位朋友主动推荐一部电影。', '让一个人问你最近在忙什么。', '让一位朋友主动提到「周末」。', '让一个人给你出一个脑筋急转弯。', '让一位朋友主动聊到童年趣事。', '让某个人说一句「我同意」。'];
const turtleQs = [
  { top: '一个人走进餐厅，点了一碗汤，喝了一口后立刻哭了。为什么？', bottom: '这是一个开放推理题。参考谜底：汤的味道和一位已经不在身边的亲人做的汤一模一样，让他想起了回忆。' },
  { top: '小林每天都会搭电梯到七楼，再走楼梯到十楼，但下雨天却直接搭到十楼。为什么？', bottom: '小林个子不够高，平时只能按到七楼；下雨天带了雨伞，可以用伞按到十楼。' },
  { top: '一个人坐在黑暗的房间里读书，没有灯，也没有手机，为什么他能读？', bottom: '他正在阅读盲文，不需要光线。' },
];

function rnd(max: number) { return Math.floor(Math.random() * max); }
function key() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }
function defaultPlayers(n: number): Player[] { return Array.from({ length: n }, (_, i) => ({ id: key(), name: `玩家${i + 1}`, avatar: i })); }
function newRound(): RoundData { return { roleIndex: 0, revealed: false, phase: 'intro', undercoverId: '', pairIndex: rnd(undercoverPairs.length), wolfId: '', taskIndex: rnd(wolfTasks.length), missions: [], time: 600, timerRunning: false, questionIndex: rnd(6), truthMode: 'truth', playerTurn: 0, votes: [], selected: '', missionDone: {}, actionDone: false, answerShown: false, bondMatches: 0 }; }
function storageRead<T>(name: string, backup: T): T { try { const raw = localStorage.getItem(name); return raw ? JSON.parse(raw) as T : backup; } catch { return backup; } }
function displayTime(n: number) { return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`; }

function Symbol({ name, size = 20 }: { name: string; size?: number }) {
  const base = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></>,
    games: <><rect x="2" y="7" width="20" height="12" rx="5"/><path d="M8 10v6m-3-3h6"/><circle cx="16" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="14" r="1" fill="currentColor" stroke="none"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2zM16 5a3 3 0 0 1 0 6m2 5a4 4 0 0 1 3 4"/></>,
    person: <><circle cx="12" cy="7" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    back: <path d="m15 18-6-6 6-6"/>,
    next: <path d="m9 18 6-6-6-6"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    sparkle: <><path d="m12 2 2.1 7.9L22 12l-7.9 2.1L12 22l-2.1-7.9L2 12l7.9-2.1z"/></>,
    crown: <><path d="m2 7 5 4 5-7 5 7 5-4-2 12H4z"/><path d="M4 22h16"/></>,
    play: <path d="m8 5 12 7-12 7z"/>,
    dice: <><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 9a7 7 0 0 1 12-2l2 5M4 12l2 5a7 7 0 0 0 12-2"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
    trophy: <><path d="M7 3h10v8a5 5 0 0 1-10 0V3zM7 5H3v3a5 5 0 0 0 4 5M17 5h4v3a5 5 0 0 1-4 5M12 16v5M8 21h8"/></>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
    eye: <><path d="M2 12c2.7-5 6.1-7 10-7s7.3 2 10 7c-2.7 5-6.1 7-10 7s-7.3-2-10-7z"/><circle cx="12" cy="12" r="3"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    pause: <><path d="M7 5v14M17 5v14" strokeWidth="4"/></>,
    phone: <><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></>,
    shield: <><path d="M12 2 21 6v5c0 6-4 9-9 11-5-2-9-5-9-11V6z"/></>,
  };
  return <svg {...base} aria-hidden="true">{paths[name] || paths.sparkle}</svg>;
}

function Avatar({ player, size = 42 }: { player: Player; size?: number }) {
  return <span className="avatar artwork-avatar" title={player.name} style={{width:size,height:size}}><MascotAvatar index={player.avatar} size={size}/></span>;
}
function MascotScene({compact=false}:{compact?:boolean}) {
  return compact ? <AwardIllustration/> : <HeroIllustration/>;
}
function TopBar({ label, back, right }: { label: string; back?: () => void; right?: ReactNode }) {
  return <header className="topbar">{back ? <button className="icon-btn" onClick={back} aria-label="返回"><Symbol name="back"/></button> : <span className="logo-mark"><Symbol name="sparkle" size={16}/> 一起玩</span>}<strong>{label}</strong><div className="topbar-action">{right}</div></header>;
}
function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; disabled?: boolean; className?: string }) {
  return <button type="button" className={`btn btn-${variant} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>;
}
function NumberControl({ count, setCount }: { count: number; setCount: (n: number) => void }) {
  return <div className="number-control"><button onClick={() => setCount(Math.max(2, count - 1))} disabled={count <= 2} aria-label="减少一人"><Symbol name="minus" size={18}/></button><strong>{count}</strong><button onClick={() => setCount(Math.min(10, count + 1))} disabled={count >= 10} aria-label="增加一人"><Symbol name="plus" size={18}/></button></div>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [party, setParty] = useState<Party | null>(() => storageRead<Party | null>('party-playground.active', null));
  const [histories, setHistories] = useState<Party[]>(() => storageRead<Party[]>('party-playground.history', []));
  const [draftPlayers, setDraftPlayers] = useState<Player[]>(() => defaultPlayers(6));
  const [partyName, setPartyName] = useState('今晚开玩');
  const [hostMode, setHostMode] = useState<HostMode>('phone');
  const [hostId, setHostId] = useState('');
  const [quickGame, setQuickGame] = useState<GameId | null>(null);
  const [currentGame, setCurrentGame] = useState<GameId>('wolf');
  const [round, setRound] = useState<RoundData>(() => newRound());
  const [result, setResult] = useState<RoundResult | null>(null);
  const [reportParty, setReportParty] = useState<Party | null>(null);
  const [category, setCategory] = useState<Category>('全部');
  const [searchText, setSearchText] = useState('');
  const [toast, setToast] = useState('');
  const [confirmEnd, setConfirmEnd] = useState(false);
  const players = party?.players ?? [];
  const game = GAMES.find(g => g.id === currentGame)!;

  useEffect(() => { localStorage.setItem('party-playground.active', JSON.stringify(party)); }, [party]);
  useEffect(() => { localStorage.setItem('party-playground.history', JSON.stringify(histories)); }, [histories]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2300); return () => clearTimeout(t); }, [toast]);
  useEffect(() => {
    if (screen !== 'game' || !round.timerRunning || round.phase !== 'play') return;
    const t = setInterval(() => setRound(s => s.time > 0 ? { ...s, time: s.time - 1 } : { ...s, timerRunning: false }), 1000);
    return () => clearInterval(t);
  }, [round.timerRunning, round.phase, screen]);

  const recommendations = useMemo(() => [...GAMES].filter(g => g.min <= players.length && g.max >= players.length).sort((a, b) => ['wolf', 'mission', 'undercover', 'truth', 'likely', 'bond', 'turtle'].indexOf(a.id) - ['wolf', 'mission', 'undercover', 'truth', 'likely', 'bond', 'turtle'].indexOf(b.id)), [players.length]);
  function createFlow(chosenGame: GameId | null = null) { setQuickGame(chosenGame); setDraftPlayers(defaultPlayers(6)); setPartyName('今晚开玩'); setHostMode('phone'); setHostId(''); setScreen('create'); }
  function setCount(n: number) { setDraftPlayers(old => n > old.length ? [...old, ...defaultPlayers(n - old.length).map((p, i) => ({ ...p, avatar: old.length + i, name: `玩家${old.length + i + 1}` }))] : old.slice(0, n)); }
  function makeParty() {
    if (draftPlayers.some(p => !p.name.trim())) { setToast('请先填写所有玩家的昵称'); return; }
    const names = draftPlayers.map(p => p.name.trim());
    if (new Set(names).size !== names.length) { setToast('玩家昵称不能重复哦'); return; }
    if (hostMode === 'player' && !hostId) { setToast('请选择一位玩家担任主持人'); return; }
    const newParty: Party = { id: key(), title: partyName.trim() || '今晚开玩', players: draftPlayers.map(p => ({...p, name:p.name.trim()})), hostMode, hostId: hostMode === 'player' ? hostId : '', created: Date.now(), scores: Object.fromEntries(draftPlayers.map(p => [p.id, 0])), records: [] };
    if (party) { setToast('已开始新的聚会，原有进行中聚会将被替换'); }
    setParty(newParty);
    if (quickGame) {
      const chosen = GAMES.find(g => g.id === quickGame)!;
      if (newParty.players.length >= chosen.min && newParty.players.length <= chosen.max) { setCurrentGame(chosen.id); setRound(newRound()); setResult(null); setScreen('game'); return; }
    }
    setScreen('room');
  }
  function launchGame(id: GameId) {
    if (!party && screen !== 'create') { createFlow(id); return; }
    setCurrentGame(id); setRound(newRound()); setResult(null); setScreen('game');
  }
  function startRound() {
    if (!party) return;
    const n = party.players.length; const r = newRound();
    if (['wolf', 'undercover'].includes(currentGame)) {
      r.phase = 'deal'; const picked = rnd(n); r.wolfId = party.players[picked].id; r.undercoverId = party.players[picked].id;
    } else if (currentGame === 'mission') {
      r.phase = 'deal'; const pool = Array.from({length:secretTasks.length},(_,i)=>i).sort(()=>Math.random()-.5); r.missions = party.players.map((_,i)=>pool[i % pool.length]);
    } else { r.phase = 'play'; }
    r.time = currentGame === 'wolf' || currentGame === 'mission' ? 600 : 300;
    setRound(r);
  }
  function completeRound(title: string, subtitle: string, winners: string[] = [], points: Record<string, number> = {}) {
    if (!party) return;
    const rec: RecordEntry = { id: key(), gameId: currentGame, gameName: game.name, summary: subtitle, scores: points, when: Date.now() };
    setParty(old => old && ({...old, records: [...old.records, rec], scores: Object.fromEntries(old.players.map(p => [p.id, (old.scores[p.id] ?? 0) + (points[p.id] ?? 0)])) }));
    setResult({title, subtitle, winners, points}); setScreen('result');
  }
  function finishParty() {
    if (!party) return;
    setReportParty(party); setHistories(old => [party, ...old].slice(0, 30)); setParty(null); setConfirmEnd(false); setScreen('report');
  }
  const sortedPlayers = [...players].sort((a,b)=>(party?.scores[b.id]??0)-(party?.scores[a.id]??0));
  const hostedBy = party?.hostMode === 'phone' ? '手机主持' : `${party?.players.find(p=>p.id===party.hostId)?.name ?? '玩家'}主持`;
  const showNav = ['home', 'library', 'history', 'me'].includes(screen);

  const gameTile = (g: Game) => {
    const eligible = !party || (g.min <= party.players.length && g.max >= party.players.length);
    return <button key={g.id} className={`game-tile game-${g.theme}`} onClick={() => eligible ? launchGame(g.id) : setToast(`${g.name}需要 ${g.min}–${g.max} 人`)}>
      <div className="game-tile-image"><GameIllustration game={g.id}/></div>
      <div className="game-tile-info"><strong>{g.name}</strong><span>{g.min}–{g.max}人 · 约{g.mins}分钟</span></div><span className="tile-arrow"><Symbol name="next" size={17}/></span>
    </button>;
  };

  return <div className="app-shell">
    <div className="ambient orb-one"/><div className="ambient orb-two"/>
    <div className={`app-frame ${['home','create','room'].includes(screen) ? 'v4-frame' : ''}`}>
      {screen === 'home' && <>
        <main className="page v4-home" aria-label="一起玩首页">
          <div className="v4-home-illustration" aria-hidden="true"><img src="/art/home-stage.webp" alt=""/></div>
          <div className="v4-home-head">
            <span className="v4-kicker">GOOD GAMES · BETTER FRIENDS</span>
            <h1 className="v4-brand">一起玩<span className="v4-brand-spark">✦</span></h1>
            <p className="v4-brand-sub">让聚会更好玩！</p>
            <p className="v4-brand-detail">2–10 人的线下聚会游戏</p>
          </div>
          <div className="v4-hero-bottom" aria-hidden="true"/>
          <section className="v4-home-actions" aria-label="开始聚会">
            <button className="v4-action v4-action-pink" onClick={()=>party?setScreen('room'):createFlow()}>
              <span className="v4-action-symbol"><Symbol name="users" size={29}/></span>
              <span><strong>{party?'继续聚会':'开启聚会'}</strong><small>{party?'回到你们正在进行的房间':'创建房间，和朋友一起玩'}</small></span>
              <span className="v4-action-arrow"><Symbol name="next" size={21}/></span>
            </button>
            <button className="v4-action v4-action-blue" onClick={()=>setScreen('library')}>
              <span className="v4-action-symbol"><Symbol name="dice" size={29}/></span>
              <span><strong>快速玩一局</strong><small>挑选游戏，立即开始</small></span>
              <span className="v4-action-arrow"><Symbol name="next" size={21}/></span>
            </button>
          </section>
          <div className="v4-section-bar"><h2>本周人气游戏</h2><button onClick={()=>setScreen('library')}>查看更多 <Symbol name="next" size={17}/></button></div>
          <section className="v4-popular" aria-label="热门聚会游戏">
            <button className="v4-popular-card v4-popular-wolf" onClick={()=>launchGame('wolf')}>
              <img src="/art/wolf.webp" alt="狼人主题游戏封面"/>
              <span className="v4-popular-shade"/>
              <span className="v4-popular-text"><strong>饭桌狼人杀</strong><small>4–10人 · 推理 · 高互动</small></span>
            </button>
            <button className="v4-popular-card v4-popular-mission" onClick={()=>launchGame('mission')}>
              <img src="/art/mission.webp" alt="秘密任务局主题游戏封面"/>
              <span className="v4-popular-shade"/>
              <span className="v4-popular-text"><strong>秘密任务局</strong><small>3–10人 · 整活 · 隐藏任务</small></span>
            </button>
          </section>
        </main>
      </>}

      {screen === 'create' && <>
        <header className="v4-topbar"><button aria-label="返回首页" className="v4-topback" onClick={()=>setScreen('home')}><Symbol name="back"/></button><strong>创建聚会</strong><span className="v4-header-orbit" aria-hidden="true">✧</span></header>
        <main className="page v4-create" aria-label="创建聚会">
          <p className="v4-create-lede">填写信息，马上开始我们的聚会游戏！</p>
          <section className="v4-create-section">
            <h2 className="v4-step-title"><span>1</span>选择人数</h2>
            <div className="v4-people-control">
              <span className="v4-count-figures" aria-hidden="true"><img src="/art/avatar-2.webp" alt=""/><img src="/art/avatar-3.webp" alt=""/></span>
              <small>2–10 人</small>
              <NumberControl count={draftPlayers.length} setCount={setCount}/>
            </div>
          </section>
          <section className="v4-create-section">
            <h2 className="v4-step-title"><span>2</span>设置玩家昵称 <small>({draftPlayers.length}/10)</small></h2>
            <div className="v4-player-editor">{draftPlayers.map((p,i)=><label className="v4-player-line" key={p.id}>
              <span className="v4-player-index">{i+1}</span><Avatar player={p} size={36}/>
              <input aria-label={`第${i+1}位玩家昵称`} value={p.name} maxLength={10} onChange={e=>setDraftPlayers(old=>old.map(a=>a.id===p.id?{...a,name:e.target.value}:a))}/>
              <span className="v4-player-edit-icon"><Symbol name="check" size={15}/></span>
            </label>)}</div>
            <p className="v4-edit-note">昵称可随时修改；增减玩家请使用上方人数控制。</p>
          </section>
          <section className="v4-create-section v4-host-section">
            <h2 className="v4-step-title"><span>3</span>选择主持方式</h2>
            <div className="v4-host-options">
              <button aria-pressed={hostMode==='phone'} className={`v4-host-option ${hostMode==='phone'?'active':''}`} onClick={()=>setHostMode('phone')}>
                <span className="v4-host-check"><Symbol name="check" size={12}/></span><span className="v4-host-icon"><Symbol name="phone" size={24}/></span>
                <strong>手机主持</strong><small>自动提示游戏流程、发身份及计时</small>
              </button>
              <button aria-pressed={hostMode==='player'} className={`v4-host-option ${hostMode==='player'?'active':''}`} onClick={()=>setHostMode('player')}>
                <span className="v4-host-check"><Symbol name="check" size={12}/></span><span className="v4-host-icon"><Symbol name="users" size={24}/></span>
                <strong>指定玩家主持</strong><small>选一位朋友手动控制游戏流程</small>
              </button>
            </div>
            {hostMode==='player'&&<div className="v4-host-pick"><p>选择主持人</p><div>{draftPlayers.map(p=><button aria-pressed={hostId===p.id} key={p.id} className={hostId===p.id?'selected':''} onClick={()=>setHostId(p.id)}><Avatar player={p} size={27}/>{p.name||'未命名'}{hostId===p.id&&<Symbol name="check" size={14}/>}</button>)}</div></div>}
          </section>
          <div className="v4-submit-wrap"><button className="v4-submit" onClick={makeParty}><strong>{quickGame?'开始游戏':'创建聚会'}</strong><Symbol name="next" size={22}/></button><small>一部手机就能玩，无需所有人下载</small></div>
        </main>
      </>}

      {screen === 'room' && party && <>
        <header className="v4-topbar v4-room-topbar"><button className="v4-topback" aria-label="返回首页" onClick={()=>setScreen('home')}><Symbol name="back"/></button><span><strong>{party.title}</strong><small><span className="v4-live-dot"/> {players.length} 位玩家 · {hostedBy} · 进行中</small></span><button className="v4-room-settings" onClick={()=>setToast('本局的玩家信息将在下次创建聚会时设置')} aria-label="房间设置"><Symbol name="sparkle" size={19}/></button></header>
        <main className="page v4-room" aria-label="聚会房间">
          <section className="v4-room-roster" aria-label="当前聚会的玩家">{players.map(p=><div className="v4-room-person" key={p.id}><Avatar player={p} size={46}/><small>{p.name}</small></div>)}</section>
          <section className="v4-leader-panel" aria-label="聚会积分排行榜">
            <div className="v4-panel-heading"><h2>当前积分排行</h2><span>本场聚会实时排名</span></div>
            <div className="v4-leader-list">{sortedPlayers.map((p,i)=>{
              const score=party.scores[p.id]??0;
              const maxScore=Math.max(10,...players.map(x=>party.scores[x.id]??0));
              return <div className="v4-leader-row" key={p.id}>
                <span className={`v4-leader-rank rank-${i+1}`}>{i<3?<Symbol name="crown" size={20}/>:i+1}</span>
                <Avatar player={p} size={35}/><span className="v4-leader-name">{p.name}</span>
                <span className="v4-leader-track"><i style={{width:`${Math.max(score===0?4:9,score/maxScore*100)}%`}}/></span><strong>{score}</strong>
              </div>;
            })}</div>
          </section>
          <div className="v4-section-bar v4-room-section"><span><h2>接下来玩什么？</h2><small>按当前人数推荐</small></span><button onClick={()=>setScreen('library')}><Symbol name="refresh" size={17}/> 更多</button></div>
          <section className="v4-room-suggestions">{recommendations.slice(0,3).map(g=><button key={g.id} onClick={()=>launchGame(g.id)} className={`v4-suggestion suggestion-${g.id}`}>
            <GameIllustration game={g.id}/><span className="v4-suggestion-shade"/>
            <span className="v4-suggestion-caption"><strong>{g.name}</strong><small>{g.category} · {g.mins}分钟</small></span>
          </button>)}</section>
          <div className="v4-room-toolbar" aria-label="聚会操作">
            <button onClick={()=>setScreen('library')}><Symbol name="games" size={19}/>游戏库</button>
            <button onClick={()=>setScreen('history')}><Symbol name="clock" size={19}/>本局记录</button>
            <button className="v4-start-next" onClick={()=>recommendations[0]?launchGame(recommendations[0].id):setScreen('library')}><Symbol name="dice" size={24}/>开始游戏</button>
            <button onClick={()=>setToast('玩家名单由创建聚会时统一设置')}><Symbol name="users" size={19}/>成员</button>
            <button onClick={()=>setConfirmEnd(true)}><Symbol name="trophy" size={19}/>结束</button>
          </div>
        </main>
      </>}

      {screen === 'library' && <><TopBar label="游戏库" back={()=>setScreen(party?'room':'home')} right={<span className="tag tag-light">{GAMES.length} 款游戏</span>}/><main className="page library-page">
        <div className="page-title small-title"><span className="eyebrow">CHOOSE YOUR GAME ✦</span><h1>想玩什么？<em>随便挑！</em></h1><p>{party ? `本场 ${players.length} 人 · 自动提示不适合人数的游戏` : '先选游戏，再设置人数和昵称'}</p></div>
        <div className="search-wrap"><Symbol name="search" size={18}/><input value={searchText} placeholder="搜索你想玩的游戏..." onChange={e=>setSearchText(e.target.value)}/>{searchText && <button aria-label="清除搜索" onClick={()=>setSearchText('')}><Symbol name="close" size={17}/></button>}</div>
        <div className="filter-pills">{(['全部','推理','互动','整活','破冰'] as Category[]).map(c=><button className={category===c?'active':''} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <div className="game-grid">{GAMES.filter(g=>(category==='全部'||g.category===category)&&(`${g.name}${g.subtitle}`.includes(searchText))).map(gameTile)}</div>
        {!GAMES.some(g=>(category==='全部'||g.category===category)&&(`${g.name}${g.subtitle}`.includes(searchText)))&&<p className="empty-state">还没有找到这个游戏，换个关键词试试～</p>}
      </main></>}

      {screen === 'game' && party && <><TopBar label={game.name} back={()=>round.phase==='intro' ? setScreen('room') : setConfirmEnd(true)} right={<span className="tag tag-light">{players.length}人 · {hostedBy}</span>}/><main className="page play-page">
        {round.phase === 'intro' && <><div className={`intro-cover game-${game.theme}`}><GameIllustration game={game.id}/><span className="intro-cover-glow"/></div><div className="intro-title"><span className="tag tag-highlight">{game.category}游戏 · 约{game.mins}分钟</span><h1>{game.name}</h1><p>{game.description}</p></div><section className="instruction"><h3><Symbol name="sparkle" size={18}/> 怎么玩？</h3>{game.rules.map((r,i)=><div key={r}><span>{String(i+1).padStart(2,'0')}</span><p>{r}</p></div>)}</section><Button onClick={startRound}>准备好了，开始游戏 <Symbol name="next"/></Button></>}
        {round.phase === 'deal' && <><div className="step-meta"><span>秘密发牌</span><span>{round.roleIndex+1} / {players.length}</span></div><div className="progress"><div style={{width:`${(round.roleIndex+1)/players.length*100}%`}}/></div><h2 className="center-heading">把手机交给 <em>{players[round.roleIndex]?.name}</em></h2><div className="reveal-person"><Avatar player={players[round.roleIndex]} size={78}/><strong>{players[round.roleIndex]?.name}</strong><p>请确认只有你能看到屏幕</p></div>
          {!round.revealed ? <div className="secret-cover" onClick={()=>setRound(s=>({...s,revealed:true}))} role="button" tabIndex={0}><Symbol name="lock" size={42}/><strong>点击查看秘密身份</strong><span>注意不要让其他玩家看见</span></div> : <div className="secret-card"><span className="tag tag-highlight">仅本人可见</span><div className="secret-main"><GameIllustration game={currentGame==='wolf'?'wolf':currentGame==='undercover'?'undercover':'mission'}/></div><h2>{currentGame==='undercover' ? '你的关键词' : currentGame==='wolf' ? (players[round.roleIndex]?.id===round.wolfId ? '你是狼人！' : '你是普通玩家') : '你的秘密任务'}</h2><p>{currentGame==='undercover' ? (players[round.roleIndex]?.id===round.undercoverId ? undercoverPairs[round.pairIndex][1] : undercoverPairs[round.pairIndex][0]) : currentGame==='wolf' ? (players[round.roleIndex]?.id===round.wolfId ? wolfTasks[round.taskIndex] : '注意观察身边的人，找到偷偷执行任务的狼人。') : secretTasks[round.missions[round.roleIndex]]}</p></div>}
          <Button onClick={()=>{ if (round.roleIndex + 1 === players.length) setRound(s=>({...s,phase:'play',timerRunning:currentGame==='wolf'||currentGame==='mission',revealed:false})); else setRound(s=>({...s,roleIndex:s.roleIndex+1,revealed:false})); }}>{round.roleIndex + 1 === players.length ? '所有人准备好了 · 开始！' : '已看完，交给下一位'} <Symbol name="next"/></Button></>}
        {round.phase === 'play' && <>
          {(currentGame==='wolf'||currentGame==='mission') && <><div className="live-banner"><span className="live-dot"/> 游戏正在进行 · {game.name}</div><div className="timer-card"><span>本轮剩余时间</span><strong>{displayTime(round.time)}</strong><div className="timer-actions"><button onClick={()=>setRound(s=>({...s,timerRunning:!s.timerRunning}))}><Symbol name={round.timerRunning?'pause':'play'} size={16}/>{round.timerRunning?'暂停':'继续'}</button><button onClick={()=>setRound(s=>({...s,phase:'judge',timerRunning:false}))}>结束本轮 <Symbol name="next" size={16}/></button></div></div><div className="playing-tip"><div className="tip-illustration"><GameIllustration game={currentGame==='wolf'?'wolf':'mission'}/></div><h3>{currentGame==='wolf'?'狼人正在暗中行动…':'大家正在悄悄完成任务…'}</h3><p>继续正常聊天；手机只负责计时，真实行为在结算时由玩家确认。</p></div><Button variant="secondary" onClick={()=>setRound(s=>({...s,phase:'judge',timerRunning:false}))}>进入结算 <Symbol name="next"/></Button></>}
          {currentGame==='undercover' && <><div className="live-banner"><span className="live-dot"/> 发言讨论阶段</div><div className="question-card"><span className="question-visual"><GameIllustration game="undercover"/></span><h2>谁拿到了不同的词？</h2><p>依次描述自己的词，不能直接说出词语，也不要展示身份卡。</p></div><div className="players-strip">{players.map(p=><div key={p.id}><Avatar player={p}/><small>{p.name}</small></div>)}</div><Button onClick={()=>setRound(s=>({...s,phase:'judge'}))}>开始投票 <Symbol name="next"/></Button></>}
          {currentGame==='truth' && <><div className="play-eyebrow">轮到 <span>{players[round.playerTurn].name}</span> 啦！</div><div className="turn-player"><Avatar player={players[round.playerTurn]} size={64}/><strong>{players[round.playerTurn].name}</strong></div><div className="segmented"><button className={round.truthMode==='truth'?'active':''} onClick={()=>setRound(s=>({...s,truthMode:'truth',questionIndex:rnd(truthQs.length)}))}>真心话</button><button className={round.truthMode==='dare'?'active':''} onClick={()=>setRound(s=>({...s,truthMode:'dare',questionIndex:rnd(dareQs.length)}))}>大冒险</button></div><div className="question-card big"><span className="question-visual"><GameIllustration game="truth"/></span><span className="card-small-title">{round.truthMode==='truth'?'TRUTH':'DARE'} CARD</span><h2>{(round.truthMode==='truth'?truthQs:dareQs)[round.questionIndex % (round.truthMode==='truth'?truthQs:dareQs).length]}</h2><small>可以跳过，不必勉强完成任何挑战</small></div><div className="two-buttons"><Button variant="secondary" onClick={()=>setRound(s=>({...s,questionIndex:rnd(100)}))}><Symbol name="refresh" size={16}/> 换一题</Button><Button onClick={()=>setRound(s=>({...s,playerTurn:(s.playerTurn+1)%players.length,questionIndex:rnd(100)}))}>下一位 <Symbol name="next"/></Button></div><button className="end-link" onClick={()=>completeRound('欢乐满分！','大家一起完成了一场真心话大冒险')}>结束本局</button></>}
          {currentGame==='likely' && (round.votes.length < players.length ? <><div className="step-meta"><span>匿名投票 · 第 {round.questionIndex % likelyQs.length+1} 题</span><span>{round.votes.length+1}/{players.length}</span></div><div className="question-card big"><span className="question-visual"><GameIllustration game="likely"/></span><h2>{likelyQs[round.questionIndex%likelyQs.length]}</h2><p>请 {players[round.votes.length]?.name} 选择你的答案</p></div><div className="vote-grid">{players.map(p=><button key={p.id} onClick={()=>setRound(s=>({...s,votes:[...s.votes,p.id]}))}><Avatar player={p}/><span>{p.name}</span></button>)}</div></> : <><div className="question-card"><span className="question-visual"><GameIllustration game="likely"/></span><h2>投票结果揭晓！</h2><p>{likelyQs[round.questionIndex%likelyQs.length]}</p></div><div className="leaderboard">{players.map(p=>({p,num:round.votes.filter(v=>v===p.id).length})).sort((a,b)=>b.num-a.num).map(({p,num})=><div key={p.id} className="leader-item"><Avatar player={p} size={40}/><span>{p.name}</span><strong>{num}票</strong></div>)}</div><div className="two-buttons"><Button variant="secondary" onClick={()=>completeRound('气氛担当集结！','朋友互选 · 趣味投票完成')}>结束本局</Button><Button onClick={()=>setRound(s=>({...s,questionIndex:s.questionIndex+1,votes:[]}))}>下一题 <Symbol name="next"/></Button></div></>)}
          {currentGame==='bond' && <><div className="play-eyebrow">默契问答 · 第 {round.questionIndex+1} 题</div><div className="question-card big"><span className="question-visual"><GameIllustration game="bond"/></span><span className="card-small-title">SAME BRAIN?</span><h2>{bondQs[round.questionIndex%bondQs.length]}</h2><p>大家先想好答案，然后同时说出来！</p></div><div className="score-tip">已记录默契成功 <b>{round.bondMatches}</b> 次</div><div className="two-buttons"><Button variant="secondary" onClick={()=>setRound(s=>({...s,questionIndex:s.questionIndex+1}))}>不一致，下一题</Button><Button onClick={()=>setRound(s=>({...s,questionIndex:s.questionIndex+1,bondMatches:s.bondMatches+1}))}>默契成功 +1 </Button></div><button className="end-link" onClick={()=>completeRound('默契爆表！',`全场成功达成 ${round.bondMatches} 次默契`,players.map(p=>p.id),Object.fromEntries(players.map(p=>[p.id,round.bondMatches*2])))}>结束本局</button></>}
          {currentGame==='turtle' && <><div className="play-eyebrow">海龟汤 · 第 {round.questionIndex+1} 题</div><div className="question-card big"><span className="question-visual"><GameIllustration game="turtle"/></span><span className="card-small-title">神秘的故事</span><h2>{turtleQs[round.questionIndex%turtleQs.length].top}</h2><p>推理者轮流提问，只能回答：是 / 否 / 无关。</p></div>{round.answerShown && <div className="answer-card"><strong> 汤底揭晓</strong><p>{turtleQs[round.questionIndex%turtleQs.length].bottom}</p></div>}<div className="two-buttons"><Button variant="secondary" onClick={()=>setRound(s=>({...s,answerShown:!s.answerShown}))}><Symbol name="eye" size={17}/>{round.answerShown?'收起汤底':'查看汤底'}</Button><Button onClick={()=>setRound(s=>({...s,questionIndex:s.questionIndex+1,answerShown:false}))}>下一道汤 <Symbol name="next"/></Button></div><button className="end-link" onClick={()=>completeRound('推理完成！','大家又解开了一个神秘故事')}>结束本局</button></>}
        </>}
        {round.phase === 'judge' && <>{currentGame==='undercover' && <><div className="question-card"><span className="question-visual"><GameIllustration game="undercover"/></span><h2>谁是卧底？</h2><p>讨论结束，请选择最终被投出的玩家。</p></div><div className="vote-grid">{players.map(p=><button className={round.selected===p.id?'selected':''} key={p.id} onClick={()=>setRound(s=>({...s,selected:p.id}))}><Avatar player={p}/><span>{p.name}</span></button>)}</div><Button disabled={!round.selected} onClick={()=>{const hit=round.selected===round.undercoverId; const win=hit?players.filter(p=>p.id!==round.undercoverId).map(p=>p.id):[round.undercoverId];completeRound(hit?'找到了！平民获胜 ':'卧底赢了！',`真正的卧底：${players.find(p=>p.id===round.undercoverId)?.name} · 关键词：${undercoverPairs[round.pairIndex].join(' / ')}`,win,Object.fromEntries(win.map(x=>[x,10])));}}>揭晓卧底 <Symbol name="next"/></Button></>}
          {currentGame==='wolf' && <><div className="question-card"><span className="question-visual"><GameIllustration game="wolf"/></span><h2>今晚的狼人是谁？</h2><p>先由主持人核对任务是否完成，然后大家投票决定抓谁。</p></div><label className="toggle-row"><span>狼人成功完成暗杀动作？</span><button className={`toggle ${round.actionDone?'on':''}`} aria-label="任务完成情况" aria-pressed={round.actionDone} onClick={()=>setRound(s=>({...s,actionDone:!s.actionDone}))}><span/></button></label><p className="form-label inline">投票选出最可疑的人</p><div className="vote-grid">{players.map(p=><button className={round.selected===p.id?'selected':''} key={p.id} onClick={()=>setRound(s=>({...s,selected:p.id}))}><Avatar player={p}/><span>{p.name}</span></button>)}</div><Button disabled={!round.selected} onClick={()=>{ const caught=round.selected===round.wolfId;const goodWin=caught||!round.actionDone;const winners=goodWin?players.filter(p=>p.id!==round.wolfId).map(p=>p.id):[round.wolfId];completeRound(goodWin?'普通玩家获胜！ ':'狼人得逞了！ ',`狼人是 ${players.find(p=>p.id===round.wolfId)?.name} · 任务：${wolfTasks[round.taskIndex]} · ${round.actionDone?'完成':'未完成'}`,winners,Object.fromEntries(winners.map(x=>[x,10])));}}>确认并揭晓结果 <Symbol name="next"/></Button></>}
          {currentGame==='mission' && <><div className="question-card"><span className="question-visual"><GameIllustration game="mission"/></span><h2>秘密任务大公开！</h2><p>逐一核对，哪些任务真的完成了？</p></div><div className="mission-check-list">{players.map((p,i)=><button key={p.id} className={round.missionDone[p.id]?'done':''} onClick={()=>setRound(s=>({...s,missionDone:{...s.missionDone,[p.id]:!s.missionDone[p.id]}}))}><Avatar player={p} size={42}/><div><strong>{p.name}</strong><span>{secretTasks[round.missions[i]]}</span></div><span className="check-box">{round.missionDone[p.id]&&<Symbol name="check" size={16}/>}</span></button>)}</div><Button onClick={()=>{const winners=players.filter(p=>round.missionDone[p.id]).map(p=>p.id);completeRound('秘密任务结算完成！ ',`成功完成 ${winners.length}/${players.length} 个秘密任务`,winners,Object.fromEntries(winners.map(id=>[id,5])));}}>完成结算 <Symbol name="next"/></Button></>}
        </>}
      </main></>}

      {screen === 'result' && result && <><TopBar label="本局结果" back={()=>setScreen('room')}/><main className="page result-page"><div className="win-art"><MascotScene compact/><div className="win-cover-title">好人阵营获胜！</div></div><span className="eyebrow center">ROUND COMPLETE</span><h1>{result.title}</h1><p>{result.subtitle}</p><div className="result-ranking"><h3>本轮积分</h3>{result.winners.length ? result.winners.map(id=>{const p=players.find(p=>p.id===id);return p?<div className="leader-item" key={id}><Avatar player={p} size={40}/><span>{p.name}</span><strong>+{result.points[id]||0} 分</strong></div>:null;}):<div className="no-points">本局是轻松互动游戏，不计竞争积分 </div>}</div><div className="result-actions"><Button onClick={()=>setScreen('room')}>挑选下一场 <Symbol name="next"/></Button><Button variant="secondary" onClick={()=>launchGame(currentGame)}><Symbol name="refresh"/> 再玩一次</Button></div></main></>}

      {screen === 'report' && reportParty && <><TopBar label="聚会战报" back={()=>setScreen('home')}/><main className="page report-page"><div className="report-visual"><AwardIllustration/><div className="report-visual-copy"><span>THE PARTY AWARDS</span><h1>这一晚，我们玩得超开心！</h1><p>{reportParty.title}</p></div></div><div className="room-stats report-stats"><div><strong>{reportParty.players.length}</strong><span>朋友参与</span></div><div><strong>{reportParty.records.length}</strong><span>游戏场次</span></div><div><strong>{Object.values(reportParty.scores).reduce((a,b)=>a+b,0)}</strong><span>累计积分</span></div></div><h2 className="mini-section-title"><Symbol name="trophy" size={18}/> 今晚的闪耀玩家</h2><div className="leaderboard">{[...reportParty.players].sort((a,b)=>reportParty.scores[b.id]-reportParty.scores[a.id]).map((p,i)=><div className="leader-item" key={p.id}><span className={`rank rank-${i+1}`}>{i+1}</span><Avatar player={p} size={38}/><span>{p.name}{i===0&&reportParty.records.length>0?' · 今晚 MVP':''}</span><strong>{reportParty.scores[p.id]} 分</strong></div>)}</div><h2 className="mini-section-title"><Symbol name="games" size={18}/> 这一晚都玩了什么</h2><div className="recent-list">{reportParty.records.length ? reportParty.records.map(r=><div key={r.id}><span className="recent-game-art"><GameIllustration game={r.gameId}/></span><div><strong>{r.gameName}</strong><small>{r.summary}</small></div></div>) : <p className="empty-state">这次聚会还没有游戏记录～</p>}</div><Button onClick={()=>setScreen('home')}>返回首页 <Symbol name="next"/></Button></main></>}

      {screen === 'history' && <><TopBar label="聚会历史" back={()=>setScreen('home')}/><main className="page"><div className="page-title small-title"><span className="eyebrow">OUR MEMORIES</span><h1>快乐<em>存档 ✦</em></h1><p>这些精彩回忆保存在当前设备上。</p></div><div className="history-list">{histories.length?histories.map(h=><button key={h.id} onClick={()=>{setReportParty(h);setScreen('report')}}><span className="history-art"><AwardIllustration/></span><span><strong>{h.title}</strong><small>{h.players.length} 人 · {h.records.length} 场游戏 · {new Date(h.created).toLocaleDateString('zh-CN')}</small></span><Symbol name="next" size={18}/></button>):<div className="empty-state">还没有聚会记录，快叫朋友一起来玩吧！</div>}</div></main></>}

      {screen === 'me' && <><TopBar label="我的" back={()=>setScreen('home')}/><main className="page"><div className="account-head"><Avatar player={{id:'me',name:'派对玩家',avatar:1}} size={64}/><div><h2>派对玩家</h2><p>准备好和朋友开玩了吗？</p></div></div><div className="me-card"><span><Symbol name="games" size={22}/></span><div><strong>我们的游戏</strong><small>当前收录 {GAMES.length} 款小游戏</small></div></div><button className="me-card" onClick={()=>setScreen('history')}><span><Symbol name="trophy" size={22}/></span><div><strong>聚会历史</strong><small>查看 {histories.length} 场已经结束的聚会</small></div><Symbol name="next"/></button><div className="device-note"><h3>关于数据保存</h3><p>当前为单手机 MVP，玩家、积分及聚会历史保存在本机浏览器中。清除浏览器数据会丢失记录，暂不支持多设备同步。</p></div></main></>}

      {showNav && <nav className="bottom-nav" aria-label="主导航"><button className={screen==='home'?'active':''} onClick={()=>setScreen('home')}><Symbol name="home" size={22}/><span>首页</span></button><button className={screen==='library'?'active':''} onClick={()=>setScreen('library')}><Symbol name="games" size={22}/><span>游戏库</span></button><button className={screen==='room'?'active':''} onClick={()=>party?setScreen('room'):createFlow()}><Symbol name="users" size={22}/><span>聚会</span></button><button className={screen==='me'||screen==='history'?'active':''} onClick={()=>setScreen('me')}><Symbol name="person" size={22}/><span>我的</span></button></nav>}
    </div>
    {confirmEnd && <div className="modal-backdrop" onClick={()=>setConfirmEnd(false)}><div className="modal" onClick={e=>e.stopPropagation()}><span className="modal-icon"><Symbol name="dice" size={38}/></span><h2>{screen==='game'?'要提前退出这场游戏吗？':'结束今晚的聚会？'}</h2><p>{screen==='game'?'本局未结算的积分不会保存，已结束的场次仍然保留。':'系统会保存本场游戏记录，并生成聚会战报。'}</p><Button onClick={()=>{if(screen==='game'){setConfirmEnd(false);setScreen('room')}else finishParty()}}>{screen==='game'?'退出本局':'结束并生成战报'}</Button><Button variant="secondary" onClick={()=>setConfirmEnd(false)}>继续玩</Button></div></div>}
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>;
}