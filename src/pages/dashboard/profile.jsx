import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../../components/dashboard/dashboard-navbar.jsx';

const initialTasks = [
  { id: 1, title: '1 ders tamamla', xp: 50, done: true },
  { id: 2, title: '10 soru çöz', xp: 80, done: true },
  { id: 3, title: '20 dakika çalış', xp: 60, done: true },
  { id: 4, title: 'Not al', xp: 40, done: false },
  { id: 5, title: 'Bir başarı rozeti kazan', xp: 100, done: false },
];

const stats = [
  { label: 'Kurslar', value: '14', sub: 'Tamamlanan kurs', progress: 70, color: '#2563EB', icon: '◈' },
  { label: 'Dersler', value: '138', sub: 'Bitirilen ders', progress: 82, color: '#7C3AED', icon: '⌖' },
  { label: 'Quizler', value: '312', sub: 'Çözülen quiz', progress: 60, color: '#059669', icon: '◎' },
  { label: 'Başarı', value: '87%', sub: 'Doğru cevap oranı', progress: 87, color: '#D97706', icon: '◫' },
];

const badges = [
  { icon: '🎓', title: 'İlk Ders', status: '✓ Kazanıldı', bg: '#EFF6FF', color: '#2563EB', locked: false },
  { icon: '🔥', title: '7 Gün Seri', status: '✓ Kazanıldı', bg: '#FFFBEB', color: '#D97706', locked: false },
  { icon: '💯', title: 'İlk 100', status: '✓ Kazanıldı', bg: '#ECFDF5', color: '#059669', locked: false },
  { icon: '📚', title: '5 Kurs', status: '✓ Kazanıldı', bg: '#F5F3FF', color: '#7C3AED', locked: false },
  { icon: '⚡', title: 'Hızlı Öğr.', status: '✓ Kazanıldı', bg: '#FFFBEB', color: '#D97706', locked: false },
  { icon: '🏆', title: 'Şampiyon', status: '✓ Kazanıldı', bg: '#FEF2F2', color: '#DC2626', locked: false },
  { icon: '🌟', title: '30 Gün', status: '✓ Kazanıldı', bg: '#EFF6FF', color: '#2563EB', locked: false },
  { icon: '🤝', title: 'Takım Oyun.', status: '✓ Kazanıldı', bg: '#F5F3FF', color: '#7C3AED', locked: false },
  { icon: '🔒', title: 'Mükemmel', status: 'Kilitli', bg: '#F8F9FB', color: '#94A3B8', locked: true },
  { icon: '🔒', title: 'Sezonal', status: 'Kilitli', bg: '#F8F9FB', color: '#94A3B8', locked: true },
  { icon: '🔒', title: 'Elmas', status: 'Kilitli', bg: '#F8F9FB', color: '#94A3B8', locked: true },
  { icon: '🔒', title: 'Lejant', status: 'Kilitli', bg: '#F8F9FB', color: '#94A3B8', locked: true },
];

const weeklyRanking = [
  { rank: '🥇', avatar: '🐯', name: 'Zeynep Ç.', points: '3 420 pts', bg: '#EFF6FF' },
  { rank: '🥈', avatar: '🐼', name: 'Rızgar O.', points: '3 180 pts', bg: '#F5F3FF' },
  { rank: '🥉', avatar: '🦁', name: 'Rojhat T.', points: '2 990 pts', bg: '#ECFDF5' },
  { rank: '#4', avatar: '🦊', name: 'Sen (İlkhan)', points: '2 750 pts', bg: 'linear-gradient(135deg,#2563EB,#7C3AED)', me: true },
  { rank: '#5', avatar: '🐰', name: 'Burak Y.', points: '2 620 pts', bg: '#FFFBEB' },
];

const classRanking = [
  { rank: '#1', avatar: '🦁', name: 'Rojhat Taş', points: '97 puan', bg: '#ECFDF5' },
  { rank: '#2', avatar: '🦊', name: 'Sen (İlkhan)', points: '95 puan', bg: 'linear-gradient(135deg,#2563EB,#7C3AED)', me: true },
  { rank: '#3', avatar: '🐯', name: 'Zeynep Çiftçi', points: '93 puan', bg: '#EFF6FF' },
  { rank: '#4', avatar: '🐼', name: 'Rızgar Ozan', points: '92 puan', bg: '#F5F3FF' },
  { rank: '#5', avatar: '🐰', name: 'Burak Yıldız', points: '89 puan', bg: '#FFFBEB' },
];

