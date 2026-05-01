import { useMemo, useState } from "react";
import Icon from "../../components/ui/icons8-icon.jsx";
import {
  DashboardShell,
  PageHeader,
  ProgressBar,
  SectionLabel,
  Surface,
  StatusBadge,
} from "../../components/dashboard/dashboard-design.jsx";

const initialTasks = [
  { id: 1, title: "1 ders tamamla", xp: 50, done: true },
  { id: 2, title: "10 soru çöz", xp: 80, done: true },
  { id: 3, title: "20 dakika çalış", xp: 60, done: true },
  { id: 4, title: "Not al", xp: 40, done: false },
  { id: 5, title: "Bir başarı rozeti kazan", xp: 100, done: false },
];

const stats = [
  { label: "Kurslar", value: "14", sub: "Tamamlanan kurs", progress: 70, color: "#2563EB", icon: "goals" },
  { label: "Dersler", value: "138", sub: "Bitirilen ders", progress: 82, color: "#7C3AED", icon: "stats" },
  { label: "Quizler", value: "312", sub: "Çözülen quiz", progress: 60, color: "#059669", icon: "journey" },
  { label: "Başarı", value: "87%", sub: "Doğru cevap oranı", progress: 87, color: "#D97706", icon: "tasks" },
];

const badges = [
  { icon: "graduation", title: "İlk Ders", status: "Kazanıldı", bg: "#EFF6FF", color: "#2563EB", locked: false },
  { icon: "streak", title: "7 Gün Seri", status: "Kazanıldı", bg: "#FFFBEB", color: "#D97706", locked: false },
  { icon: "chart", title: "İlk 100", status: "Kazanıldı", bg: "#ECFDF5", color: "#059669", locked: false },
  { icon: "book_stack", title: "5 Kurs", status: "Kazanıldı", bg: "#F5F3FF", color: "#7C3AED", locked: false },
  { icon: "bolt", title: "Hızlı Öğr.", status: "Kazanıldı", bg: "#FFFBEB", color: "#D97706", locked: false },
  { icon: "trophy", title: "Şampiyon", status: "Kazanıldı", bg: "#FEF2F2", color: "#DC2626", locked: false },
  { icon: "frame_star", title: "30 Gün", status: "Kazanıldı", bg: "#EFF6FF", color: "#2563EB", locked: false },
  { icon: "handshake", title: "Takım Oyun.", status: "Kazanıldı", bg: "#F5F3FF", color: "#7C3AED", locked: false },
  { icon: "lock", title: "Mükemmel", status: "Kilitli", bg: "#F8FAFC", color: "#94A3B8", locked: true },
  { icon: "lock", title: "Sezonal", status: "Kilitli", bg: "#F8FAFC", color: "#94A3B8", locked: true },
  { icon: "lock", title: "Elmas", status: "Kilitli", bg: "#F8FAFC", color: "#94A3B8", locked: true },
  { icon: "lock", title: "Lejant", status: "Kilitli", bg: "#F8FAFC", color: "#94A3B8", locked: true },
];

