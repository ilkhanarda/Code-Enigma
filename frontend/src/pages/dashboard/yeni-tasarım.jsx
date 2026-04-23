import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";
import { useUser } from "../../context/UserContext.jsx";
import DashboardWidgets from "./widgets.jsx";
import Icon from "../../components/ui/icons8-icon.jsx";

const suggestedTopics = [
  {
    title: "Temel Kavramlar",
    sub: "Cebir · 12 video",
    progress: 84,
    peerAverage: 68,
    badge: "Önerilen",
    lastSeen: "2 saat önce",
    instructor: "Dr. Ayşe Kaya",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    title: "Sayı Basamakları",
    sub: "Aritmetik · 8 test",
    progress: 72,
    peerAverage: 61,
    badge: "Devam Et",
    lastSeen: "Dün",
    instructor: "Mert Demir",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    title: "Rasyonel Sayılar",
    sub: "Sayı Teorisi · 14 set",
    progress: 91,
    peerAverage: 74,
    badge: "Güçlü Alan",
    lastSeen: "3 gün önce",
    instructor: "Dr. Zeynep Alp",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    title: "Denklemler",
    sub: "Cebir · 6 kazanım",
    progress: 48,
    peerAverage: 56,
    badge: "Eksik Var",
    lastSeen: "1 hafta önce",
    instructor: "Burak Yıldız",
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    title: "Eşitsizlikler",
    sub: "Canlı ders · 19:00",
    progress: 20,
    peerAverage: 37,
    badge: "Takvimde",
    lastSeen: "Bugün",
    instructor: "Dr. Selin Taş",
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  {
    title: "Fonksiyonlar",
    sub: "Analiz · 11 içerik",
    progress: 66,
    peerAverage: 52,
    badge: "Planlı",
    lastSeen: "4 gün önce",
    instructor: "Dr. Ayşe Kaya",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    title: "Problem Çözme",
    sub: "Karma · 5 görev",
    progress: 35,
    peerAverage: 44,
    badge: "Görevli",
    lastSeen: "Dün",
    instructor: "Mert Demir",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    title: "Geometri",
    sub: "Uzay · 7 modül",
    progress: 58,
    peerAverage: 49,
    badge: "Yükseliyor",
    lastSeen: "5 gün önce",
    instructor: "Burak Yıldız",
    color: "#059669",
    bg: "#ECFDF5",
  },
];

const dailyTasks = [
  { id: 1, title: "1 video dersi tamamla", xp: 50, done: true },
  { id: 2, title: "10 soru çöz", xp: 80, done: true },
  { id: 3, title: "Eksik kazanım testini aç", xp: 40, done: false },
  { id: 4, title: "20 dakika tekrar yap", xp: 60, done: false },
];

const notifications = [
  {
    id: 1,
    type: "task",
    title: "Yeni ödev yüklendi",
    desc: "Denklemler — Mini Test 3 artık aktif.",
    time: "5 dk önce",
    unread: true,
    icon: "test",
    accent: "#2563EB",
  },
  {
    id: 2,
    type: "live",
    title: "Canlı ders yaklaşıyor",
    desc: "Eşitsizlikler dersi bugün 19:00'da başlıyor.",
    time: "1 saat önce",
    unread: true,
    icon: "live",
    accent: "#DC2626",
  },
  {
    id: 3,
    type: "report",
    title: "Haftalık rapor hazır",
    desc: "Bu haftaki performans özetin görüntülenebilir.",
    time: "3 saat önce",
    unread: true,
    icon: "chart",
    accent: "#059669",
  },
  {
    id: 4,
    type: "announce",
    title: "Sistem duyurusu",
    desc: "Yeni içerik kataloğu 15 Mart'tan itibaren aktif.",
    time: "1 gün önce",
    unread: false,
    icon: "announcement",
    accent: "#D97706",
  },
  {
    id: 5,
    type: "badge",
    title: "Yeni rozet kazandın",
    desc: "7 günlük çalışma serisini tamamladın.",
    time: "2 gün önce",
    unread: false,
    icon: "trophy",
    accent: "#7C3AED",
  },
];

const weeklyMomentum = [
  { day: "Pzt", xp: 120 },
  { day: "Sal", xp: 175 },
  { day: "Çar", xp: 130 },
  { day: "Per", xp: 220 },
  { day: "Cum", xp: 160 },
  { day: "Cmt", xp: 210 },
  { day: "Paz", xp: 190 },
];

const leaderboardSeed = {
  haftalik: [
    { name: "Zeynep Ç.", avatar: "avatar_fox", points: 3420, tone: "#EFF6FF" },
    { name: "Rızgar O.", avatar: "avatar_dog", points: 3180, tone: "#F5F3FF" },
    { name: "Rojhat T.", avatar: "avatar_chameleon", points: 2990, tone: "#ECFDF5" },
    { name: "Burak Y.", avatar: "avatar_teddy_bear", points: 2910, tone: "#FFFBEB" },
  ],
  sinif: [
    { name: "Rojhat T.", avatar: "avatar_chameleon", points: 97, unit: "puan", tone: "#ECFDF5" },
    { name: "Zeynep Ç.", avatar: "avatar_fox", points: 95, unit: "puan", tone: "#EFF6FF" },
    { name: "Rızgar O.", avatar: "avatar_dog", points: 93, unit: "puan", tone: "#F5F3FF" },
    { name: "Selin K.", avatar: "avatar_penguin", points: 91, unit: "puan", tone: "#FEF2F2" },
  ],
  arkadaslar: [
    { name: "Zeynep Ç.", avatar: "avatar_fox", points: 8920, unit: "XP", tone: "#EFF6FF" },
    { name: "Rojhat T.", avatar: "avatar_chameleon", points: 8710, unit: "XP", tone: "#ECFDF5" },
    { name: "Rızgar O.", avatar: "avatar_dog", points: 8480, unit: "XP", tone: "#F5F3FF" },
    { name: "Burak Y.", avatar: "avatar_teddy_bear", points: 8320, unit: "XP", tone: "#FFFBEB" },
  ],
};

function formatNumber(value) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

function ProgressBar({ value, color = "#2563EB", background = "#E2E8F0", height = 8 }) {
  return (
    <div className="overflow-hidden rounded-full" style={{ height, background }}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  );
}

function SectionHeader({ kicker, title, description, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <div className="h-px w-6 rounded-full bg-blue-500" />
          <span className="text-[11px] font-bold uppercase tracking-[1.9px] text-blue-600">{kicker}</span>
        </div>
        <h2 className="mt-2 text-[clamp(20px,2.1vw,28px)] font-bold text-slate-950">{title}</h2>
        {description && <p className="mt-1 text-[13px] text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(notifications);
  const ref = useRef(null);

  const unreadCount = notes.filter((note) => note.unread).length;

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  const markAllRead = () => setNotes((prev) => prev.map((note) => ({ ...note, unread: false })));
  const markRead = (id) => setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, unread: false } : note)));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={[
          "relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-all",
          open
            ? "border-blue-200 bg-blue-50 text-blue-600"
            : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600",
        ].join(" ")}
        aria-label="Bildirimler"
        aria-expanded={open}
      >
        <Icon name="notifications" size={17} color={open ? "#2563EB" : "#64748B"} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[3.25rem] z-[80] w-[min(360px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_26px_60px_rgba(15,23,42,0.22)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-slate-900">Bildirimler</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                  {unreadCount} yeni
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Tümünü okundu işaretle
              </button>
            )}
          </div>

          <div className="scroll-soft max-h-[320px] overflow-y-auto">
            {notes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => markRead(note.id)}
                className={[
                  "flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition-colors last:border-b-0",
                  note.unread ? "bg-blue-50/45 hover:bg-blue-50" : "hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${note.accent}18` }}>
                  <Icon name={note.icon} size={15} color={note.accent} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[12px] font-semibold text-slate-900">{note.title}</p>
                    {note.unread && <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: note.accent }} />}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{note.desc}</p>
                  <span className="mt-1 block text-[10px] text-slate-400">{note.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContinueLearningCard({ topic, onContinue }) {
  const delta = topic.progress - topic.peerAverage;

  return (
    <article className="surface-card card-hover-lift overflow-hidden p-6">
      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200 p-5"
        style={{ background: `linear-gradient(130deg, ${topic.color}22, #ffffff 62%)` }}
      >
        <div className="absolute inset-y-0 right-0 w-40" style={{ background: `radial-gradient(circle at right, ${topic.color}22, transparent 72%)` }} />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-full border border-blue-100 bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.3px] text-blue-600">
              Continue Learning
            </span>
            <h3 className="mt-3 text-[clamp(22px,2.3vw,32px)] font-bold leading-[1.12] text-slate-950">{topic.title}</h3>
            <p className="mt-1.5 text-[14px] text-slate-500">{topic.sub} · Son giriş: {topic.lastSeen}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white/85 px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-[1.2px] text-slate-400">İlerleme</div>
                <div className="mt-1 text-[18px] font-bold text-slate-900">%{topic.progress}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/85 px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-[1.2px] text-slate-400">Sınıf Ort.</div>
                <div className="mt-1 text-[18px] font-bold text-slate-900">%{topic.peerAverage}</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/85 px-3 py-2">
                <div className="text-[10px] font-semibold uppercase tracking-[1.2px] text-slate-400">Fark</div>
                <div className={delta >= 0 ? "mt-1 text-[18px] font-bold text-emerald-600" : "mt-1 text-[18px] font-bold text-amber-600"}>
                  {delta >= 0 ? `+${delta}` : delta}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar
                value={topic.progress}
                color={`linear-gradient(90deg, ${topic.color}, #1D4ED8)`}
                background="#dbe7ff"
                height={9}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-[12px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_14px_28px_rgba(37,99,235,0.3)]"
          >
            Derse Devam Et <Icon name="next" size={13} color="#ffffff" />
          </button>
        </div>
      </div>
    </article>
  );
}