const friendRanking = [
  { rank: '#1', avatar: '🐯', name: 'Zeynep Çiftçi', points: '8 920 XP', bg: '#EFF6FF' },
  { rank: '#2', avatar: '🦁', name: 'Rojhat Taş', points: '8 710 XP', bg: '#ECFDF5' },
  { rank: '#3', avatar: '🦊', name: 'Sen (İlkhan)', points: '8 450 XP', bg: 'linear-gradient(135deg,#2563EB,#7C3AED)', me: true },
  { rank: '#4', avatar: '🐼', name: 'Rızgar Ozan', points: '8 120 XP', bg: '#F5F3FF' },
  { rank: '#5', avatar: '🐰', name: 'Burak Yıldız', points: '7 860 XP', bg: '#FFFBEB' },
];

const friendsSeed = [
  { id: 1, avatar: '🐯', name: 'Zeynep Çiftçi', level: 'Sv.14 · 🔥 21 gün seri' },
  { id: 2, avatar: '🐼', name: 'Rızgar Ozan', level: 'Sv.11 · 🔥 8 gün seri' },
  { id: 3, avatar: '🦁', name: 'Rojhat Taş', level: 'Sv.13 · 🔥 15 gün seri' },
  { id: 4, avatar: '🐰', name: 'Burak Yıldız', level: 'Sv.10 · 🔥 5 gün seri' },
];

const journey = [
  { title: 'Temel Matematik', desc: '✓ Tamamlandı · 8 modül', status: '100%', tone: 'done' },
  { title: 'Cebir I', desc: '✓ Tamamlandı · 12 modül', status: '100%', tone: 'done' },
  { title: '📍 Cebir II · Aktif', desc: 'Şu an burada · 5/14 modül', status: '36%', tone: 'active' },
  { title: 'Geometri', desc: 'Kilitli · Hedef: Cebir II bitir', status: '🔒', tone: 'locked' },
  { title: 'Sayı Teorisi', desc: 'Kilitli', status: '🔒', tone: 'locked-soft' },
];

const certificates = [
  { type: '◈ Kurs Sertifikası', title: 'Temel Matematik', meta: 'Tamamlanma: Ekim 2024', color: '#2563EB', bg: '#EFF6FF', action: '⬇ İndir' },
  { type: '⌖ Kurs Sertifikası', title: 'Cebir I', meta: 'Tamamlanma: Kasım 2024', color: '#7C3AED', bg: '#F5F3FF', action: '⬇ İndir' },
  { type: '◫ Etkinlik Belgesi', title: 'Sonbahar Olimpiyatı', meta: 'Katılım: Kasım 2024 · 🥈 İkincilik', color: '#D97706', bg: '#FFFBEB', action: '⬇ İndir' },
];

const shopData = {
  avatars: [
    { id: 'current-avatar', icon: '🦊', label: 'Mevcut', owned: true },
    { id: 'a1', icon: '🐯', cost: 200 },
    { id: 'a2', icon: '🦋', cost: 350 },
    { id: 'a3', icon: '🐉', cost: 500, rare: true },
    { id: 'a4', icon: '🦄', cost: 150 },
    { id: 'a5', icon: '🐺', cost: 400 },
    { id: 'a6', icon: '🦅', cost: 600, rare: true },
    { id: 'a7', icon: '🔱', cost: 800, epic: true },
  ],
  frames: [
    { id: 'f0', icon: '⬜', label: 'Varsayılan', owned: true },
    { id: 'f1', icon: '🌟', cost: 300 },
    { id: 'f2', icon: '🔮', cost: 450 },
    { id: 'f3', icon: '👑', cost: 700, rare: true },
    { id: 'f4', icon: '🌸', cost: 250 },
    { id: 'f5', icon: '⚡', cost: 550 },
  ],
  themes: [
    { id: 't0', swatch: '#F8F9FB', label: 'Mevcut', owned: true, border: true },
    { id: 't1', gradient: 'linear-gradient(135deg,#2563EB,#7C3AED)', cost: 300 },
    { id: 't2', gradient: 'linear-gradient(135deg,#059669,#0284c7)', cost: 300 },
    { id: 't3', gradient: 'linear-gradient(135deg,#0f172a,#1e3a5f)', cost: 500, rare: true },
    { id: 't4', gradient: 'linear-gradient(135deg,#D97706,#DC2626)', cost: 400 },
    { id: 't5', gradient: 'linear-gradient(135deg,#7C3AED,#DB2777)', cost: 600, rare: true },
  ],
  rewards: [
    { id: 'r1', icon: '⏱️', title: '2× XP (1 gün)', cost: 100 },
    { id: 'r2', icon: '🛡️', title: 'Seri Koruma', cost: 200 },
    { id: 'r3', icon: '💡', title: 'İpucu Joker', cost: 150 },
    { id: 'r4', icon: '🎁', title: 'Mini Ödül Kutusu', cost: 500, rare: true },
  ],
};

const availableAvatars = ['🦊', '🐯', '🦋', '🦄', '🐺', '🦅'];
const availableTitles = ['⚡ Hızlı Öğrenen', '🔥 Seri Ustası', '🏆 Şampiyon', '📚 5 Kurs'];

