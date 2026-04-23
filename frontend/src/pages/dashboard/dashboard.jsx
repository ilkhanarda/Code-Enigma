import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";
import { useUser } from "../../context/UserContext.jsx";
import DashboardWidgets from "./widgets.jsx";
import Icon from "../../components/ui/icons8-icon.jsx";


/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
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
    icon: "test",
    accent: "#2563EB",
  },
  {
    id: 2, type: "live",
    title: "Canlı ders yaklaşıyor",
    desc: "Eşitsizlikler dersi bugün 19:00'da başlıyor.",
    time: "1 saat önce",
    unread: true,
    icon: "live",
    accent: "#DC2626",
  },
  {
    id: 3, type: "report",
    title: "Haftalık rapor hazır",
    desc: "Bu haftaki performans özetin görüntülenebilir.",
    time: "3 saat önce",
    unread: true,
    icon: "chart",
    accent: "#059669",
  },
  {
    id: 4, type: "announce",
    title: "Sistem duyurusu",
    desc: "Yeni içerik kataloğu 15 Mart'tan itibaren aktif.",
    time: "1 gün önce",
    unread: false,
    icon: "announcement",
    accent: "#D97706",
  },
  {
    id: 5, type: "badge",
    title: "Yeni rozet kazandın!",
    desc: "7 günlük çalışma serisini tamamladın.",
    time: "2 gün önce",
    unread: false,
    icon: "trophy",
    accent: "#7C3AED",
  },
];

const headerInsights = [
  {
    id: "friends-topics",
    icon: "users",
    content: (
      <>
        Arkadaşların son 3 günde ortalama{" "}
        <span className="font-bold text-slate-900">32 konu</span> tamamladı.
      </>
    ),
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    id: "weekly-questions",
    icon: "test",
    content: (
      <>
        Bu hafta <span className="font-bold text-slate-900">37 soru</span> çözdün,{" "}
        <span className="font-bold text-slate-900">78 soru</span> çözen bir arkadaşın var.
      </>
    ),
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    id: "total-questions",
    icon: "chart",
    content: (
      <>
        Bugüne kadar <span className="font-bold text-slate-900">173 soru</span> çözdün.
      </>
    ),
    color: "#059669",
    bg: "#ECFDF5",
  },
];

/* ═══════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════ */