function DailyTasksCard({ tasks, doneTasks, onToggleTask }) {
  const completion = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;

  return (
    <article className="surface-card p-6">
      <SectionHeader
        kicker="Daily Tasks"
        title="Bugünkü görevler"
        description={`${doneTasks}/${tasks.length} görev tamamlandı · her görev coin ve XP kazandırır`}
      />

      <div className="space-y-3">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => onToggleTask(task.id)}
            className={[
              "group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all",
              task.done
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/45",
            ].join(" ")}
          >
            <div
              className={[
                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border",
                task.done ? "border-emerald-300 bg-emerald-500" : "border-slate-300 bg-white group-hover:border-blue-300",
              ].join(" ")}
            >
              <Icon name={task.done ? "check" : "unchecked_box"} size={14} color={task.done ? "#ffffff" : "#64748B"} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={task.done ? "text-[14px] font-semibold text-emerald-700 line-through" : "text-[14px] font-semibold text-slate-800"}>
                {task.title}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">Tamamla ve XP kazan</p>
            </div>
            <div className={task.done ? "rounded-xl bg-white px-2.5 py-1 text-[12px] font-bold text-emerald-600" : "rounded-xl bg-slate-100 px-2.5 py-1 text-[12px] font-bold text-slate-500"}>
              +{task.xp} XP
            </div>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[12px] font-semibold text-blue-700">Günlük tamamlama oranı</p>
          <span className="text-[13px] font-bold text-blue-700">%{completion}</span>
        </div>
        <ProgressBar value={completion} color="linear-gradient(90deg,#2563EB,#0EA5E9)" background="#bfdbfe" height={10} />
      </div>
    </article>
  );
}