const rankingSets = {
  haftalik: [
    { rank: "1", rankIcon: "medal_gold", avatar: "avatar_tiger", name: "Zeynep Ç.", points: "3 420 pts", bg: "#EFF6FF" },
    { rank: "2", rankIcon: "medal_silver", avatar: "avatar_panda", name: "Rızgar O.", points: "3 180 pts", bg: "#F5F3FF" },
    { rank: "3", rankIcon: "medal_bronze", avatar: "avatar_lion", name: "Rojhat T.", points: "2 990 pts", bg: "#ECFDF5" },
    { rank: "#4", avatar: "avatar_fox", name: "Sen (İlkhan)", points: "2 750 pts", bg: "linear-gradient(135deg,#2563EB,#7C3AED)", me: true },
    { rank: "#5", avatar: "avatar_rabbit", name: "Burak Y.", points: "2 620 pts", bg: "#FFFBEB" },
  ],
  sinif: [
    { rank: "#1", avatar: "avatar_lion", name: "Rojhat Taş", points: "97 puan", bg: "#ECFDF5" },
    { rank: "#2", avatar: "avatar_fox", name: "Sen (İlkhan)", points: "95 puan", bg: "linear-gradient(135deg,#2563EB,#7C3AED)", me: true },
    { rank: "#3", avatar: "avatar_tiger", name: "Zeynep Çiftçi", points: "93 puan", bg: "#EFF6FF" },
    { rank: "#4", avatar: "avatar_panda", name: "Rızgar Ozan", points: "92 puan", bg: "#F5F3FF" },
    { rank: "#5", avatar: "avatar_rabbit", name: "Burak Yıldız", points: "89 puan", bg: "#FFFBEB" },
  ],
  arkadaslar: [
    { rank: "#1", avatar: "avatar_tiger", name: "Zeynep Çiftçi", points: "8 920 XP", bg: "#EFF6FF" },
    { rank: "#2", avatar: "avatar_lion", name: "Rojhat Taş", points: "8 710 XP", bg: "#ECFDF5" },
    { rank: "#3", avatar: "avatar_fox", name: "Sen (İlkhan)", points: "8 450 XP", bg: "linear-gradient(135deg,#2563EB,#7C3AED)", me: true },
    { rank: "#4", avatar: "avatar_panda", name: "Rızgar Ozan", points: "8 120 XP", bg: "#F5F3FF" },
    { rank: "#5", avatar: "avatar_rabbit", name: "Burak Yıldız", points: "7 860 XP", bg: "#FFFBEB" },
  ],
};

const friendsSeed = [
  { id: 1, avatar: "avatar_tiger", name: "Zeynep Çiftçi", level: "Sv.14", streak: "21 gün seri" },
  { id: 2, avatar: "avatar_panda", name: "Rızgar Ozan", level: "Sv.11", streak: "8 gün seri" },
  { id: 3, avatar: "avatar_lion", name: "Rojhat Taş", level: "Sv.13", streak: "15 gün seri" },
  { id: 4, avatar: "avatar_rabbit", name: "Burak Yıldız", level: "Sv.10", streak: "5 gün seri" },
];

const journey = [
  { title: "Temel Matematik", desc: "Tamamlandı · 8 modül", status: "100%", tone: "done" },
  { title: "Cebir I", desc: "Tamamlandı · 12 modül", status: "100%", tone: "done" },
  { title: "Cebir II · Aktif", desc: "Şu an burada · 5/14 modül", status: "36%", tone: "active" },
  { title: "Geometri", desc: "Kilitli · Hedef: Cebir II bitir", status: "Kilitli", tone: "locked" },
  { title: "Sayı Teorisi", desc: "Kilitli", status: "Kilitli", tone: "locked-soft" },
];

const certificates = [
  { type: "Kurs Sertifikası", title: "Temel Matematik", meta: "Tamamlanma: Ekim 2024", color: "#2563EB", bg: "#EFF6FF", action: "İndir" },
  { type: "Kurs Sertifikası", title: "Cebir I", meta: "Tamamlanma: Kasım 2024", color: "#7C3AED", bg: "#F5F3FF", action: "İndir" },
  { type: "Etkinlik Belgesi", title: "Sonbahar Olimpiyatı", meta: "Katılım: Kasım 2024 · İkincilik", color: "#D97706", bg: "#FFFBEB", action: "İndir" },
];