function ProgressBar({ value, color, h = "h-1.5", peerAverage }) {
  const averagePosition = Math.max(2, Math.min(98, Number(peerAverage ?? 50)));
  const isAbovePeers = Number(value) >= Number(peerAverage ?? 50);
  const markerColor = isAbovePeers ? "#34D399" : "#FB923C";
  const markerBorderColor = isAbovePeers ? "#059669" : "#C2410C";
  return (
    <div className="relative pt-6">
      <span
        className="pointer-events-none absolute -translate-x-1/2 text-center text-[11px] leading-[1.35] font-semibold"
        style={{ left: `${averagePosition}%`, top: -4, color: markerColor }}
      >
        Arkadaşlarının Ortalaması
      </span>

      <div className={`relative ${h} overflow-visible`}>
        <div className="h-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${value}%`, background: color }}
          />
        </div>
        <span
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${averagePosition}%`,
            top: "50%",
            width: 18,
            height: 16,
            background: markerBorderColor,
            clipPath: isAbovePeers
              ? "polygon(50% 0%, 0% 100%, 100% 100%)"
              : "polygon(0% 0%, 100% 0%, 50% 100%)",
          }}
          aria-hidden="true"
        >
          <span
            className="absolute"
            style={{
              left: 2,
              top: isAbovePeers ? 3 : 1,
              width: 14,
              height: 12,
              background: markerColor,
              clipPath: isAbovePeers
                ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                : "polygon(0% 0%, 100% 0%, 50% 100%)",
            }}
          />
        </span>
      </div>
    </div>
  );
}

function SectionLabel({ text, color = "#2563EB" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px w-5 rounded-full" style={{ background: color }} />
      <span
        className="text-[11px] font-bold uppercase tracking-[1.9px]"
        style={{ color }}
      >
        {text}
      </span>
    </div>
  );
}

function HeaderPattern({ color, variant }) {
  const variants = ["dots", "grid", "diagonal", "rings"];
  const type = variants[Math.abs(variant ?? 0) % variants.length];

  const patternByType = {
    dots: `radial-gradient(circle at 1px 1px, ${color}40 1px, transparent 0)`,
    grid: `linear-gradient(${color}2e 1px, transparent 1px), linear-gradient(90deg, ${color}2e 1px, transparent 1px)`,
    diagonal: `repeating-linear-gradient(135deg, ${color}24 0px, ${color}24 6px, transparent 6px, transparent 12px)`,
    rings: `radial-gradient(circle at 16% 30%, ${color}26 0 8px, transparent 8px),
            radial-gradient(circle at 72% 72%, ${color}22 0 10px, transparent 10px),
            radial-gradient(circle at 52% 18%, ${color}20 0 6px, transparent 6px)`,
  };

  const sizeByType = {
    dots: "12px 12px",
    grid: "14px 14px",
    diagonal: "auto",
    rings: "auto",
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] opacity-60"
      style={{
        backgroundImage: patternByType[type],
        backgroundSize: sizeByType[type],
      }}
    />
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
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`surface-wrap relative flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200
          ${open
            ? "border-blue-200 bg-white text-blue-600 shadow-[0_14px_30px_rgba(37,99,235,.14)]"
            : "border-[#dbe5f3] bg-white text-slate-500 hover:border-blue-200 hover:bg-white hover:text-blue-600"
          }`}
        aria-label="Bildirimler"
        aria-expanded={open}
      >
        <Icon name="notifications" size={20} color={open ? "#2563EB" : "#64748B"} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[3.25rem] z-50 w-[min(360px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_26px_60px_rgba(15,23,42,0.22)]">
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

          <div className="max-h-[320px] overflow-y-auto">
            {notes.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition-colors duration-150 last:border-b-0
                  ${n.unread ? "bg-blue-50/45 hover:bg-blue-50" : "hover:bg-slate-50"}`}
              >
                <div
                  className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm"
                  style={{ background: n.accent + "18" }}
                >
                  <Icon name={n.icon} size={14} color={n.accent} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`truncate text-[12px] font-semibold leading-snug ${n.unread ? "text-slate-900" : "text-slate-600"}`}>
                      {n.title}
                    </span>
                    {n.unread && (
                      <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: n.accent }} />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{n.desc}</p>
                  <span className="mt-1 block text-[10px] font-medium text-slate-400">{n.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   TOPIC CARD
═══════════════════════════════════════ */
function TopicCard({ topic, patternVariant = 0, onOpen, showCta = true }) {
  const isAbovePeerAverage = Number(topic.progress) >= Number(topic.peerAverage ?? topic.progress);
  const performanceBadge = isAbovePeerAverage ? "Harika Gidiyorsun" : "Hedefe Çok Yakınsın";
  const isInteractive = typeof onOpen === "function";

  return (
    <article
      className={`group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_42px_rgba(37,99,235,.16)] ${
        isInteractive ? "cursor-pointer focus-within:ring-2 focus-within:ring-blue-300 focus-within:ring-offset-1" : ""
      }`}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onOpen : undefined}
      onKeyDown={isInteractive ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      } : undefined}
    >
      <div
        className="relative h-[104px] border-b border-slate-100"
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
        <HeaderPattern color={topic.color} variant={patternVariant} />
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-end px-5 pt-4">
          <span
            className="inline-flex rounded-full border border-white/60 bg-white/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1.1px] backdrop-blur-[10px]"
            style={{
              color: topic.color,
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {performanceBadge}
          </span>
        </div>
      </div>

      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[19px] font-bold tracking-[-0.3px] text-slate-950 leading-[1.2]">
              {topic.title}
            </h2>
            <p className="mt-1.5 text-[13px] font-medium text-slate-500">
              {topic.sub}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2.5">
            <span className="text-[12px] font-semibold uppercase tracking-[0.9px] text-slate-400">
              İlerleme
            </span>
            <span className="text-[13px] font-bold" style={{ color: topic.color }}>
              %{topic.progress}
            </span>
          </div>
          <ProgressBar value={topic.progress} color={topic.color} h="h-1.5" peerAverage={topic.peerAverage} />
        </div>

        <div className="mt-4 w-full">
          <div className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-[1px] text-slate-400">
                  Eğitmen
                </div>
                <div className="mt-1 truncate text-[13px] font-semibold text-slate-700">
                  {topic.instructor}
                </div>
              </div>

              <div className="min-w-0 text-right">
                <div className="text-[11px] uppercase tracking-[1px] text-slate-400">
                  Son Giriş
                </div>
                <div className="mt-1 whitespace-nowrap text-[13px] font-semibold text-slate-700">
                  {topic.lastSeen}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isInteractive && showCta && (
          <div className="mt-4 border-t border-slate-100 pt-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[1.2px] text-blue-600">
              Üniteye Git <Icon name="next" size={11} color="#2563EB" />
            </span>
          </div>
        )}

      </div>
    </article>
  );
}