function WeakTopicCard({ topic, onOpen }) {
  return (
    <article className="surface-card card-hover-lift p-6">
      <SectionHeader
        kicker="Weak Topic"
        title="Önerilen tekrar alanı"
        description="Düşük ilerlemeli konuyu bugün kısa bir sprint ile kapatabilirsin."
      />

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-bold text-slate-900">{topic.title}</p>
            <p className="mt-1 text-[13px] text-slate-500">{topic.sub} · Eğitmen: {topic.instructor}</p>
          </div>
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.3px] text-rose-600">Öncelikli</span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="text-[10px] uppercase tracking-[1.2px] text-slate-400">Sen</div>
            <div className="mt-1 text-[18px] font-bold text-slate-900">%{topic.progress}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="text-[10px] uppercase tracking-[1.2px] text-slate-400">Sınıf Ort.</div>
            <div className="mt-1 text-[18px] font-bold text-slate-900">%{topic.peerAverage}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="text-[10px] uppercase tracking-[1.2px] text-slate-400">Fark</div>
            <div className="mt-1 text-[18px] font-bold text-rose-600">-{Math.abs(topic.progress - topic.peerAverage)}</div>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar value={topic.progress} color="linear-gradient(90deg,#f97316,#dc2626)" background="#FEE2E2" height={9} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-[12px] font-semibold text-white transition-all hover:bg-rose-600"
        >
          Eksik Konuya Git <Icon name="next" size={12} color="#ffffff" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[12px] font-semibold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          20 Dakika Hızlı Tekrar <Icon name="timer" size={12} color="#64748B" />
        </button>
      </div>
    </article>
  );
}