const shopData = {
  avatars: [
    { id: "current-avatar", icon: "avatar_fox", label: "Mevcut", owned: true },
    { id: "a1", icon: "avatar_tiger", cost: 200 },
    { id: "a2", icon: "avatar_butterfly", cost: 350 },
    { id: "a3", icon: "avatar_dragon", cost: 500, rare: true },
    { id: "a4", icon: "avatar_unicorn", cost: 150 },
    { id: "a5", icon: "avatar_wolf", cost: 400 },
  ],
  frames: [
    { id: "f0", icon: "frame_default", label: "Varsayılan", owned: true },
    { id: "f1", icon: "frame_star", cost: 300 },
    { id: "f2", icon: "frame_crystal", cost: 450 },
    { id: "f3", icon: "crown", cost: 700, rare: true },
  ],
  themes: [
    { id: "t0", swatch: "#F8F9FB", label: "Mevcut", owned: true, border: true },
    { id: "t1", gradient: "linear-gradient(135deg,#2563EB,#7C3AED)", cost: 300 },
    { id: "t2", gradient: "linear-gradient(135deg,#059669,#0284c7)", cost: 300 },
    { id: "t3", gradient: "linear-gradient(135deg,#D97706,#DC2626)", cost: 400 },
  ],
  rewards: [
    { id: "r1", icon: "timer", title: "2x XP (1 gün)", cost: 100 },
    { id: "r2", icon: "shield", title: "Seri Koruma", cost: 200 },
    { id: "r3", icon: "idea", title: "İpucu Joker", cost: 150 },
    { id: "r4", icon: "gift", title: "Mini Ödül Kutusu", cost: 500, rare: true },
  ],
};

const availableAvatars = ["avatar_fox", "avatar_tiger", "avatar_butterfly", "avatar_unicorn", "avatar_wolf", "avatar_eagle"];
const availableTitles = ["Hızlı Öğrenen", "Seri Ustası", "Şampiyon", "5 Kurs"];

const formatCoin = (value) => new Intl.NumberFormat("tr-TR").format(value);

function getPriceColor(item) {
  if (item.epic) return "#7C3AED";
  if (item.rare) return "#DC2626";
  return "#D97706";
}

function MetricCard({ item }) {
  return (
    <Surface className="p-5" hover>
      <div className="mb-4 flex items-center justify-between gap-3">
        <SectionLabel color={item.color}>{item.label}</SectionLabel>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: `${item.color}14` }}>
          <Icon name={item.icon} size={17} color={item.color} />
        </span>
      </div>
      <div className="text-[30px] font-bold leading-none tracking-[-0.04em] text-slate-950">{item.value}</div>
      <div className="mt-2 text-[11px] leading-5 text-slate-500">{item.sub}</div>
      <div className="mt-4">
        <ProgressBar value={item.progress} color={item.color} />
      </div>
    </Surface>
  );
}