const formatCoin = (value) => new Intl.NumberFormat('tr-TR').format(value);

const getPriceColor = (item) => {
  if (item.epic) return '#7C3AED';
  if (item.rare) return '#DC2626';
  return '#D97706';
};

function ProgressBar({ value, color, background }) {
  return (
    <div className="prog-track" style={background ? { background } : undefined}>
      <div className="prog-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function SectionLabel({ color = '#2563EB', children }) {
  return (
    <div className="section-label">
      <div className="bar" style={{ background: color }} />
      <span style={{ color }}>{children}</span>
    </div>
  );
}

export default function Profile1() {
  const [tasks, setTasks] = useState(initialTasks);
  const [ligTab, setLigTab] = useState('haftalik');
  const [shopTab, setShopTab] = useState('avatars');
  const [coins, setCoins] = useState(1240);
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const [selectedTitle, setSelectedTitle] = useState('⚡ Hızlı Öğrenen');
  const [cheeredFriends, setCheeredFriends] = useState([]);
  const [ownedItems, setOwnedItems] = useState(['current-avatar', 'f0', 't0']);

  const completedTasks = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const dailyProgress = (completedTasks / tasks.length) * 100;

  const currentRanking = useMemo(() => {
    if (ligTab === 'sinif') return classRanking;
    if (ligTab === 'arkadaslar') return friendRanking;
    return weeklyRanking;
  }, [ligTab]);

  const toggleTask = (taskId) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)));
  };

  const handleCheer = (friendId) => {
    setCheeredFriends((prev) => (prev.includes(friendId) ? prev : [...prev, friendId]));
  };

  const handleBuyItem = (item) => {
    if (ownedItems.includes(item.id) || item.owned) return;
    if (coins < item.cost) {
      window.alert('Yeterli coin yok.');
      return;
    }

    const ok = window.confirm(`Bu ürünü 🪙 ${item.cost} coin ile satın almak ister misiniz?`);
    if (!ok) return;

    setCoins((prev) => prev - item.cost);
    setOwnedItems((prev) => [...prev, item.id]);
  };

  const handleSave = () => {
    window.alert('Profil kaydedildi! ✓');
  };

  const handleAddFriend = () => {
    window.alert('Arkadaş ekleme açıldı!');
  };

  const handleDownload = (label) => {
    window.alert(`${label} indiriliyor...`);
  };

  const handleEventJoin = () => {
    window.alert('Etkinliğe katılım ekranı açıldı!');
  };

  return (
    <>
      <style>{`

        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'IBM Plex Mono',monospace;background:#F8F9FB;color:#111827}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#f1f5f9}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}

        @keyframes fadein{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
        @keyframes bounce-in{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        @keyframes streak-glow{0%,100%{box-shadow:0 0 0 0 #f59e0b44}50%{box-shadow:0 0 0 8px transparent}}

        .fadein{animation:fadein .4s ease both}
        .pulse-dot{animation:pulse-dot 2s ease-in-out infinite}
        .bounce-in{animation:bounce-in .5s cubic-bezier(.4,0,.2,1) both}
        .s1{animation-delay:.05s}.s2{animation-delay:.1s}.s3{animation-delay:.15s}.s4{animation-delay:.2s}.s5{animation-delay:.25s}.s6{animation-delay:.3s}
        .logo-hex{clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)}
        .nav-link{position:relative;text-decoration:none}
        .nav-link::after{content:'';position:absolute;bottom:-3px;left:0;right:0;height:1.5px;background:#2563EB;transform:scaleX(0);transition:transform .2s;transform-origin:left}
        .nav-link:hover::after{transform:scaleX(1)}
        .card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;transition:box-shadow .2s,transform .2s}
        .card:hover{box-shadow:0 8px 32px rgba(37,99,235,.08);transform:translateY(-1px)}
        .section-label{display:flex;align-items:center;gap:8px;margin-bottom:10px}
        .section-label .bar{width:20px;height:2px;border-radius:1px}
        .section-label span{font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase}
        .stat-badge{background:#F8F9FB;border:1px solid #e2e8f0;border-radius:8px;padding:12px 10px;text-align:center}
        .prog-track{height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;position:relative}
        .prog-fill{height:100%;border-radius:3px;transition:width 1s cubic-bezier(.4,0,.2,1)}
        .task-row{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;transition:border-color .15s,background .15s}
        .task-row:hover{border-color:#93c5fd;background:#EFF6FF}
        .task-row.done{background:#ECFDF5;border-color:#6ee7b7}
        .task-check{width:20px;height:20px;border-radius:5px;border:1.5px solid #cbd5e1;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
        .task-row.done .task-check{background:#059669;border-color:#059669}
        .badge-item{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:10px;border:1px solid #e2e8f0;background:#fff;transition:box-shadow .2s,transform .2s;text-align:center}
        .badge-item:hover{box-shadow:0 4px 20px rgba(37,99,235,.12);transform:translateY(-2px)}
        .badge-item.locked{opacity:.45;filter:grayscale(.8)}
        .badge-icon{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px}
        .av-opt{width:52px;height:52px;border-radius:50%;border:2px solid #e2e8f0;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:24px;transition:border-color .15s,transform .15s;background:#F8F9FB}
        .av-opt.selected{border-color:#2563EB;transform:scale(1.08);box-shadow:0 0 0 3px #EFF6FF}
        .av-opt:hover:not(.selected){border-color:#93c5fd}
        .lig{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:4px;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
        .coin-chip{display:inline-flex;align-items:center;gap:5px;background:#FFFBEB;border:1px solid #fcd34d;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700;color:#92400e}
        .tab-btn{padding:8px 14px;border:none;background:none;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent;color:#94a3b8;transition:color .15s,border-color .15s}
        .tab-btn.active{color:#2563EB;border-bottom-color:#2563EB}
        .shop-item{border:1px solid #e2e8f0;border-radius:10px;padding:12px 10px;text-align:center;cursor:pointer;transition:border-color .15s,transform .15s,box-shadow .15s;background:#fff}
        .shop-item:hover{border-color:#93c5fd;transform:translateY(-2px);box-shadow:0 4px 16px rgba(37,99,235,.10)}
        .shop-item.owned{border-color:#6ee7b7;background:#ECFDF5}
        .j-node{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;position:relative}
        .j-dot{width:14px;height:14px;border-radius:50%;flex-shrink:0}
        .j-line{width:2px;height:20px;background:#e2e8f0;margin-left:6px}
        .friend-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;transition:background .15s}
        .friend-row:hover{background:#F8F9FB}
        .rank-row{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:7px;transition:background .15s}
        .rank-row:hover{background:#F8F9FB}
        .rank-row.me{background:#EFF6FF;border:1px solid #bfdbfe}
        .cert-card{border:1px solid #e2e8f0;border-radius:10px;padding:16px;background:#fff;border-top:3px solid #2563EB;transition:box-shadow .2s}
        .cert-card:hover{box-shadow:0 6px 24px rgba(37,99,235,.10)}

        @media (max-width: 1100px){
          .grid-4{grid-template-columns:repeat(2,1fr)!important}
          .grid-2{grid-template-columns:1fr!important}
          .cert-grid{grid-template-columns:1fr!important}
        }
        @media (max-width: 720px){
          .header-nav{display:none!important}
          .hero-main{padding:0 18px 20px!important}
          .main-wrap{padding:20px 16px 48px!important}
          .grid-4{grid-template-columns:1fr!important}
          .badges-grid{grid-template-columns:repeat(2,1fr)!important}
          .shop-grid-4,.shop-grid-3,.shop-grid-2{grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FB', color: '#111827' }}>
        <DashboardNavbar />
        <div style={{ flex: 1, minWidth: 0 }}>
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            height: 60,
            background: '#fff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              className="logo-hex"
              style={{
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#2563EB',
                color: '#fff',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '-0.5px',
              }}
            >
              C:E
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.3px', color: '#111827' }}>Code:Enigma</div>
              <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#94a3b8', marginTop: 1 }}>
                Uzaktan Eğitim Platformu
              </div>
            </div>
          </div>

          <nav className="header-nav" style={{ display: 'flex', gap: 28 }}>
            {['Ana Sayfa', 'Dersler', 'Profil', 'Sıralama'].map((item) => (
              <a
                key={item}
                href="#"
                className="nav-link"
                style={{
                  fontSize: 11,
                  fontWeight: item === 'Profil' ? 700 : 500,
                  color: item === 'Profil' ? '#2563EB' : '#64748b',
                }}
              >
                {item}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="coin-chip">🪙 {formatCoin(coins)}</div>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                border: '2px solid #e2e8f0',
              }}
            >
              {selectedAvatar}
            </div>
          </div>
        </header>

        <main className="main-wrap" style={{ maxWidth: 1160, margin: '0 auto', padding: '32px 24px 60px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div className="fadein s1" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
            <div
              style={{
                height: 110,
                background:
                  'radial-gradient(circle at 20% 50%,rgba(37,99,235,.12) 0%,transparent 60%),radial-gradient(circle at 80% 50%,rgba(124,58,237,.10) 0%,transparent 60%),#F8F9FB',
                borderBottom: '1px solid #e2e8f0',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(circle,#cbd5e1 1px,transparent 1px)',
                  backgroundSize: '24px 24px',
                  opacity: 0.5,
                }}
              />
              <div style={{ position: 'absolute', top: 14, right: 20, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div className="lig" style={{ background: '#FEF3C7', color: '#92400e', border: '1px solid #fcd34d' }}>🥇 Altın Lig</div>
                <div className="lig" style={{ background: '#EFF6FF', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>◈ #4 Haftalık</div>
              </div>
            </div>

            <div className="hero-main" style={{ padding: '0 28px 24px', display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: -36, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 38,
                    border: '4px solid #fff',
                    boxShadow: '0 4px 16px rgba(0,0,0,.10)',
                  }}
                >
                  {selectedAvatar}
                </div>
                <div className="pulse-dot" style={{ position: 'absolute', bottom: 4, right: 4, width: 12, height: 12, borderRadius: '50%', background: '#059669', border: '2px solid #fff' }} />
              </div>

              <div style={{ flex: 1, paddingTop: 44, minWidth: 240 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px', color: '#111827' }}>İlkhan Arda Akmaca</h1>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7C3AED', background: '#F5F3FF', border: '1px solid #ddd6fe', padding: '2px 8px', borderRadius: 4 }}>
                    {selectedTitle}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>ilkhan.arda@code-enigma.edu · Katılım: Eylül 2024</div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 44 }}>
                {[
                  { value: 'Sv. 12', label: 'Seviye', color: '#2563EB' },
                  { value: '8 450', label: 'Toplam XP', color: '#7C3AED' },
                  { value: '🔥 12', label: 'Gün Serisi', color: '#D97706', glow: true },
                  { value: `🪙 ${formatCoin(coins)}`, label: 'Coin', color: '#D97706' },
                ].map((item) => (
                  <div key={item.label} className="stat-badge" style={{ minWidth: 90, animation: item.glow ? 'streak-glow 2s ease-in-out infinite' : undefined }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: item.color, letterSpacing: '-0.5px' }}>{item.value}</div>
                    <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2, letterSpacing: 1, textTransform: 'uppercase' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '0 28px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b' }}>Seviye 12 → 13</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#2563EB' }}>8 450 / 10 000 XP</span>
              </div>
              <ProgressBar value={84.5} color="linear-gradient(90deg,#2563EB,#7C3AED)" />
              <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 5 }}>
                Bir sonraki seviyeye <strong style={{ color: '#2563EB' }}>1 550 XP</strong> kaldı
              </div>
            </div>
          </div>

          <div className="fadein s2 grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {stats.map((item) => (
              <div key={item.label} className="card" style={{ padding: 20, borderTop: `3px solid ${item.color}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: item.color, marginBottom: 10 }}>
                  {item.icon} {item.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>{item.value}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{item.sub}</div>
                <div style={{ marginTop: 12 }}>
                  <ProgressBar value={item.progress} color={item.color} />
                </div>
              </div>
            ))}
          </div>

          <div className="fadein s3 grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="card" style={{ padding: 22 }}>
                <SectionLabel>Günlük Görevler</SectionLabel>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 14 }}>Bugün: Pazartesi · {completedTasks}/{tasks.length} tamamlandı</div>
                <div style={{ marginBottom: 16 }}>
                  <ProgressBar value={dailyProgress} color="linear-gradient(90deg,#2563EB,#059669)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {tasks.map((task) => (
                    <div key={task.id} className={`task-row ${task.done ? 'done' : ''}`} onClick={() => toggleTask(task.id)}>
                      <div className="task-check">
                        {task.done ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : null}
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: task.done ? '#065f46' : '#374151',
                          textDecoration: task.done ? 'line-through' : 'none',
                          flex: 1,
                        }}
                      >
                        {task.title}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: task.done ? '#059669' : '#94a3b8' }}>+{task.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 22 }}>
                <SectionLabel color="#7C3AED">Hedefler</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                  {[
                    { label: 'Günlük · 20 dk çalış', value: '18/20 dk', progress: 90, color: '#2563EB' },
                    { label: 'Haftalık · 3 ders bitir', value: '2/3 ders', progress: 66, color: '#7C3AED' },
                    { label: 'Aylık · 1 kurs tamamla', value: '1/1 ✓', progress: 100, color: '#059669' },
                  ].map((goal) => (
                    <div key={goal.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{goal.label}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: goal.color }}>{goal.value}</span>
                      </div>
                      <ProgressBar value={goal.progress} color={goal.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 22 }}>
              <SectionLabel color="#D97706">Başarımlar & Rozetler</SectionLabel>
              <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 16 }}>8 / 12 rozet kazanıldı</div>
              <div className="badges-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {badges.map((badge, index) => (
                  <div key={`${badge.title}-${index}`} className={`badge-item ${badge.locked ? 'locked' : 'bounce-in'} s${(index % 6) + 1}`}>
                    <div className="badge-icon" style={{ background: badge.bg }}>{badge.icon}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: '#374151', lineHeight: 1.3 }}>{badge.title}</div>
                    <div style={{ fontSize: 8, color: badge.color, fontWeight: 700 }}>{badge.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fadein s4 grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 10, flexWrap: 'wrap' }}>
                <SectionLabel color="#D97706">Lig & Sıralama</SectionLabel>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[
                    ['haftalik', 'Haftalık'],
                    ['sinif', 'Sınıf'],
                    ['arkadaslar', 'Arkadaşlar'],
                  ].map(([key, label]) => (
                    <button key={key} className={`tab-btn ${ligTab === key ? 'active' : ''}`} onClick={() => setLigTab(key)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFFBEB', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', margin: '12px 0' }}>
                <div style={{ fontSize: 28 }}>🥇</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e' }}>Altın Lig</div>
                  <div style={{ fontSize: 9, color: '#b45309' }}>Bu haftaki sıralama: <strong>#4</strong> · 2 750 puan</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 9, color: '#b45309', fontWeight: 700 }}>↑ Elmas'a 250 puan kaldı</div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <ProgressBar value={78} color="linear-gradient(90deg,#D97706,#f59e0b)" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {currentRanking.map((row) => (
                  <div key={`${ligTab}-${row.rank}-${row.name}`} className={`rank-row ${row.me ? 'me' : ''}`}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: row.me ? '#2563EB' : row.rank === '🥇' ? '#D97706' : row.rank === '🥈' ? '#94a3b8' : row.rank === '🥉' ? '#b45309' : '#94a3b8', width: 22 }}>
                      {row.rank}
                    </span>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                      {row.avatar}
                    </div>
                    <span style={{ fontSize: 11, flex: 1, color: row.me ? '#1d4ed8' : '#374151', fontWeight: row.me ? 700 : 500 }}>{row.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: row.me ? '#2563EB' : '#374151' }}>{row.points}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
                <SectionLabel color="#059669">Arkadaşlar</SectionLabel>
                <button onClick={handleAddFriend} style={{ background: '#EFF6FF', border: '1px solid #bfdbfe', color: '#2563EB', fontSize: 10, fontWeight: 700, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontFamily: 'IBM Plex Mono', letterSpacing: '.5px' }}>
                  + Arkadaş Ekle
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {friendsSeed.map((friend) => {
                  const cheered = cheeredFriends.includes(friend.id);
                  return (
                    <div key={friend.id} className="friend-row">
                      <div style={{ fontSize: 20 }}>{friend.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{friend.name}</div>
                        <div style={{ fontSize: 9, color: '#94a3b8' }}>{friend.level}</div>
                      </div>
                      <button
                        onClick={() => handleCheer(friend.id)}
                        disabled={cheered}
                        style={{
                          background: '#ECFDF5',
                          border: '1px solid #6ee7b7',
                          color: '#059669',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 5,
                          cursor: cheered ? 'default' : 'pointer',
                          fontFamily: 'IBM Plex Mono',
                          opacity: cheered ? 0.6 : 1,
                        }}
                      >
                        {cheered ? '👏 Gönderildi!' : '👏 Alkış'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 16, padding: '12px 14px', background: '#F5F3FF', border: '1px solid #ddd6fe', borderRadius: 8 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7C3AED', marginBottom: 6 }}>⌖ Takım Görevi</div>
                <div style={{ fontSize: 11, color: '#374151', marginBottom: 8 }}>Grup: 100 soru çözün · 72/100</div>
                <ProgressBar value={72} color="#7C3AED" />
              </div>
            </div>
          </div>

          <div className="fadein s5 grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card" style={{ padding: 22 }}>
              <SectionLabel color="#059669">Öğrenme Yolculuğu</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 4 }}>
                {journey.map((step, index) => {
                  const toneStyles = {
                    done: { card: { borderColor: '#059669', background: '#ECFDF5' }, dot: { background: '#059669' }, title: '#065f46', desc: '#059669', badgeBg: '#D1FAE5', badgeColor: '#059669', badge: step.status },
                    active: { card: { borderColor: '#2563EB', background: '#EFF6FF', boxShadow: '0 0 0 3px #DBEAFE' }, dot: { background: '#2563EB', boxShadow: '0 0 0 3px #BFDBFE' }, title: '#1d4ed8', desc: '#2563EB', badgeBg: '#DBEAFE', badgeColor: '#2563EB', badge: step.status },
                    locked: { card: { opacity: 0.5 }, dot: { background: '#cbd5e1' }, title: '#64748b', desc: '#94a3b8', badgeColor: '#94a3b8', badge: step.status },
                    'locked-soft': { card: { opacity: 0.4 }, dot: { background: '#e2e8f0' }, title: '#94a3b8', desc: '#cbd5e1', badgeColor: '#cbd5e1', badge: step.status },
                  }[step.tone];

                  return (
                    <div key={step.title}>
                      <div className="j-node" style={toneStyles.card}>
                        <div className="j-dot" style={toneStyles.dot} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: toneStyles.title }}>{step.title}</div>
                          <div style={{ fontSize: 9, color: toneStyles.desc }}>{step.desc}</div>
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: toneStyles.badgeColor,
                            background: toneStyles.badgeBg,
                            padding: toneStyles.badgeBg ? '2px 7px' : undefined,
                            borderRadius: toneStyles.badgeBg ? 4 : undefined,
                          }}
                        >
                          {toneStyles.badge}
                        </div>
                      </div>
                      {index < journey.length - 1 ? <div className="j-line" style={index === 0 ? { background: '#059669' } : index === 1 ? { background: '#2563EB' } : undefined} /> : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="card" style={{ padding: 22 }}>
                <SectionLabel color="#7C3AED">Öğrenme Analizi</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                  {[
                    ['En Güçlü Alan', 'Sayı Teorisi', '91% başarı', '#7C3AED'],
                    ['En Aktif Saat', '20:00–22:00', 'Akşam tipi', '#2563EB'],
                    ['Çalışma Tarzı', 'Rekabetçi', 'Kısa–yoğun seans', '#059669'],
                    ['En İyi Konu', 'Asal Sayılar', '%94 doğru', '#D97706'],
                  ].map(([label, value, sub, color]) => (
                    <div key={label} className="stat-badge" style={{ textAlign: 'left', padding: 12 }}>
                      <div style={{ fontSize: 9, color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color }}>{value}</div>
                      <div style={{ fontSize: 9, color, marginTop: 2 }}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 22, background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)', border: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#38bdf8' }}>Sezonluk Etkinlik — Kış Olimpiyatı</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>❄️ Kış Matematik Olimpiyatı 2025</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 12 }}>Bitiş: 31 Ocak · 14 gün kaldı</div>
                <div style={{ marginBottom: 10 }}>
                  <ProgressBar value={62} color="linear-gradient(90deg,#38bdf8,#818cf8)" background="rgba(255,255,255,.1)" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>Sıralama: <strong style={{ color: '#38bdf8' }}>#4</strong></span>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>Puan: <strong style={{ color: '#818cf8' }}>620 / 1000</strong></span>
                </div>
                <button
                  onClick={handleEventJoin}
                  style={{ width: '100%', marginTop: 12, background: 'rgba(56,189,248,.15)', border: '1px solid rgba(56,189,248,.3)', color: '#38bdf8', fontSize: 10, fontWeight: 700, padding: 8, borderRadius: 6, cursor: 'pointer', fontFamily: 'IBM Plex Mono', letterSpacing: '.5px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56,189,248,.25)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(56,189,248,.15)')}
                >
                  Etkinliğe Katıl →
                </button>
              </div>
            </div>
          </div>

          <div className="fadein s6">
            <SectionLabel>Sertifikalar & Başarılar</SectionLabel>
            <div className="cert-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 4 }}>
              {certificates.map((cert) => (
                <div key={cert.title} className="cert-card" style={{ borderTopColor: cert.color }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: cert.color, marginBottom: 8 }}>{cert.type}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{cert.title}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 12 }}>{cert.meta}</div>
                  <button onClick={() => handleDownload(cert.title)} style={{ background: cert.bg, border: `1px solid ${cert.color === '#D97706' ? '#fcd34d' : cert.color === '#7C3AED' ? '#ddd6fe' : '#bfdbfe'}`, color: cert.color === '#D97706' ? '#92400e' : cert.color, fontSize: 10, fontWeight: 700, padding: '6px 12px', borderRadius: 5, cursor: 'pointer', fontFamily: 'IBM Plex Mono' }}>
                    {cert.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card" style={{ padding: 22 }}>
              <SectionLabel color="#D97706">Coin Shop</SectionLabel>
              <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 14 }}>Bakiyen: <strong style={{ color: '#D97706' }}>🪙 {formatCoin(coins)}</strong></div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14, borderBottom: '1px solid #e2e8f0', paddingBottom: 12, flexWrap: 'wrap' }}>
                {[
                  ['avatars', 'Avatar'],
                  ['frames', 'Çerçeve'],
                  ['themes', 'Tema'],
                  ['rewards', 'Ödüller'],
                ].map(([key, label]) => (
                  <button key={key} className={`tab-btn ${shopTab === key ? 'active' : ''}`} onClick={() => setShopTab(key)}>
                    {label}
                  </button>
                ))}
              </div>

              {shopTab === 'avatars' && (
                <div className="shop-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {shopData.avatars.map((item) => {
                    const owned = item.owned || ownedItems.includes(item.id);
                    return (
                      <div key={item.id} className={`shop-item ${owned ? 'owned' : ''}`} onClick={() => handleBuyItem(item)}>
                        <div style={{ fontSize: 26, marginBottom: 4 }}>{item.icon}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: owned ? '#059669' : getPriceColor(item) }}>{owned ? item.label || '✓ Sahipsin' : `🪙 ${item.cost}`}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {shopTab === 'frames' && (
                <div className="shop-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {shopData.frames.map((item) => {
                    const owned = item.owned || ownedItems.includes(item.id);
                    return (
                      <div key={item.id} className={`shop-item ${owned ? 'owned' : ''}`} onClick={() => handleBuyItem(item)}>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{item.icon}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: owned ? '#059669' : getPriceColor(item) }}>{owned ? item.label || '✓ Sahipsin' : `🪙 ${item.cost}`}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {shopTab === 'themes' && (
                <div className="shop-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {shopData.themes.map((item) => {
                    const owned = item.owned || ownedItems.includes(item.id);
                    return (
                      <div key={item.id} className={`shop-item ${owned ? 'owned' : ''}`} onClick={() => handleBuyItem(item)}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            background: item.gradient || item.swatch,
                            border: item.border ? '2px solid #e2e8f0' : undefined,
                            margin: '0 auto 4px',
                          }}
                        />
                        <div style={{ fontSize: 9, fontWeight: 700, color: owned ? '#059669' : getPriceColor(item) }}>{owned ? item.label || '✓ Sahipsin' : `🪙 ${item.cost}`}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {shopTab === 'rewards' && (
                <div className="shop-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {shopData.rewards.map((item) => {
                    const owned = ownedItems.includes(item.id);
                    return (
                      <div key={item.id} className={`shop-item ${owned ? 'owned' : ''}`} onClick={() => handleBuyItem(item)} style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}>
                        <div style={{ fontSize: 20 }}>{item.icon}</div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: '#374151' }}>{item.title}</div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: owned ? '#059669' : getPriceColor(item) }}>{owned ? '✓ Sahipsin' : `🪙 ${item.cost}`}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card" style={{ padding: 22 }}>
              <SectionLabel color="#7C3AED">Kişiselleştirme</SectionLabel>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>Avatar</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {availableAvatars.map((avatar) => (
                    <button key={avatar} type="button" className={`av-opt ${selectedAvatar === avatar ? 'selected' : ''}`} onClick={() => setSelectedAvatar(avatar)}>
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>Ünvan</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {availableTitles.map((title) => (
                    <button
                      key={title}
                      className={`tab-btn ${selectedTitle === title ? 'active' : ''}`}
                      style={{ border: `1px solid ${selectedTitle === title ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: 5, padding: '4px 10px', fontSize: 9 }}
                      onClick={() => setSelectedTitle(title)}
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>Vitrin Rozetleri (3 seç)</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[
                    ['🎓', '#EFF6FF', '#2563EB'],
                    ['🔥', '#FFFBEB', '#D97706'],
                    ['💯', '#ECFDF5', '#059669'],
                  ].map(([icon, bg, border]) => (
                    <div key={icon} style={{ width: 44, height: 44, borderRadius: 10, background: bg, border: `2px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {icon}
                    </div>
                  ))}
                  <button type="button" onClick={() => window.alert('Rozet seçin!')} style={{ width: 44, height: 44, borderRadius: 10, background: '#F8F9FB', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#94a3b8', cursor: 'pointer' }}>
                    +
                  </button>
                </div>
              </div>

              <div style={{ background: '#F8F9FB', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
                  {selectedAvatar}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>İlkhan Arda Akmaca</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#7C3AED', background: '#F5F3FF', border: '1px solid #ddd6fe', padding: '2px 7px', borderRadius: 3, display: 'inline-block', marginTop: 3 }}>
                    {selectedTitle}
                  </div>
                </div>
                <button onClick={handleSave} style={{ marginLeft: 'auto', background: '#2563EB', border: 'none', color: '#fff', fontSize: 10, fontWeight: 700, padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontFamily: 'IBM Plex Mono', transition: 'background .15s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')} onMouseLeave={(e) => (e.currentTarget.style.background = '#2563EB')}>
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', minHeight: 52, background: '#fff', borderTop: '1px solid #e2e8f0', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="logo-hex" style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2563EB', color: '#fff', fontWeight: 700, fontSize: 8 }}>
              C:E
            </div>
            <span style={{ fontWeight: 600, fontSize: 12, color: '#111827' }}>Code:Enigma</span>
          </div>
          <p style={{ fontSize: 10, color: '#94a3b8' }}>© 2025 Açık ve Uzaktan Eğitim Projesi. Tüm hakları saklıdır.</p>
        </footer>

        </div>
      </div>
    </>
  );
}