/* ═══════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();
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
    <div className="dashboard-grid-bg min-h-screen text-slate-900">
      <style>{`
        .dashboard-grid-bg * {
          font-family: "Plus Jakarta Sans", "Inter", "Segoe UI", sans-serif;
        }
        .dashboard-grid-bg {
          background:
            radial-gradient(circle at 15% -8%, rgba(59,130,246,0.18), transparent 30%),
            radial-gradient(circle at 90% 5%, rgba(14,165,233,0.14), transparent 26%),
            #f3f6fc;
          background-image:
            radial-gradient(circle at 1px 1px, rgba(148,163,184,0.16) 1px, transparent 1px);
          background-size: 26px 26px;
        }
        .logo-hex { clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); }
        .glass-header {
          border-bottom: 1px solid rgba(226,232,240,0.88);
          background: rgba(255,255,255,0.84);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .surface-wrap {
          border: 1px solid #dbe5f3;
          border-radius: 24px;
          background: #ffffff;
          box-shadow:
            0 10px 32px rgba(15, 23, 42, 0.07),
            0 2px 8px rgba(15, 23, 42, 0.03);
        }
        .action-btn {
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: white;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          transition: all .2s;
        }
        .action-btn:hover {
          border-color: #bfdbfe;
          background: #eff6ff;
          color: #1d4ed8;
        }
        .topic-grid-card {
          transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s, border-color .25s;
        }
        .topic-grid-card:hover {
          transform: translateY(-4px);
          border-color: #bfdbfe;
          box-shadow: 0 18px 36px rgba(37,99,235,.15);
        }
        @keyframes xp-rise {
          0%   { opacity: 0; transform: translateY(8px) scale(.92); }
          15%  { opacity: 1; transform: translateY(0) scale(1); }
          80%  { opacity: 1; transform: translateY(-6px) scale(1); }
          100% { opacity: 0; transform: translateY(-28px) scale(.96); }
        }
        .xp-toast { animation: xp-rise 1.8s cubic-bezier(.2,.8,.2,1) forwards; }
      `}</style>

      {/* ── XP TOASTS ── */}
      <div className="pointer-events-none fixed bottom-24 right-4 z-[90] flex flex-col items-end gap-2 md:bottom-6 md:right-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="xp-toast flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 shadow-[0_14px_30px_rgba(5,150,105,0.22)]"
          >
            <Icon name="guarantee" size={16} color="#059669" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-emerald-600">+{t.xp} XP</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">+{t.coins} <Icon name="coin" size={10} color="#D97706" /> Coin</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex min-h-screen">
        <DashboardNavbar />

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden pb-24 md:pb-0">

          {/* ══ HEADER ══ */}
          <header className="glass-header sticky top-0 z-40 px-4 py-4 sm:px-6 sm:py-5 xl:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">

              {/* Left: greeting */}
              <div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <h1 className="text-[clamp(22px,2.5vw,32px)] font-bold tracking-[-0.4px] text-slate-950 leading-tight">
                  Hoşgeldin, İlkhan Arda
                </h1>
              </div>

              {/* Right: stats + notification */}
              <div className="flex w-full flex-wrap items-center justify-start gap-2 sm:gap-2.5 lg:w-auto lg:justify-end">
                {/* Insight cards */}
                {headerInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="surface-wrap flex min-h-[52px] min-w-0 flex-1 basis-[250px] items-center gap-2 px-3 py-2.5 sm:basis-[270px] lg:max-w-[300px]"
                  >
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: insight.bg }}
                    >
                      <Icon name={insight.icon} size={12} color={insight.color} />
                    </span>
                    <div className="min-w-0 text-left text-[11px] font-normal leading-[1.45] text-slate-700">
                      {insight.content}
                    </div>
                  </div>
                ))}

                {/* Notification bell */}
                <NotificationDropdown />
              </div>
            </div>

          </header>

          {/* ══ MAIN ══ */}
          <main className="flex-1 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
            <div className="surface-wrap mb-7 p-4 sm:p-5">
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
                  <button
                    type="button"
                    onClick={() => navigate("/topics")}
                    className="action-btn inline-flex items-center gap-1"
                  >
                    Tümünü Gör
                    <Icon name="next" size={12} color="#64748B" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {suggestedTopics.map((topic, idx) => (
                    <TopicCard
                      key={topic.title}
                      topic={topic}
                      patternVariant={idx}
                      onOpen={topic.title === "Temel Kavramlar" ? () => navigate("/topic") : undefined}
                      showCta={topic.title !== "Temel Kavramlar"}
                    />
                  ))}
                </div>
              </section>

            </div>

          </main>

          {/* ══ FOOTER ══ */}
          <footer className="border-t border-slate-200 bg-white/90 px-4 py-3.5 sm:px-6 sm:py-4 xl:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="logo-hex flex h-8 w-8 items-center justify-center bg-[#2563EB] text-[9px] font-bold tracking-tight text-white"
                >
                  C:E
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-slate-900">Code:Enigma Dashboard</div>
                  <div className="text-[9px] uppercase tracking-[1.8px] text-slate-400">
                    Canvas LMS Esintili Panel
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                © {new Date().getFullYear()} Açık ve Uzaktan Eğitim Projesi. Tüm hakları saklıdır.
              </p>
              <p className="text-[10px] text-slate-400">
                Icons by <a href="https://icons8.com" target="_blank" rel="noreferrer" className="font-semibold text-slate-500 hover:text-[#2563EB]">Icons8</a>
              </p>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