function TodaySummaryCard({ user, doneTasks, totalTasks, avgProgress, weeklyGoal, weeklyCurrent }) {
  const completion = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const weeklyPercent = Math.round((weeklyCurrent / weeklyGoal) * 100);

  return (
    <article className="surface-card p-5">
      <SectionHeader
        kicker="Today Summary"
        title="Bugün ne durumdasın"
        description="Günlük hedef, seri ve haftalık XP ilerlemeni tek bakışta gör."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1.2px] text-slate-400">Günlük görev</p>
              <p className="mt-1 text-[24px] font-bold text-slate-900">%{completion}</p>
              <p className="text-[12px] text-slate-500">{doneTasks}/{totalTasks} tamamlandı</p>
            </div>
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full p-1.5"
              style={{ background: `conic-gradient(#2563EB ${completion * 3.6}deg, #DBEAFE 0deg)` }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[16px] font-bold text-blue-700">
                {doneTasks}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] uppercase tracking-[1.1px] text-slate-400">Seri</p>
            <p className="mt-1 text-[17px] font-bold text-amber-600">{user.streak} gün</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] uppercase tracking-[1.1px] text-slate-400">Coin</p>
            <p className="mt-1 text-[17px] font-bold text-amber-600">{formatNumber(user.coins)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] uppercase tracking-[1.1px] text-slate-400">Ort. İlerleme</p>
            <p className="mt-1 text-[17px] font-bold text-emerald-600">%{avgProgress}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/75 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[12px] font-semibold text-blue-700">Haftalık XP hedefi</p>
            <span className="text-[12px] font-bold text-blue-700">{weeklyPercent}%</span>
          </div>
          <ProgressBar value={weeklyPercent} color="linear-gradient(90deg,#2563EB,#0EA5E9)" background="#BFDBFE" height={10} />
          <p className="mt-2 text-[11px] text-blue-600">{formatNumber(weeklyCurrent)} / {formatNumber(weeklyGoal)} XP</p>
        </div>
      </div>
    </article>
  );
}

