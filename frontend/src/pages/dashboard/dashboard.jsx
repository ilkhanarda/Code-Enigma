import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";
import { useUser } from "../../context/UserContext.jsx";
import DashboardWidgets from "./widgets.jsx";
import Icon from "../../components/ui/icons8-icon.jsx";
import EnigmaAssistant from "../../components/dashboard/enigma-assistant.jsx";
import GuideCartoonPointer from "../../components/dashboard/guide-cartoon-pointer.jsx";
import { buildDashboardStudentContext } from "../../data/dashboardStudentContext.js";
import useDashboardRecommendation from "../../hooks/useDashboardRecommendation.js";

const DASHBOARD_COLORS = {
  accent: "#2563EB",
  accentStrong: "#1D4ED8",
  accentSoft: "#EFF6FF",
  accentSoftAlt: "#DBEAFE",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FAFC",
  border: "#DBE5F3",
  text: "#111827",
  textMuted: "#475569",
  textSubtle: "#94A3B8",
};

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
    color: DASHBOARD_COLORS.accent,
    bg: DASHBOARD_COLORS.accentSoft,
    toneBg: "linear-gradient(135deg, #F2EBFF 0%, #F9F5FF 100%)",
    iconBg: "#E9D5FF",
    icon: "play",
  },
  {
    title: "Sayı Basamakları",
    sub: "Aritmetik · 8 test",
    progress: 72,
    peerAverage: 61,
    badge: "Devam Et",
    lastSeen: "Dün",
    instructor: "Mert Demir",
    color: DASHBOARD_COLORS.accent,
    bg: DASHBOARD_COLORS.accentSoft,
    toneBg: "linear-gradient(135deg, #EAF2FF 0%, #F4F8FF 100%)",
    iconBg: "#DBEAFE",
    icon: "test",
  },
  {
    title: "Rasyonel Sayılar",
    sub: "Sayı Teorisi · 14 set",
    progress: 91,
    peerAverage: 74,
    badge: "Güçlü Alan",
    lastSeen: "3 gün önce",
    instructor: "Dr. Zeynep Alp",
    color: DASHBOARD_COLORS.accent,
    bg: DASHBOARD_COLORS.accentSoft,
    toneBg: "linear-gradient(135deg, #E9FFF2 0%, #F4FFF8 100%)",
    iconBg: "#D1FAE5",
    icon: "chart",
  },
  {
    title: "Denklemler",
    sub: "Cebir · 6 kazanım",
    progress: 48,
    peerAverage: 56,
    badge: "Eksik Var",
    lastSeen: "1 hafta önce",
    instructor: "Burak Yıldız",
    color: DASHBOARD_COLORS.accent,
    bg: DASHBOARD_COLORS.accentSoft,
    toneBg: "linear-gradient(135deg, #EEF2FF 0%, #F8FAFF 100%)",
    iconBg: "#E0E7FF",
    icon: "topics",
  },
  {
    title: "Eşitsizlikler",
    sub: "Canlı ders · 19:00",
    progress: 20,
    peerAverage: 37,
    badge: "Takvimde",
    lastSeen: "Bugün",
    instructor: "Dr. Selin Taş",
    color: DASHBOARD_COLORS.accent,
    bg: DASHBOARD_COLORS.accentSoft,
    toneBg: "linear-gradient(135deg, #ECFEFF 0%, #F4FEFF 100%)",
    iconBg: "#CFFAFE",
    icon: "video",
  },
  {
    title: "Fonksiyonlar",
    sub: "Analiz · 11 içerik",
    progress: 66,
    peerAverage: 52,
    badge: "Planlı",
    lastSeen: "4 gün önce",
    instructor: "Dr. Ayşe Kaya",
    color: DASHBOARD_COLORS.accent,
    bg: DASHBOARD_COLORS.accentSoft,
    toneBg: "linear-gradient(135deg, #EFF6FF 0%, #F8FBFF 100%)",
    iconBg: "#DBEAFE",
    icon: "topics",
  },
  {
    title: "Problem Çözme",
    sub: "Karma · 5 görev",
    progress: 35,
    peerAverage: 44,
    badge: "Görevli",
    lastSeen: "Dün",
    instructor: "Mert Demir",
    color: DASHBOARD_COLORS.accent,
    bg: DASHBOARD_COLORS.accentSoft,
    toneBg: "linear-gradient(135deg, #EFF6FF 0%, #F8FBFF 100%)",
    iconBg: "#DBEAFE",
    icon: "tasks",
  },
  {
    title: "Geometri",
    sub: "Uzay · 7 modül",
    progress: 58,
    peerAverage: 49,
    badge: "Yükseliyor",
    lastSeen: "5 gün önce",
    instructor: "Burak Yıldız",
    color: DASHBOARD_COLORS.accent,
    bg: DASHBOARD_COLORS.accentSoft,
    toneBg: "linear-gradient(135deg, #EFF6FF 0%, #F8FBFF 100%)",
    iconBg: "#DBEAFE",
    icon: "topics",
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
    accent: DASHBOARD_COLORS.accent,
  },
  {
    id: 2, type: "live",
    title: "Canlı ders yaklaşıyor",
    desc: "Eşitsizlikler dersi bugün 19:00'da başlıyor.",
    time: "1 saat önce",
    unread: true,
    icon: "live",
    accent: DASHBOARD_COLORS.accent,
  },
  {
    id: 3, type: "report",
    title: "Haftalık rapor hazır",
    desc: "Bu haftaki performans özetin görüntülenebilir.",
    time: "3 saat önce",
    unread: true,
    icon: "chart",
    accent: DASHBOARD_COLORS.accent,
  },
  {
    id: 4, type: "announce",
    title: "Sistem duyurusu",
    desc: "Yeni içerik kataloğu 15 Mart'tan itibaren aktif.",
    time: "1 gün önce",
    unread: false,
    icon: "announcement",
    accent: DASHBOARD_COLORS.accent,
  },
  {
    id: 5, type: "badge",
    title: "Yeni rozet kazandın!",
    desc: "7 günlük çalışma serisini tamamladın.",
    time: "2 gün önce",
    unread: false,
    icon: "trophy",
    accent: DASHBOARD_COLORS.accent,
  },
];

