import { useState, useRef, useEffect } from "react";
import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";
import { useUser } from "../../context/UserContext.jsx";
import DashboardWidgets from "./widgets.jsx";

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const suggestedTopics = [
  {
    title: "Temel Kavramlar",
    sub: "Cebir · 12 video",
    progress: 84,
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
    badge: "Yükseliyor",
    lastSeen: "5 gün önce",
    instructor: "Burak Yıldız",
    color: "#059669",
    bg: "#ECFDF5",
  },
];

const dailyTasks = [
  { id: 1, title: "1 video dersi tamamla",      xp: 50,  done: true  },
  { id: 2, title: "10 soru çöz",                xp: 80,  done: true  },
  { id: 3, title: "Eksik kazanım testini aç",   xp: 40,  done: false },
  { id: 4, title: "20 dakika tekrar yap",       xp: 60,  done: false },
];

const notifications = [
  {
    id: 1, type: "task",
    title: "Yeni ödev yüklendi",
    desc: "Denklemler — Mini Test 3 artık aktif.",
    time: "5 dk önce",
    unread: true,
    icon: "📝",
    accent: "#2563EB",
  },
  {
    id: 2, type: "live",
    title: "Canlı ders yaklaşıyor",
    desc: "Eşitsizlikler dersi bugün 19:00'da başlıyor.",
    time: "1 saat önce",
    unread: true,
    icon: "📡",
    accent: "#DC2626",
  },
  {
    id: 3, type: "report",
    title: "Haftalık rapor hazır",
    desc: "Bu haftaki performans özetin görüntülenebilir.",
    time: "3 saat önce",
    unread: true,
    icon: "📊",
    accent: "#059669",
  },
  {
    id: 4, type: "announce",
    title: "Sistem duyurusu",
    desc: "Yeni içerik kataloğu 15 Mart'tan itibaren aktif.",
    time: "1 gün önce",
    unread: false,
    icon: "📢",
    accent: "#D97706",
  },
  {
    id: 5, type: "badge",
    title: "Yeni rozet kazandın!",
    desc: "7 günlük çalışma serisini tamamladın. 🔥",
    time: "2 gün önce",
    unread: false,
    icon: "🏆",
    accent: "#7C3AED",
  },
];

const headerStats = [
  { value: "8",  label: "Aktif Ders",  color: "#2563EB" },
  { value: "%84", label: "Başarı",      color: "#059669" },
];

/* ═══════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════ */