function LeaderboardCard({ user, tab, onChange, data }) {
  const currentRows = data[tab];

  return (
    <article className="surface-card p-5">
      <SectionHeader
        kicker="Leaderboard"
        title="Sıralama"
        description="Performansını sınıfın ve arkadaşlarınla karşılaştır."
        action={
          <div className="flex gap-1.5 rounded-full bg-slate-100 p-1">
            {[
              ["haftalik", "Haftalık"],
              ["sinif", "Sınıf"],
              ["arkadaslar", "Arkadaş"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                className={[
                  "rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all",
                  tab === key ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        }
      />

      <div className="space-y-2">
        {currentRows.map((row, index) => (
          <div
            key={`${tab}-${row.name}`}
            className={[
              "flex items-center gap-3 rounded-2xl border px-3 py-2.5",
              row.me ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white",
            ].join(" ")}
          >
            <span className={row.me ? "w-7 text-center text-[12px] font-bold text-blue-600" : "w-7 text-center text-[12px] font-bold text-slate-400"}>
              {index + 1}
            </span>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: row.tone }}>
              <Icon name={row.avatar} size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={row.me ? "truncate text-[13px] font-semibold text-blue-700" : "truncate text-[13px] font-semibold text-slate-800"}>
                {row.name}
              </p>
              {row.me && <p className="text-[10px] text-blue-500">{user.name} hesabı</p>}
            </div>
            <span className={row.me ? "text-[12px] font-bold text-blue-700" : "text-[12px] font-bold text-slate-500"}>
              {formatNumber(row.points)} {row.unit || "pts"}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function WeeklyProgressCard({ weeklyData, doneTasks, totalTasks }) {
  const maxValue = Math.max(...weeklyData.map((item) => item.xp));
  const totalWeekXp = weeklyData.reduce((sum, item) => sum + item.xp, 0);
  const completion = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <article className="surface-card p-5">
      <SectionHeader
        kicker="Weekly Progress"
        title="Haftalık ivme"
        description="Son 7 günün XP ve görev tempo dağılımı"
      />

      <div className="flex h-36 items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        {weeklyData.map((item, index) => {
          const barHeight = Math.max(12, Math.round((item.xp / maxValue) * 100));
          const isToday = index === weeklyData.length - 1;
          return (
            <div key={item.day} className="flex flex-1 flex-col items-center gap-1">
              <span className={isToday ? "text-[10px] font-semibold text-blue-600" : "text-[10px] font-semibold text-slate-400"}>
                {item.xp}
              </span>
              <div className="relative h-20 w-full overflow-hidden rounded-xl bg-slate-200/70">
                <div
                  className={isToday ? "absolute inset-x-0 bottom-0 rounded-xl bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-700" : "absolute inset-x-0 bottom-0 rounded-xl bg-slate-300 transition-all duration-700"}
                  style={{ height: `${barHeight}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500">{item.day}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] uppercase tracking-[1.2px] text-slate-400">Haftalık XP</p>
          <p className="mt-1 text-[18px] font-bold text-slate-900">{formatNumber(totalWeekXp)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[10px] uppercase tracking-[1.2px] text-slate-400">Görev Tamamlama</p>
          <p className="mt-1 text-[18px] font-bold text-slate-900">%{completion}</p>
        </div>
      </div>
    </article>
  );
}

function TopicMiniCard({ topic, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="surface-card card-hover-lift w-full overflow-hidden p-0 text-left"
    >
      <div
        className="h-[104px] border-b border-slate-200 px-4 py-3"
        style={{ background: `linear-gradient(135deg, ${topic.color}22, #ffffff)` }}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.2px]" style={{ color: topic.color }}>
            {topic.badge}
          </span>
          <span className="text-[12px] font-bold" style={{ color: topic.color }}>%{topic.progress}</span>
        </div>
        <p className="mt-3 text-[16px] font-bold text-slate-900">{topic.title}</p>
        <p className="text-[12px] text-slate-500">{topic.sub}</p>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Sınıf ortalaması</span>
          <span className="font-semibold text-slate-600">%{topic.peerAverage}</span>
        </div>
        <ProgressBar value={topic.progress} color={topic.color} background="#E2E8F0" height={8} />
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>{topic.instructor}</span>
          <span>{topic.lastSeen}</span>
        </div>
      </div>
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, addCoins, addXp } = useUser();

  const [tasks, setTasks] = useState(dailyTasks);
  const [toasts, setToasts] = useState([]);
  const [leaderboardTab, setLeaderboardTab] = useState("haftalik");

  const doneTasks = tasks.filter((task) => task.done).length;

  const continueTopic = useMemo(
    () => suggestedTopics.find((topic) => topic.progress > 0 && topic.progress < 100) || suggestedTopics[0],
    []
  );

  const weakTopic = useMemo(
    () => [...suggestedTopics].sort((a, b) => a.progress - b.progress)[0],
    []
  );

  const avgProgress = useMemo(
    () => Math.round(suggestedTopics.reduce((sum, topic) => sum + topic.progress, 0) / suggestedTopics.length),
    []
  );

  const weeklyGoal = 700;
  const weeklyCurrent = weeklyMomentum.reduce((sum, item) => sum + item.xp, 0) + doneTasks * 35;

  const leaderboardData = useMemo(() => {
    const meEntryByTab = {
      haftalik: {
        name: `Sen (${user.name})`,
        avatar: user.avatar,
        points: 2750 + doneTasks * 20,
        unit: "pts",
        tone: "linear-gradient(135deg,#2563EB,#7C3AED)",
        me: true,
      },
      sinif: {
        name: `Sen (${user.name})`,
        avatar: user.avatar,
        points: 89 + doneTasks,
        unit: "puan",
        tone: "linear-gradient(135deg,#2563EB,#7C3AED)",
        me: true,
      },
      arkadaslar: {
        name: `Sen (${user.name})`,
        avatar: user.avatar,
        points: 8450 + doneTasks * 35,
        unit: "XP",
        tone: "linear-gradient(135deg,#2563EB,#7C3AED)",
        me: true,
      },
    };

    return {
      haftalik: [...leaderboardSeed.haftalik.slice(0, 2), meEntryByTab.haftalik, ...leaderboardSeed.haftalik.slice(2)],
      sinif: [...leaderboardSeed.sinif.slice(0, 1), meEntryByTab.sinif, ...leaderboardSeed.sinif.slice(1)],
      arkadaslar: [...leaderboardSeed.arkadaslar.slice(0, 2), meEntryByTab.arkadaslar, ...leaderboardSeed.arkadaslar.slice(2)],
    };
  }, [doneTasks, user.avatar, user.name]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const next = { ...task, done: !task.done };
        const coinReward = Math.round(task.xp / 2);

        if (next.done && !task.done) {
          addXp(task.xp);
          addCoins(coinReward);
          const toastId = Date.now() + Math.random();
          setToasts((current) => [...current, { id: toastId, xp: task.xp, coins: coinReward }]);
          setTimeout(() => {
            setToasts((current) => current.filter((toast) => toast.id !== toastId));
          }, 1800);
        }

        if (!next.done && task.done) {
          addXp(-task.xp);
          addCoins(-coinReward);
        }

        return next;
      })
    );
  };

  return (
    <div className="dashboard-grid min-h-screen text-slate-900">
      <style>{`
        @keyframes xp-toast-rise {
          0% { opacity: 0; transform: translateY(12px) scale(.95); }
          15% { opacity: 1; transform: translateY(0) scale(1); }
          80% { opacity: 1; transform: translateY(-8px) scale(1); }
          100% { opacity: 0; transform: translateY(-26px) scale(.96); }
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .xp-toast { animation: xp-toast-rise 1.8s cubic-bezier(.2,.8,.2,1) forwards; }
        .card-enter { animation: card-in .45s cubic-bezier(.2,.8,.2,1) both; }
      `}</style>

      <div className="pointer-events-none fixed bottom-24 right-4 z-[95] flex flex-col items-end gap-2 md:bottom-6 md:right-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="xp-toast flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 shadow-[0_14px_30px_rgba(5,150,105,0.22)]"
          >
            <Icon name="guarantee" size={16} color="#059669" />
            <div>
              <p className="text-[11px] font-bold text-emerald-600">+{toast.xp} XP</p>
              <p className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                +{toast.coins} <Icon name="coin" size={10} color="#D97706" /> Coin
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex min-h-screen">
        <DashboardNavbar />

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden pb-24 md:pb-0">
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8 xl:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[12px] text-slate-500">
                  {new Date().toLocaleDateString("tr-TR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <h1 className="mt-1 text-[clamp(24px,2.8vw,36px)] font-bold leading-tight text-slate-950">
                  Merhaba, {user.name}
                </h1>
                <p className="mt-1 text-[13px] text-slate-500">
                  Bugün hedefin: seriyi koru, görevlerini tamamla ve zayıf konunu güçlendir.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate("/topic")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-[12px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_14px_28px_rgba(37,99,235,0.3)]"
                >
                  Derse Başla <Icon name="next" size={13} color="#ffffff" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/topics")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Konuları İncele <Icon name="topics" size={13} color="#64748B" />
                </button>
                <NotificationDropdown />
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[1.1px] text-slate-400">Günlük tamamlanma</p>
                <p className="mt-1 text-[18px] font-bold text-slate-900">{doneTasks}/{tasks.length} görev</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[1.1px] text-slate-400">Mevcut seri</p>
                <p className="mt-1 text-[18px] font-bold text-amber-600">{user.streak} gün</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[1.1px] text-slate-400">Haftalık XP</p>
                <p className="mt-1 text-[18px] font-bold text-blue-600">{formatNumber(weeklyCurrent)} XP</p>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
              <aside className="order-1 space-y-6 xl:order-2">
                <div className="card-enter">
                  <TodaySummaryCard
                    user={user}
                    doneTasks={doneTasks}
                    totalTasks={tasks.length}
                    avgProgress={avgProgress}
                    weeklyGoal={weeklyGoal}
                    weeklyCurrent={weeklyCurrent}
                  />
                </div>

                <div className="card-enter [animation-delay:70ms]">
                  <LeaderboardCard
                    user={user}
                    tab={leaderboardTab}
                    onChange={setLeaderboardTab}
                    data={leaderboardData}
                  />
                </div>

                <div className="card-enter [animation-delay:120ms]">
                  <WeeklyProgressCard weeklyData={weeklyMomentum} doneTasks={doneTasks} totalTasks={tasks.length} />
                </div>
              </aside>

              <div className="order-2 space-y-6 xl:order-1">
                <div className="card-enter">
                  <ContinueLearningCard
                    topic={continueTopic}
                    onContinue={() => navigate(continueTopic.title === "Temel Kavramlar" ? "/topic" : "/topics")}
                  />
                </div>

                <div className="card-enter [animation-delay:70ms]">
                  <DailyTasksCard tasks={tasks} doneTasks={doneTasks} onToggleTask={toggleTask} />
                </div>

                <div className="card-enter [animation-delay:120ms]">
                  <WeakTopicCard
                    topic={weakTopic}
                    onOpen={() => navigate(weakTopic.title === "Temel Kavramlar" ? "/topic" : "/topics")}
                  />
                </div>
              </div>
            </section>

            <section className="mt-8">
              <SectionHeader
                kicker="Courses"
                title="Kurs kartları"
                description="Öğrenme akışını sade bir düzende takip et."
                action={
                  <button
                    type="button"
                    onClick={() => navigate("/topics")}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Tüm konular <Icon name="next" size={12} color="#64748B" />
                  </button>
                }
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {suggestedTopics.slice(0, 4).map((topic) => (
                  <TopicMiniCard
                    key={topic.title}
                    topic={topic}
                    onOpen={() => navigate(topic.title === "Temel Kavramlar" ? "/topic" : "/topics")}
                  />
                ))}
              </div>
            </section>

            <section className="mt-8">
              <SectionHeader
                kicker="Secondary"
                title="Kişisel vitrin"
                description="Daha fazla kartı ihtiyaçlarına göre aç, kapat ve düzenle."
              />

              <div className="surface-card p-5 sm:p-6">
                <DashboardWidgets tasks={tasks} onToggleTask={toggleTask} doneTasks={doneTasks} user={user} />
              </div>
            </section>
          </main>

          <footer className="border-t border-slate-200 bg-white/90 px-4 py-3.5 text-[11px] text-slate-500 sm:px-6 lg:px-8 xl:px-10">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <p>© {new Date().getFullYear()} Code:Enigma Student Dashboard</p>
              <p>Icons by <a href="https://icons8.com" target="_blank" rel="noreferrer" className="font-semibold text-slate-600 hover:text-blue-600">Icons8</a></p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