const AI_PLACEHOLDERS = [
  "Bugünkü konuyu özetle",
  "Bana 5 soru sor",
  "Eksiklerimi açıkla",
];

const bottomStats = [
  { label: "Toplam Çalışma Süresi", value: "24 sa 18 dk", icon: "timer" },
  { label: "Tamamlanan Konu", value: "32", icon: "topics" },
  { label: "Çözülen Soru", value: "173", icon: "test" },
  { label: "Kazanılan Puan", value: "1.280", icon: "coin" },
];

function formatDashboardDate(date = new Date()) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  })
    .format(date)
    .split(" ")
    .map((part) =>
      part ? `${part.charAt(0).toLocaleUpperCase("tr-TR")}${part.slice(1)}` : part
    )
    .join(" ");
}

/* ═══════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════ */

function ProgressBar({ value, color, h = "h-1.5", peerAverage }) {
  const averagePosition = Math.max(2, Math.min(98, Number(peerAverage ?? 50)));
  const isAbovePeers = Number(value) >= Number(peerAverage ?? 50);
  const markerColor = isAbovePeers ? "#86efac" : "#c2410c";
  const markerBorderColor = isAbovePeers ? "#14532d" : "#7c2d12";
  return (
    <div className="relative pt-4">
      <span
        className="pointer-events-none absolute -translate-x-1/2 text-center text-[11px] leading-[1.3] font-semibold"
        style={{ left: `${averagePosition}%`, top: -2, color: DASHBOARD_COLORS.text }}
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
            height: 15,
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
              top: isAbovePeers ? 3 : 2,
              width: 14,
              height: 11,
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

function SectionLabel({
  text,
  color = DASHBOARD_COLORS.text,
  lineColor = DASHBOARD_COLORS.accent,
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px w-5 rounded-full" style={{ background: lineColor }} />
      <span
        className="text-[13px] font-bold uppercase tracking-[1.9px]"
        style={{ color }}
      >
        {text}
      </span>
    </div>
  );
}

function BottomStat({ stat, withDivider }) {
  const showCoin = stat.icon === "coin";
  return (
    <div
      className={`px-5 py-4 ${withDivider ? "xl:border-r xl:border-white/70" : ""}`}
    >
      <div className="min-w-0">
        <p className="text-[14px] font-medium leading-[1.45] text-slate-500">
          {stat.label}
        </p>
        <div className="mt-4 flex items-center gap-2.5">
          {showCoin && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-100/90">
              <Icon name={stat.icon} size={12} color="#F59E0B" />
            </div>
          )}
          <p className="text-[clamp(23px,1.8vw,29px)] font-semibold tracking-[-0.03em] text-[#0f172a]">
            {stat.value}
          </p>
        </div>
      </div>
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
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border border-white/65 bg-white/68 backdrop-blur-xl transition-all duration-200
          ${open
            ? "border-blue-200/85 bg-white/85 text-blue-600 shadow-[0_18px_40px_rgba(37,99,235,.16)]"
            : "text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:border-blue-200/80 hover:bg-white/82 hover:text-blue-600 hover:shadow-[0_16px_34px_rgba(37,99,235,.12)]"
          }`}
        aria-label="Bildirimler"
        aria-expanded={open}
      >
        <Icon name="notifications" size={20} color={open ? DASHBOARD_COLORS.accent : "#64748B"} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[3.5rem] z-50 w-[min(400px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-white/70 bg-white/74 shadow-[0_24px_70px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/65 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-slate-900">Bildirimler</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[12px] font-semibold text-blue-600">
                  {unreadCount} yeni
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[13px] font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Tümünü okundu işaretle
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notes.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className={`flex w-full items-start gap-3.5 border-b border-white/60 px-5 py-4 text-left transition-colors duration-150 last:border-b-0
                  ${n.unread ? "bg-blue-50/55 hover:bg-blue-50/70" : "hover:bg-white/70"}`}
              >
                <div
                  className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-white/65 text-sm shadow-[0_8px_20px_rgba(37,99,235,0.1)]"
                  style={{ background: n.accent + "18" }}
                >
                  <Icon name={n.icon} size={14} color={n.accent} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`truncate text-[14px] font-semibold leading-snug ${n.unread ? "text-slate-900" : "text-slate-600"}`}>
                      {n.title}
                    </span>
                    {n.unread && (
                      <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: n.accent }} />
                    )}
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{n.desc}</p>
                  <span className="mt-1 block text-[12px] font-medium text-slate-400">{n.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AiAskSearchBar({ onSubmit, disabled = false }) {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (query) return undefined;
    const currentText = AI_PLACEHOLDERS[placeholderIndex];
    let delay = isDeleting ? 34 : 62;

    if (!isDeleting && placeholderText.length === currentText.length) {
      delay = 1500;
    }
    if (isDeleting && placeholderText.length === 0) {
      delay = 260;
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (placeholderText.length < currentText.length) {
          setPlaceholderText(currentText.slice(0, placeholderText.length + 1));
          return;
        }
        setIsDeleting(true);
        return;
      }

      if (placeholderText.length > 0) {
        setPlaceholderText(currentText.slice(0, placeholderText.length - 1));
        return;
      }

      setIsDeleting(false);
      setPlaceholderIndex((prev) => (prev + 1) % AI_PLACEHOLDERS.length);
    }, delay);

    return () => clearTimeout(timer);
  }, [isDeleting, placeholderIndex, placeholderText, query]);

  const handleSubmit = () => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery || disabled) return;
    onSubmit?.(normalizedQuery);
    setQuery("");
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleSubmit();
  };

  return (
    <div className="flex h-[60px] w-full items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/92 px-3.5 shadow-[0_12px_26px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <Icon name="ai" size={18} color="#4F46E5" className="shrink-0" />

      <div className="relative min-w-0 flex-1">
        {!query && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-[14px] font-medium text-slate-400">
            {placeholderText}
            <span className="ai-caret">|</span>
          </span>
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="AI Mentor'a Sor"
          className="h-full w-full bg-transparent py-2 text-[14px] font-medium text-slate-700 outline-none"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !query.trim()}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-[0_10px_20px_rgba(37,99,235,0.26)] transition-all hover:bg-blue-600 hover:shadow-[0_12px_24px_rgba(37,99,235,0.3)] disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none"
        aria-label="AI Mentor'a gönder"
      >
        <Icon name="next" size={15} color="#ffffff" />
      </button>
    </div>
  );
}

function AiChatPanel({
  visible,
  messages,
  loading,
  input,
  onInputChange,
  onSend,
  onClose,
}) {
  const messagesRef = useRef(null);

  useEffect(() => {
    if (!visible || !messagesRef.current) return;
    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: messages.length > 0 ? "smooth" : "auto",
    });
  }, [visible, messages, loading]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend?.();
    }
  };

  if (!visible) return null;

  return (
    <section className="mt-3 overflow-hidden rounded-[28px] border border-blue-100/80 bg-white/94 shadow-[0_14px_34px_rgba(37,99,235,0.14)] backdrop-blur-xl">
      <header className="flex items-center justify-between border-b border-blue-50/90 bg-blue-50/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
            <Icon name="ai" size={15} color="#2563EB" />
          </span>
          <div>
            <p className="text-[12px] font-bold text-slate-900">AI Mentor</p>
            <p className="text-[10px] text-slate-500">Sorunu yaz, birlikte çözelim.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-slate-700"
          aria-label="AI mesaj panelini kapat"
        >
          <Icon name="close" size={12} color="#64748B" />
        </button>
      </header>

      <div
        ref={messagesRef}
        className="max-h-[320px] min-h-[190px] space-y-2.5 overflow-y-auto bg-[linear-gradient(180deg,#fbfdff_0%,#f6f9ff_100%)] px-4 py-3"
      >
        {messages.length === 0 && !loading && (
          <div className="rounded-2xl border border-blue-100/80 bg-white/86 px-4 py-5 text-center">
            <div className="mb-2 flex justify-center">
              <Icon name="search" size={16} color="#94A3B8" />
            </div>
            <p className="text-[12px] font-semibold text-slate-700">
              AI Mentor ile konuşma başlat
            </p>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Üstteki arama alanından ya da aşağıdaki kutudan mesaj gönderebilirsin.
            </p>
          </div>
        )}

        {messages.map((message, index) => {
          const isUser = message.role === "user";
          return (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-5 shadow-sm ${
                  isUser
                    ? "rounded-br-md bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                    : "rounded-bl-md border border-blue-100/80 bg-white text-slate-700"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-blue-100 bg-white px-3 py-2">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"
                  style={{ animationDelay: `${index * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-blue-50/80 bg-white px-4 py-3">
        <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/30 px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(event) => onInputChange?.(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajını yaz..."
            aria-label="AI mesajı yaz"
            className="h-8 flex-1 bg-transparent text-[13px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => onSend?.()}
            disabled={loading || !input.trim()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
            aria-label="AI mesajını gönder"
          >
            <Icon name="next" size={13} color="#FFFFFF" />
          </button>
        </div>
        <p className="mt-2 text-[10px] leading-4 text-slate-400">
          Enigma AI hata yapabilir. Cevapları iki kez kontrol et.
        </p>
      </div>
    </section>
  );
}

function AiSuggestionPopup({ recommendation, loading, visible, onAction, onDismiss }) {
  const message = loading
    ? "AI Mentor öğrenme durumunu inceliyor..."
    : recommendation?.message || "Bugün kısa bir tekrar yaparak öğrenme ritmini koruyabilirsin.";
  const hasAction = !loading && recommendation?.actionLabel && recommendation?.targetRoute;

  if (!visible) return null;

  return (
    <div
      className="ai-suggestion-entry mt-3 flex items-start gap-3 rounded-[28px] border border-blue-100/80 bg-white/92 px-4 py-3.5 shadow-[0_14px_32px_rgba(37,99,235,0.12)] backdrop-blur-xl"
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
        <Icon name="ai" size={16} color="#2563EB" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-[1.1px] text-blue-500">
          AI Mentor
        </p>
        <p className="mt-1 text-[13px] leading-5 text-slate-700">{message}</p>
        {hasAction && (
          <button
            type="button"
            onClick={() => onAction(recommendation.targetRoute)}
            className="mt-2 inline-flex shrink-0 items-center rounded-full border border-blue-200/80 bg-blue-50/90 px-3 py-1 text-[11px] font-bold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
            aria-label={`AI Mentor önerisini aç: ${recommendation.actionLabel}`}
          >
            {recommendation.actionLabel}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        aria-label="AI önerisini kapat"
      >
        <span className="text-[14px] leading-none">×</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   TOPIC CARD
═══════════════════════════════════════ */
function TopicCard({ topic, patternVariant = 0, onOpen }) {
  const isInteractive = typeof onOpen === "function";
  const isAbovePeerAverage = Number(topic.progress) >= Number(topic.peerAverage ?? topic.progress);
  const performanceBadge = isAbovePeerAverage ? "Harika Gidiyorsun" : "Hedefe Çok Yakınsın";

  return (
    <article
      className={`group flex h-full min-h-[272px] flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/66 shadow-[0_18px_50px_rgba(37,99,235,0.09)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200/85 hover:bg-white/76 hover:shadow-[0_24px_52px_rgba(37,99,235,.14)] ${
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
        className="relative h-[70px] border-b border-white/70"
        style={{
          background: topic.toneBg || `linear-gradient(135deg, ${DASHBOARD_COLORS.accentSoft} 0%, ${DASHBOARD_COLORS.accentSoftAlt} 50%, ${DASHBOARD_COLORS.surfaceAlt} 100%)`,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-full opacity-90"
          style={{
            background: "radial-gradient(circle at top right, rgba(37,99,235,0.2), transparent 42%)",
          }}
        />
        <HeaderPattern color={DASHBOARD_COLORS.accent} variant={patternVariant} />
        <div className="absolute right-4 top-3 z-10">
          <span
            className="inline-flex rounded-full border border-white/65 bg-white/75 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[1px]"
            style={{
              color: DASHBOARD_COLORS.textMuted,
              WebkitBackdropFilter: "blur(10px)",
              backdropFilter: "blur(10px)",
            }}
          >
            {performanceBadge}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-[20px] font-bold leading-[1.25] tracking-[-0.03em] text-slate-950">
              {topic.title}
            </h2>
            <p className="mt-1.5 text-[13px] font-medium leading-[1.45] text-slate-500">
              {topic.sub}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between gap-2.5">
            <span className="text-[12px] font-semibold uppercase tracking-[0.9px] text-slate-400">
              İlerleme
            </span>
            <span className="text-[15px] font-bold" style={{ color: DASHBOARD_COLORS.accent }}>
              %{topic.progress}
            </span>
          </div>
          <ProgressBar value={topic.progress} color={DASHBOARD_COLORS.accent} h="h-1.5" peerAverage={topic.peerAverage} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/70 pt-4">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.9px] text-slate-400">Eğitmen</div>
            <div className="mt-1 truncate text-[13px] font-semibold text-slate-700">{topic.instructor}</div>
          </div>
          <div className="min-w-0 text-right">
            <div className="text-[11px] uppercase tracking-[0.9px] text-slate-400">Son Erişim</div>
            <div className="mt-1 whitespace-nowrap text-[13px] font-semibold text-slate-700">{topic.lastSeen}</div>
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
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(dailyTasks);
  const [toasts, setToasts] = useState([]);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiChatLoading, setAiChatLoading] = useState(false);
  const [showAiSuggestionPopup, setShowAiSuggestionPopup] = useState(false);
  const [dismissedAiSuggestionPopup, setDismissedAiSuggestionPopup] = useState(false);
  const [activeGuideTarget, setActiveGuideTarget] = useState(null);
  const [guidePulse, setGuidePulse] = useState(0);
  const { user, addCoins, addXp } = useUser();
  const showcaseRef = useRef(null);
  const topicsRef = useRef(null);
  const missionRef = useRef(null);
  const doneTasks = tasks.filter((t) => t.done).length;
  const dashboardDate = formatDashboardDate(new Date());
  const welcomeName = user?.name === "İlkhan" ? "İlkhan Arda" : user?.name || "İlkhan Arda";
  const visibleTopics = suggestedTopics.slice(0, 3);
  const studentContext = useMemo(() => buildDashboardStudentContext({ user, tasks }), [user, tasks]);
  const {
    recommendation,
    loading: recommendationLoading,
  } = useDashboardRecommendation(studentContext);
  const { strongestTopic, weakestTopic } = useMemo(() => {
    if (!suggestedTopics.length) {
      return { strongestTopic: "Rasyonel Sayılar", weakestTopic: "Eşitsizlikler" };
    }
    let strongest = suggestedTopics[0];
    let weakest = suggestedTopics[0];
    suggestedTopics.forEach((topic) => {
      if (topic.progress > strongest.progress) strongest = topic;
      if (topic.progress < weakest.progress) weakest = topic;
    });
    return { strongestTopic: strongest.title, weakestTopic: weakest.title };
  }, []);
  const dashboardAiSummary = useMemo(() => {
    const completedTaskCount = tasks.filter((task) => task.done).length;
    const pendingTaskTitles = tasks
      .filter((task) => !task.done)
      .map((task) => task.title);
    const topicSummary = suggestedTopics
      .slice(0, 3)
      .map((topic) => `${topic.title} (%${topic.progress})`)
      .join(", ");

    return [
      `Öğrenci ${welcomeName}.`,
      `Seviye ${user?.level ?? 0}, seri ${user?.streak ?? 0} gün.`,
      `Görev durumu ${completedTaskCount}/${tasks.length}.`,
      pendingTaskTitles.length
        ? `Kalan görevler: ${pendingTaskTitles.join(", ")}.`
        : "Bugünkü görevlerin tamamı tamamlandı.",
      `Önerilen dersler: ${topicSummary}.`,
    ].join(" ");
  }, [tasks, user?.level, user?.streak, welcomeName]);

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

  const focusGuideTarget = (target) => {
    if (!target) return;
    setActiveGuideTarget(null);
    setTimeout(() => {
      setActiveGuideTarget(target);
      setGuidePulse((prev) => prev + 1);
      const node =
        target === "showcase"
          ? showcaseRef.current
          : target === "topics"
            ? topicsRef.current
            : missionRef.current;
      node?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 20);
  };

  const openRecommendationTarget = (targetRoute) => {
    if (targetRoute) navigate(targetRoute);
  };

  const sendDashboardAiMessage = async (incomingText) => {
    const text =
      typeof incomingText === "string" ? incomingText.trim() : aiChatInput.trim();
    if (!text || aiChatLoading) return;

    const history = aiChatMessages
      .slice(-6)
      .filter((message) => {
        if (!message) return false;
        if (message.role !== "user" && message.role !== "assistant") return false;
        return typeof message.content === "string" && message.content.trim().length > 0;
      })
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    setAiChatOpen(true);
    setAiChatInput("");
    setAiChatMessages((prev) => [...prev, { role: "user", content: text }]);
    setAiChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history,
          chapter: {
            phase: "Dashboard",
            title: "AI Mentor Sohbeti",
            summary: dashboardAiSummary,
          },
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.reply || "AI isteği başarısız oldu.");
      }

      const reply = data?.reply?.trim() || "Şu an yanıt üretemedim. Lütfen tekrar dene.";
      setAiChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      setAiChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error?.message || "Bağlantı hatası. Lütfen tekrar deneyin.",
        },
      ]);
    } finally {
      setAiChatLoading(false);
    }
  };

  useEffect(() => {
    if (!activeGuideTarget) return undefined;
    const timeoutMs = 5600;
    const timer = setTimeout(() => setActiveGuideTarget(null), timeoutMs);
    return () => clearTimeout(timer);
  }, [activeGuideTarget, guidePulse]);

  useEffect(() => {
    if (recommendationLoading || dismissedAiSuggestionPopup) return undefined;
    setShowAiSuggestionPopup(false);
    const timer = setTimeout(() => {
      setShowAiSuggestionPopup(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [recommendationLoading, recommendation?.message, dismissedAiSuggestionPopup]);

  return (
    <div className="dashboard-grid-bg relative min-h-screen overflow-x-clip text-slate-900">
      <style>{`
        .dashboard-grid-bg {
          background:
            radial-gradient(circle at 12% 8%, rgba(99,102,241,0.16), transparent 30%),
            radial-gradient(circle at 85% 12%, rgba(56,189,248,0.14), transparent 28%),
            radial-gradient(circle at 90% 82%, rgba(251,191,36,0.10), transparent 26%),
            linear-gradient(180deg, #f8fbff 0%, #eef5ff 48%, #f7fbff 100%);
        }
        .logo-hex { clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); }
        .action-btn {
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.68);
          background: rgba(255,255,255,0.72);
          padding: 11px 18px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          transition: all .2s;
          box-shadow: 0 14px 30px rgba(37,99,235,.09);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }
        .action-btn:hover {
          border-color: rgba(147,197,253,0.92);
          background: rgba(255,255,255,0.86);
          color: #1d4ed8;
          box-shadow: 0 18px 40px rgba(37,99,235,.14);
        }
        @keyframes xp-rise {
          0%   { opacity: 0; transform: translateY(8px) scale(.92); }
          15%  { opacity: 1; transform: translateY(0) scale(1); }
          80%  { opacity: 1; transform: translateY(-6px) scale(1); }
          100% { opacity: 0; transform: translateY(-28px) scale(.96); }
        }
        @keyframes ai-caret-blink {
          0%, 48% { opacity: 1; }
          49%, 100% { opacity: 0; }
        }
        .ai-caret {
          margin-left: 2px;
          animation: ai-caret-blink .9s linear infinite;
        }
        @keyframes ai-suggestion-entry {
          0% { opacity: 0; transform: translateY(-16px) scale(0.96); }
          62% { opacity: 1; transform: translateY(2px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ai-suggestion-entry {
          animation: ai-suggestion-entry .58s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .xp-toast { animation: xp-rise 1.8s cubic-bezier(.2,.8,.2,1) forwards; }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-[-130px] h-[360px] w-[360px] rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute right-[-120px] top-[-110px] h-[340px] w-[340px] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[16%] h-[320px] w-[320px] rounded-full bg-amber-100/35 blur-3xl" />
      </div>

      {/* ── XP TOASTS ── */}
      <div className="pointer-events-none fixed bottom-24 right-4 z-[90] flex flex-col items-end gap-2 md:bottom-6 md:right-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="xp-toast flex items-center gap-2 rounded-2xl border border-white/70 bg-white/76 px-4 py-2.5 shadow-[0_18px_50px_rgba(37,99,235,0.18)] backdrop-blur-xl"
          >
            <Icon name="guarantee" size={16} color={DASHBOARD_COLORS.accent} />
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-blue-600">+{t.xp} XP</span>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-500">+{t.coins} <Icon name="coin" size={10} color={DASHBOARD_COLORS.accent} /> Coin</span>
            </div>
          </div>
        ))}
      </div>

      <EnigmaAssistant
        playerName={welcomeName}
        strongTopic={strongestTopic}
        weakTopic={weakestTopic}
        activeTarget={activeGuideTarget}
        onSuggestionClick={focusGuideTarget}
      />

      <div className="relative z-10 flex min-h-screen">
        <DashboardNavbar />

        <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden pb-24 md:pb-0">
          <main className="flex-1 overflow-x-hidden p-2.5 sm:p-4 xl:p-6">
            <div className="mx-auto flex w-full max-w-[1740px] 2xl:max-w-[1840px] flex-col gap-8 xl:gap-10">
              <section className="px-2 sm:px-3 xl:px-4 2xl:px-5">
                <div className="grid gap-6 xl:grid-cols-[minmax(380px,1.2fr)_minmax(0,1fr)] xl:items-stretch 2xl:grid-cols-[minmax(460px,1.35fr)_minmax(0,1fr)]">
                  <div className="min-w-0 xl:max-w-none xl:pr-4 2xl:pr-6">
                    <div className="flex h-full flex-col justify-center">
                      <p className="text-[14px] font-medium text-slate-500">
                        {dashboardDate}
                      </p>
                      <h1 className="mt-2 text-[clamp(30px,2.3vw,36px)] font-bold leading-[1.15] tracking-[-0.035em] text-slate-950">
                        Hoşgeldin, {welcomeName} 👋
                      </h1>
                      <p className="mt-2.5 max-w-xl text-[15px] leading-6 text-slate-600">
                        Bugün yeni bir şey öğrenmek için harika bir gün!
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex h-full flex-col items-end justify-center">
                      <div className="w-full">
                        <div className="flex w-full items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <AiAskSearchBar
                              onSubmit={sendDashboardAiMessage}
                              disabled={aiChatLoading}
                            />
                          </div>
                          <NotificationDropdown />
                        </div>
                        <AiChatPanel
                          visible={aiChatOpen}
                          messages={aiChatMessages}
                          loading={aiChatLoading}
                          input={aiChatInput}
                          onInputChange={setAiChatInput}
                          onSend={sendDashboardAiMessage}
                          onClose={() => setAiChatOpen(false)}
                        />
                        <AiSuggestionPopup
                          recommendation={recommendation}
                          loading={recommendationLoading}
                          visible={showAiSuggestionPopup && !aiChatOpen}
                          onAction={openRecommendationTarget}
                          onDismiss={() => {
                            setShowAiSuggestionPopup(false);
                            setDismissedAiSuggestionPopup(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                ref={showcaseRef}
                className="px-2 sm:px-3 xl:px-4 2xl:px-5"
              >
                <DashboardWidgets
                  tasks={tasks}
                  onToggleTask={toggleTask}
                  doneTasks={doneTasks}
                  user={user}
                  guideState={{
                    target: activeGuideTarget,
                    pulse: guidePulse,
                  }}
                />
              </section>

              <section
                ref={topicsRef}
                className="relative px-2 sm:px-3 xl:px-4 2xl:px-5"
              >
                <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="text-[26px] font-bold tracking-[-0.04em] text-slate-950">Günün Dersleri</h2>
                    <p className="mt-2 text-[14px] leading-6 text-slate-500">
                      Bugün odaklanman önerilen 3 ders burada.
                    </p>
                  </div>
                  <div className="relative">
                    {activeGuideTarget === "topics" && (
                      <GuideCartoonPointer
                        routeKey={`topics-pointer-${guidePulse}`}
                        target="topics"
                        side="left"
                        size={80}
                        className="right-[calc(100%+10px)] top-1/2 -translate-y-1/2"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => navigate("/topics")}
                      className={`action-btn inline-flex items-center gap-1.5 ${activeGuideTarget === "topics" ? "enigma-guide-button-toon" : ""}`}
                    >
                      Tümünü Gör
                      <Icon name="next" size={12} color="#64748B" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                  {visibleTopics.map((topic, idx) => (
                    <TopicCard
                      key={topic.title}
                      topic={topic}
                      patternVariant={idx}
                      onOpen={topic.title === "Temel Kavramlar" ? () => navigate("/topic") : undefined}
                    />
                  ))}
                </div>
              </section>

              <section className="grid gap-5 px-2 sm:px-3 lg:grid-cols-[minmax(280px,1fr)_minmax(0,1.45fr)] xl:grid-cols-[minmax(300px,0.98fr)_minmax(0,1.78fr)_minmax(260px,0.95fr)] 2xl:grid-cols-[minmax(340px,1fr)_minmax(0,1.95fr)_minmax(320px,1fr)] xl:auto-rows-fr xl:px-4 2xl:px-5">
                <article
                  ref={missionRef}
                  className="relative h-full rounded-[32px] border border-white/70 bg-white/62 px-7 py-6 shadow-[0_18px_50px_rgba(37,99,235,0.09)] backdrop-blur-2xl"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full">
                      <Icon name="goal" size={58} color="#ef4444" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[24px] font-bold leading-[1.18] tracking-[-0.03em] text-[#0f172a]">
                        Hedefe Çok Yakınsın!
                      </h3>
                      <p className="mt-2.5 text-[15px] leading-[1.65] text-slate-600">
                        Bugünkü planını tamamla ve serini koru.
                      </p>
                    </div>
                  </div>
                  <div className="relative mt-6 w-full max-w-[290px]">
                    {activeGuideTarget === "mission" && (
                      <GuideCartoonPointer
                        routeKey={`mission-pointer-${guidePulse}`}
                        target="mission"
                        side="left"
                        size={78}
                        className="right-[calc(100%+6px)] top-1/2 -translate-y-1/2"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => navigate("/test")}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/65 bg-gradient-to-br from-blue-600/95 via-blue-500/95 to-cyan-500/95 px-6 py-3.5 text-[16px] font-semibold text-white shadow-[0_16px_34px_rgba(37,99,235,0.26)] transition-all hover:brightness-105 hover:shadow-[0_20px_38px_rgba(37,99,235,0.3)] ${activeGuideTarget === "mission" ? "enigma-guide-button-toon" : ""}`}
                    >
                      Çalışmaya Devam Et
                      <Icon name="next" size={13} color="#ffffff" />
                    </button>
                  </div>
                </article>

                <article className="h-full rounded-[32px] border border-white/70 bg-white/62 p-5 shadow-[0_18px_50px_rgba(37,99,235,0.08)] backdrop-blur-2xl sm:p-6">
                  <div className="grid h-full gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-1">
                    {bottomStats.map((stat, index) => (
                      <BottomStat
                        key={stat.label}
                        stat={stat}
                        withDivider={index !== bottomStats.length - 1}
                      />
                    ))}
                  </div>
                </article>

                <article className="h-full rounded-[32px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.7),rgba(255,250,238,0.78))] px-7 py-6 shadow-[0_18px_44px_rgba(180,138,69,0.1)] backdrop-blur-2xl lg:col-span-2 xl:col-span-1">
                  <div className="flex h-full items-center justify-between gap-5">
                    <p className="max-w-[230px] text-[22px] font-medium leading-[1.38] tracking-[-0.02em] text-[#0f172a]">
                      Küçük adımlar, büyük başarılar getirir.
                    </p>
                    <div className="relative flex h-28 w-28 items-center justify-center">
                      <Icon name="trophy" size={76} color="#f59e0b" />
                      <span className="absolute -left-1 top-5 text-[12px] text-amber-400">✦</span>
                      <span className="absolute right-1 top-2 text-[10px] text-amber-300">✦</span>
                      <span className="absolute right-0 bottom-4 text-[10px] text-amber-400">✦</span>
                    </div>
                  </div>
                </article>
              </section>
            </div>
          </main>

          {/* ══ FOOTER ══ */}
          <footer className="border-t border-white/75 bg-white/62 px-3 py-5 shadow-[0_-8px_30px_rgba(15,23,42,0.04)] backdrop-blur-2xl sm:px-4 sm:py-6 xl:px-6">
            <div className="mx-auto flex w-full max-w-[1740px] flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className="logo-hex flex h-9 w-9 items-center justify-center bg-[#2563EB] text-[11px] font-bold tracking-tight text-white"
                >
                  C:E
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-slate-900">Code:Enigma Dashboard</div>
                  <div className="text-[11px] uppercase tracking-[1.8px] text-slate-400">
                    Premium LMS Paneli
                  </div>
                </div>
              </div>
              <p className="text-[12px] text-slate-400">
                © {new Date().getFullYear()} Açık ve Uzaktan Eğitim Projesi. Tüm hakları saklıdır.
              </p>
              <p className="text-[12px] text-slate-400">
                Icons by <a href="https://icons8.com" target="_blank" rel="noreferrer" className="font-semibold text-slate-500 hover:text-[#2563EB]">Icons8</a>
              </p>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