function ProgressBar({ value, color, h = "h-1.5" }) {
  return (
    <div className={`${h} overflow-hidden rounded-full bg-slate-100`}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

function SectionLabel({ text, color = "#2563EB" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px w-5 rounded-full" style={{ background: color }} />
      <span
        className="text-[20px] font-bold uppercase tracking-[2.5px]"
        style={{ color }}
      >
        {text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════
   NOTIFICATION BELL + DROPDOWN
═══════════════════════════════════════ */
function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(notifications);
  const ref = useRef(null);

  const unreadCount = notes.filter((n) => n.unread).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () =>
    setNotes((prev) => prev.map((n) => ({ ...n, unread: false })));

  const markRead = (id) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-150
          ${open
            ? "border-blue-300 bg-blue-50 text-[#2563EB]"
            : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
          }`}
        aria-label="Bildirimler"
        aria-expanded={open}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[8px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-11 z-50 w-[340px] rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#111827]">Bildirimler</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[9px] font-bold text-[#2563EB]">
                  {unreadCount} yeni
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
              >
                Tümünü okundu işaretle
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto">
            {notes.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex cursor-pointer gap-3 px-4 py-3.5 transition-colors duration-150 border-b border-slate-50 last:border-b-0
                  ${n.unread ? "bg-blue-50/40 hover:bg-blue-50/70" : "hover:bg-slate-50"}`}
              >
                {/* Icon */}
                <div
                  className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm"
                  style={{ background: n.accent + "18" }}
                >
                  {n.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-semibold leading-snug ${n.unread ? "text-[#111827]" : "text-slate-600"}`}>
                      {n.title}
                    </span>
                    {n.unread && (
                      <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: n.accent }} />
                    )}
                  </div>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-slate-400">{n.desc}</p>
                  <span className="mt-1 block text-[9px] font-medium text-slate-300">{n.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-4 py-2.5 text-center">
            <button className="text-[10px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
              Tüm bildirimleri gör →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   TOPIC CARD
═══════════════════════════════════════ */
function TopicCard({ topic }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(37,99,235,.10)]">
      <div
        className="relative h-[88px] border-b border-slate-100"
        style={{
          background: `linear-gradient(135deg, ${topic.color}24 0%, ${topic.color}12 52%, #F8FAFC 100%)`,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-full opacity-90"
          style={{
            background: `radial-gradient(circle at top right, ${topic.color}22, transparent 42%)`,
          }}
        />
      </div>

      <div className="flex flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[13px] font-bold tracking-[-0.2px] text-slate-950 leading-[1.2]">
              {topic.title}
            </h2>
            <p className="mt-1 text-[9px] font-medium text-slate-400">
              {topic.sub}
            </p>
          </div>
        </div>

        <div className="mt-3.5">
          <div className="mb-2 flex items-center justify-between gap-2.5">
            <span className="text-[8px] font-semibold uppercase tracking-[0.9px] text-slate-400">
              İlerleme
            </span>
            <span className="text-[8px] font-bold" style={{ color: topic.color }}>
              %{topic.progress}
            </span>
          </div>
          <ProgressBar value={topic.progress} color={topic.color} h="h-1" />
        </div>

        <div className="mt-3.5 w-full text-[9px] font-semibold">
          <div className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[7px] uppercase tracking-[1px] text-slate-400">
                  Eğitmen
                </div>
                <div className="mt-0.5 truncate text-[9px] text-slate-600">
                  {topic.instructor}
                </div>
              </div>

              <div className="min-w-0 text-right">
                <div className="text-[7px] uppercase tracking-[1px] text-slate-400">
                  Son Giriş
                </div>
                <div className="mt-0.5 whitespace-nowrap text-[9px] text-slate-600">
                  {topic.lastSeen}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3.5 border-t border-slate-200 pt-3.5">
          <div className="flex items-center justify-between gap-2.5">
            <span
              className="inline-flex rounded-full px-2.5 py-1 text-[7.5px] font-bold uppercase tracking-[1px]"
              style={{
                color: topic.color,
                background: topic.bg,
              }}
            >
              {topic.badge}
            </span>

            <button
              className="inline-flex min-w-[88px] items-center justify-center rounded-full border px-3.5 py-1.5 text-[9px] font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{
                color: topic.color,
                background: topic.bg,
                borderColor: `${topic.color}40`,
              }}
            >
              Aç
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════ */
export default function Dashboard() {
  const [tasks, setTasks] = useState(dailyTasks);
  const [toasts, setToasts] = useState([]);
  const { user, addCoins, addXp } = useUser();
  const doneTasks = tasks.filter((t) => t.done).length;

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = { ...t, done: !t.done };
        if (next.done && !t.done) {
          addXp(t.xp);
          addCoins(Math.round(t.xp / 2));
          const toastId = Date.now() + Math.random();
          setToasts((ts) => [...ts, { id: toastId, xp: t.xp, coins: Math.round(t.xp / 2) }]);
          setTimeout(() => {
            setToasts((ts) => ts.filter((x) => x.id !== toastId));
          }, 1800);
        } else if (!next.done && t.done) {
          addXp(-t.xp);
          addCoins(-Math.round(t.xp / 2));
        }
        return next;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111827]">
      <style>{`
        * { font-family: 'IBM Plex Mono', monospace; }
        .logo-hex { clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); }
        @keyframes xp-rise {
          0%   { opacity: 0; transform: translateY(8px) scale(.92); }
          15%  { opacity: 1; transform: translateY(0) scale(1); }
          80%  { opacity: 1; transform: translateY(-6px) scale(1); }
          100% { opacity: 0; transform: translateY(-28px) scale(.96); }
        }
        .xp-toast { animation: xp-rise 1.8s cubic-bezier(.2,.8,.2,1) forwards; }
      `}</style>

      {/* ── XP TOASTS ── */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="xp-toast flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 shadow-lg shadow-emerald-100/70"
          >
            <span className="text-base">✨</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-600">+{t.xp} XP</span>
              <span className="text-[9px] font-semibold text-amber-600">+{t.coins} 🪙 Coin</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex min-h-screen">
        <DashboardNavbar />

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">

          {/* ══ HEADER ══ */}
          <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 px-8 py-5 backdrop-blur-md">
            <div className="flex flex-wrap items-start justify-between gap-4">

              {/* Left: greeting */}
              <div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <h1 className="text-[26px] font-bold tracking-[-0.4px] text-[#111827] leading-tight">
                  Hoşgeldin, İlkhan Arda 👋
                </h1>
              </div>

              {/* Right: stats + notification */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Stat pills */}
                {headerStats.map((s) => (
                  <div
                    key={s.label}
                    className="flex gap-1 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 min-w-[72px]"
                  >
                    <div className="text-[17px] font-bold tracking-tight" style={{ color: s.color }}>
                      {s.value}
                    </div>
                    <div className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[1.5px] text-slate-400">
                      {s.label}
                    </div>
                  </div>
                ))}

                {/* Notification bell */}
                <NotificationDropdown />
              </div>
            </div>

          </header>

          {/* ══ MAIN ══ */}
          <main className="flex-1 px-8 py-7 overflow-x-hidden">
            <div className="mb-7">
              <DashboardWidgets
                tasks={tasks}
                onToggleTask={toggleTask}
                doneTasks={doneTasks}
                user={user}
              />
            </div>

            <div className="grid grid-cols-1 gap-7">

              {/* ─ LEFT: Topics ─ */}
              <section className="min-w-0 xl:pt-1">

                {/* Section header — flows naturally from greeting */}
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <SectionLabel text="Ders Özeti" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {suggestedTopics.map((topic) => (
                    <TopicCard key={topic.title} topic={topic} />
                  ))}
                </div>
              </section>

          
              {/* ─ RIGHT: Sidebar widgets ─ */}
              {/*
              <aside className="flex flex-col gap-5 xl:pt-1">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-lg hover:shadow-amber-50/50">
                  <div className="mb-4">
                    <SectionLabel text="Sezonluk Etkinlik" color="#D97706" />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {seasonalEvents.map((ev) => (
                      <div
                        key={ev.title}
                        className="group flex items-center gap-3 cursor-pointer rounded-xl border border-slate-100 p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                        style={{ background: ev.bg }}
                      >
                        <span className="text-xl leading-none">{ev.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold leading-snug" style={{ color: ev.color }}>
                            {ev.title}
                          </div>
                          <div className="mt-0.5 text-[10px] text-slate-500">{ev.meta}</div>
                        </div>
                        <span className="text-[11px] opacity-0 transition-opacity group-hover:opacity-100" style={{ color: ev.color }}>→</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="mb-4">
                    <SectionLabel text="Hızlı Erişim" color="#059669" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Performans Raporu", icon: "📊", color: "#059669", bg: "#ECFDF5" },
                      { label: "Sertifikalarım",    icon: "🎓", color: "#2563EB", bg: "#EFF6FF" },
                      { label: "Çalışma Takvimi",  icon: "📅", color: "#7C3AED", bg: "#F5F3FF" },
                      { label: "Liderlik Tablosu", icon: "🏆", color: "#D97706", bg: "#FFFBEB" },
                    ].map((link) => (
                      <button
                        key={link.label}
                        className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 py-3.5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
                        style={{ background: link.bg }}
                      >
                        <span className="text-lg leading-none">{link.icon}</span>
                        <span className="text-[9px] font-bold leading-tight" style={{ color: link.color }}>
                          {link.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside> 
                          */}
            </div>

          </main>

          {/* ══ FOOTER ══ */}
          <footer className="border-t border-slate-100 bg-white px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="logo-hex flex h-8 w-8 items-center justify-center bg-[#2563EB] text-[9px] font-bold tracking-tight text-white"
                >
                  C:E
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-[#111827]">Code:Enigma Dashboard</div>
                  <div className="text-[9px] uppercase tracking-[1.8px] text-slate-400">
                    Canvas LMS Esintili Panel
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                © {new Date().getFullYear()} Açık ve Uzaktan Eğitim Projesi. Tüm hakları saklıdır.
              </p>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