function RankRow({ row }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 ${
      row.me ? "border-blue-200 bg-blue-50/80" : "border-white/70 bg-white/58"
    }`}>
      <span className={`flex w-8 items-center justify-center text-[12px] font-bold ${row.me ? "text-blue-600" : "text-slate-400"}`}>
        {row.rankIcon ? <Icon name={row.rankIcon} size={15} color={row.me ? "#2563EB" : "#94A3B8"} /> : row.rank}
      </span>
      <span className="flex h-9 w-9 items-center justify-center rounded-2xl" style={{ background: row.bg }}>
        <Icon name={row.avatar} size={19} />
      </span>
      <span className={`min-w-0 flex-1 truncate text-[12px] font-bold ${row.me ? "text-blue-700" : "text-slate-700"}`}>
        {row.name}
      </span>
      <span className={`whitespace-nowrap text-[11px] font-bold ${row.me ? "text-blue-600" : "text-slate-500"}`}>
        {row.points}
      </span>
    </div>
  );
}

function ShopItem({ item, owned, onBuy }) {
  const isOwned = owned || item.owned;
  const priceColor = getPriceColor(item);

  return (
    <button
      type="button"
      onClick={() => onBuy(item)}
      className={`ce-card-hover min-h-[96px] rounded-2xl border p-3 text-center ${
        isOwned ? "border-emerald-200 bg-emerald-50/80" : "border-white/70 bg-white/62 hover:border-blue-200"
      }`}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/80">
        {item.icon ? (
          <Icon name={item.icon} size={22} color={item.icon.includes("frame") ? priceColor : undefined} />
        ) : (
          <span
            className="h-8 w-8 rounded-xl border"
            style={{ background: item.gradient || item.swatch, borderColor: item.border ? "#CBD5E1" : "transparent" }}
          />
        )}
      </div>
      <div className="mt-2 truncate text-[10px] font-bold text-slate-700">
        {item.label || item.title || (isOwned ? "Mevcut" : `${item.cost} coin`)}
      </div>
      <div className="mt-1 inline-flex items-center justify-center gap-1 text-[9px] font-bold" style={{ color: isOwned ? "#059669" : priceColor }}>
        {isOwned ? (
          <>
            <Icon name="check" size={9} color="#059669" /> Sahip
          </>
        ) : (
          <>
            <Icon name="coin" size={9} color={priceColor} /> {item.cost}
          </>
        )}
      </div>
    </button>
  );
}

export default function Profile() {
  const [tasks, setTasks] = useState(initialTasks);
  const [ligTab, setLigTab] = useState("haftalik");
  const [shopTab, setShopTab] = useState("avatars");
  const [coins, setCoins] = useState(1240);
  const [selectedAvatar, setSelectedAvatar] = useState("avatar_fox");
  const [selectedTitle, setSelectedTitle] = useState("Hızlı Öğrenen");
  const [cheeredFriends, setCheeredFriends] = useState([]);
  const [ownedItems, setOwnedItems] = useState(["current-avatar", "f0", "t0"]);

  const completedTasks = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const dailyProgress = (completedTasks / tasks.length) * 100;
  const currentRanking = rankingSets[ligTab];

  const toggleTask = (taskId) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)));
  };

  const handleCheer = (friendId) => {
    setCheeredFriends((prev) => (prev.includes(friendId) ? prev : [...prev, friendId]));
  };

  const handleBuyItem = (item) => {
    if (ownedItems.includes(item.id) || item.owned) return;
    if (coins < item.cost) {
      window.alert("Yeterli coin yok.");
      return;
    }
    if (!window.confirm(`Bu ürünü ${item.cost} coin ile satın almak ister misiniz?`)) return;
    setCoins((prev) => prev - item.cost);
    setOwnedItems((prev) => [...prev, item.id]);
  };

  const handleSave = () => window.alert("Profil kaydedildi.");
  const handleAddFriend = () => window.alert("Arkadaş ekleme açıldı!");
  const handleDownload = (label) => window.alert(`${label} indiriliyor...`);

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Kişisel Gelişim"
        title="Profil"
        description="Seviye, rozet, hedef, sosyal ilerleme ve mağaza yönetimini tek ekranda takip et."
        icon="profile"
        iconColor="#2563EB"
        stats={[
          { value: "Sv. 12", label: "Seviye", color: "#2563EB", icon: "goals" },
          { value: "8 450", label: "Toplam XP", color: "#7C3AED", icon: "xp_log" },
          { value: formatCoin(coins), label: "Coin", color: "#D97706", icon: "coin" },
        ]}
        actions={
          <StatusBadge color="#D97706" bg="#FFFBEB">
            Altın Lig
          </StatusBadge>
        }
      />

      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-6">
          <Surface className="overflow-hidden p-0">
            <div className="relative min-h-[120px] border-b border-white/70 bg-[linear-gradient(135deg,rgba(37,99,235,0.14),rgba(124,58,237,0.10),rgba(255,255,255,0.66))]">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(37,99,235,0.12) 1px, transparent 1px), linear-gradient(rgba(37,99,235,0.09) 1px, transparent 1px)",
                  backgroundSize: "26px 26px",
                }}
              />
              <div className="absolute right-5 top-5 flex flex-wrap items-center gap-2">
                <StatusBadge color="#D97706" bg="#FFFBEB">
                  <Icon name="medal_gold" size={10} color="#D97706" />
                  Altın Lig
                </StatusBadge>
                <StatusBadge color="#2563EB" bg="#EFF6FF">
                  #4 Haftalık
                </StatusBadge>
              </div>
            </div>

            <div className="grid gap-5 px-5 pb-6 pt-0 sm:px-7 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-end">
              <div className="-mt-10 flex items-end gap-4">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border-[5px] border-white bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_22px_42px_rgba(37,99,235,0.22)]">
                    <Icon name={selectedAvatar} size={46} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
                </div>
                <div className="pb-1">
                  <h2 className="text-[22px] font-bold leading-tight tracking-[-0.03em] text-slate-950">
                    İlkhan Arda Akmaca
                  </h2>
                  <div className="mt-2 inline-flex rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[1.4px] text-violet-700">
                    {selectedTitle}
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    ilkhan.arda@code-enigma.edu · Katılım: Eylül 2024
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: "12", label: "Gün Serisi", color: "#D97706", icon: "streak" },
                  { value: "87%", label: "Başarı", color: "#059669", icon: "chart" },
                  { value: "312", label: "Quiz", color: "#7C3AED", icon: "test" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/70 bg-white/58 px-4 py-3">
                    <div className="inline-flex items-center gap-2 text-[19px] font-bold leading-none" style={{ color: item.color }}>
                      <Icon name={item.icon} size={15} color={item.color} />
                      {item.value}
                    </div>
                    <div className="mt-1 text-[9px] font-semibold uppercase tracking-[1.4px] text-slate-400">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="min-w-[220px]">
                <div className="mb-2 flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">Seviye 12 -&gt; 13</span>
                  <span className="text-blue-600">8 450 / 10 000 XP</span>
                </div>
                <ProgressBar value={84.5} color="linear-gradient(90deg,#2563EB,#7C3AED)" />
                <p className="mt-2 text-[10px] leading-5 text-slate-500">
                  Bir sonraki seviyeye <span className="font-bold text-blue-600">1 550 XP</span> kaldı.
                </p>
              </div>
            </div>
          </Surface>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <MetricCard key={item.label} item={item} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
            <section className="flex min-w-0 flex-col gap-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Surface className="p-5 sm:p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <SectionLabel>Günlük Görevler</SectionLabel>
                    <span className="text-[10px] font-bold text-slate-400">{completedTasks}/{tasks.length} tamamlandı</span>
                  </div>
                  <ProgressBar value={dailyProgress} color="linear-gradient(90deg,#2563EB,#059669)" />
                  <div className="mt-4 flex flex-col gap-2.5">
                    {tasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all ${
                          task.done
                            ? "border-emerald-200 bg-emerald-50/80 text-emerald-800"
                            : "border-white/70 bg-white/60 text-slate-700 hover:border-blue-200 hover:bg-blue-50/60"
                        }`}
                      >
                        <span className={`flex h-6 w-6 items-center justify-center rounded-lg border ${
                          task.done ? "border-emerald-500 bg-emerald-500" : "border-slate-200 bg-white"
                        }`}>
                          {task.done ? <Icon name="check" size={10} color="#ffffff" /> : null}
                        </span>
                        <span className={`min-w-0 flex-1 text-[12px] font-bold ${task.done ? "line-through" : ""}`}>
                          {task.title}
                        </span>
                        <span className="text-[10px] font-bold">+{task.xp} XP</span>
                      </button>
                    ))}
                  </div>
                </Surface>

                <Surface className="p-5 sm:p-6">
                  <div className="mb-4">
                    <SectionLabel color="#7C3AED">Hedefler</SectionLabel>
                  </div>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: "Günlük · 20 dk çalış", value: "18/20 dk", progress: 90, color: "#2563EB" },
                      { label: "Haftalık · 3 ders bitir", value: "2/3 ders", progress: 66, color: "#7C3AED" },
                      { label: "Aylık · 1 kurs tamamla", value: "1/1", progress: 100, color: "#059669" },
                    ].map((goal) => (
                      <div key={goal.label}>
                        <div className="mb-2 flex justify-between gap-3 text-[11px] font-bold">
                          <span className="text-slate-600">{goal.label}</span>
                          <span style={{ color: goal.color }}>{goal.value}</span>
                        </div>
                        <ProgressBar value={goal.progress} color={goal.color} />
                      </div>
                    ))}
                  </div>
                </Surface>
              </div>

              <Surface className="p-5 sm:p-6">
                <div className="mb-4">
                  <SectionLabel color="#059669">Öğrenme Yolculuğu</SectionLabel>
                </div>
                <div className="grid gap-3 lg:grid-cols-5">
                  {journey.map((step) => {
                    const tone = {
                      done: { color: "#059669", bg: "#ECFDF5", icon: "check" },
                      active: { color: "#2563EB", bg: "#EFF6FF", icon: "play" },
                      locked: { color: "#94A3B8", bg: "#F8FAFC", icon: "lock" },
                      "locked-soft": { color: "#CBD5E1", bg: "#F8FAFC", icon: "lock" },
                    }[step.tone];

                    return (
                      <div key={step.title} className="rounded-2xl border border-white/70 bg-white/58 p-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: tone.bg }}>
                          <Icon name={tone.icon} size={14} color={tone.color} />
                        </span>
                        <h3 className="mt-3 text-[12px] font-bold leading-5 text-slate-800">{step.title}</h3>
                        <p className="mt-1 min-h-[36px] text-[10px] leading-5 text-slate-500">{step.desc}</p>
                        <StatusBadge color={tone.color} bg={tone.bg} className="mt-3">
                          {step.status}
                        </StatusBadge>
                      </div>
                    );
                  })}
                </div>
              </Surface>

              <Surface className="p-5 sm:p-6">
                <div className="mb-4">
                  <SectionLabel color="#2563EB">Sertifikalar</SectionLabel>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {certificates.map((cert) => (
                    <div key={cert.title} className="rounded-2xl border border-white/70 bg-white/58 p-4">
                      <div className="text-[9px] font-bold uppercase tracking-[1.5px]" style={{ color: cert.color }}>
                        {cert.type}
                      </div>
                      <h3 className="mt-2 text-[14px] font-bold text-slate-900">{cert.title}</h3>
                      <p className="mt-1 text-[10px] leading-5 text-slate-500">{cert.meta}</p>
                      <button
                        type="button"
                        onClick={() => handleDownload(cert.title)}
                        className="mt-4 inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-[10px] font-bold"
                        style={{ color: cert.color, background: cert.bg, borderColor: `${cert.color}33` }}
                      >
                        <Icon name="download" size={10} color={cert.color} />
                        {cert.action}
                      </button>
                    </div>
                  ))}
                </div>
              </Surface>
            </section>

            <aside className="flex min-w-0 flex-col gap-6">
              <Surface className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <SectionLabel color="#D97706">Başarımlar</SectionLabel>
                  <span className="text-[10px] font-bold text-slate-400">8 / 12 rozet</span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.title}
                      className={`rounded-2xl border border-white/70 bg-white/58 px-2 py-3 text-center ${badge.locked ? "opacity-45 grayscale" : ""}`}
                    >
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: badge.bg }}>
                        <Icon name={badge.icon} size={20} color={badge.color} />
                      </div>
                      <div className="mt-2 truncate text-[9px] font-bold text-slate-700">{badge.title}</div>
                      <div className="mt-1 text-[8px] font-bold uppercase tracking-[1px]" style={{ color: badge.color }}>
                        {badge.status}
                      </div>
                    </div>
                  ))}
                </div>
              </Surface>

              <Surface className="p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <SectionLabel color="#D97706">Lig & Sıralama</SectionLabel>
                  <div className="flex rounded-2xl border border-white/70 bg-white/60 p-1">
                    {[
                      ["haftalik", "Haftalık"],
                      ["sinif", "Sınıf"],
                      ["arkadaslar", "Arkadaş"],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setLigTab(key)}
                        className={`rounded-xl px-3 py-1.5 text-[10px] font-bold transition-all ${
                          ligTab === key ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-blue-600"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50/80 p-4">
                  <div className="flex items-center gap-3">
                    <Icon name="medal_gold" size={26} color="#D97706" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-amber-800">Altın Lig</div>
                      <div className="text-[10px] leading-5 text-amber-700">Elmas lig için 250 puan kaldı.</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={78} color="linear-gradient(90deg,#D97706,#F59E0B)" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {currentRanking.map((row) => (
                    <RankRow key={`${ligTab}-${row.rank}-${row.name}`} row={row} />
                  ))}
                </div>
              </Surface>

              <Surface className="p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <SectionLabel color="#059669">Arkadaşlar</SectionLabel>
                  <button
                    type="button"
                    onClick={handleAddFriend}
                    className="inline-flex items-center gap-1 rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-600"
                  >
                    <Icon name="plus" size={10} color="#2563EB" />
                    Ekle
                  </button>
                </div>
                <div className="flex flex-col gap-2.5">
                  {friendsSeed.map((friend) => {
                    const cheered = cheeredFriends.includes(friend.id);
                    return (
                      <div key={friend.id} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/58 px-3 py-2.5">
                        <Icon name={friend.avatar} size={22} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[12px] font-bold text-slate-800">{friend.name}</div>
                          <div className="mt-0.5 text-[10px] text-slate-500">{friend.level} · {friend.streak}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCheer(friend.id)}
                          disabled={cheered}
                          className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 disabled:opacity-50"
                        >
                          {cheered ? "Gönderildi" : "Alkış"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Surface>

              <Surface className="p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <SectionLabel color="#7C3AED">Enigma Mağazası</SectionLabel>
                  <StatusBadge color="#D97706" bg="#FFFBEB">
                    <Icon name="coin" size={10} color="#D97706" />
                    {formatCoin(coins)}
                  </StatusBadge>
                </div>
                <div className="mb-4 grid grid-cols-4 gap-1 rounded-2xl border border-white/70 bg-white/60 p-1">
                  {[
                    ["avatars", "Avatar"],
                    ["frames", "Çerçeve"],
                    ["themes", "Tema"],
                    ["rewards", "Ödül"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setShopTab(key)}
                      className={`rounded-xl px-2 py-2 text-[9px] font-bold transition-all ${
                        shopTab === key ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-violet-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className={`grid gap-2 ${shopTab === "rewards" ? "grid-cols-2" : "grid-cols-3 sm:grid-cols-4"}`}>
                  {shopData[shopTab].map((item) => (
                    <ShopItem
                      key={item.id}
                      item={item}
                      owned={ownedItems.includes(item.id)}
                      onBuy={handleBuyItem}
                    />
                  ))}
                </div>
              </Surface>

              <Surface className="p-5 sm:p-6">
                <div className="mb-4">
                  <SectionLabel color="#2563EB">Profil Düzenle</SectionLabel>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {availableAvatars.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`flex h-14 items-center justify-center rounded-2xl border ${
                        selectedAvatar === avatar ? "border-blue-300 bg-blue-50" : "border-white/70 bg-white/58"
                      }`}
                    >
                      <Icon name={avatar} size={26} />
                    </button>
                  ))}
                </div>
                <select
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="mt-4 w-full rounded-2xl border border-white/80 bg-white/78 px-4 py-3 text-[12px] font-bold text-slate-700 outline-none focus:border-blue-300"
                >
                  {availableTitles.map((title) => (
                    <option key={title}>{title}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleSave}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-[12px] font-bold text-white shadow-[0_16px_30px_rgba(37,99,235,0.20)] hover:bg-blue-700"
                >
                  <Icon name="check" size={12} color="#ffffff" />
                  Profili Kaydet
                </button>
              </Surface>
            </aside>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
