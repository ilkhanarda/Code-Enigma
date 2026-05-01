import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../../components/ui/icons8-icon.jsx";
import GuideCartoonPointer from "../../components/dashboard/guide-cartoon-pointer.jsx";

const STORAGE_KEY = "code-enigma:dashboard-widgets";
const NOTES_STORAGE_KEY = "code-enigma:dashboard-widget-notes";
const DEFAULT_ACTIVE_WIDGETS = ["tasks", "achievements", "ranking"];
const WIDGET_COLORS = {
  accent: "#2563EB",
  accentStrong: "#1D4ED8",
  accentSoft: "#EFF6FF",
  accentSoftAlt: "#DBEAFE",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FAFC",
  border: "#E2E8F0",
  borderAccent: "#BFDBFE",
  text: "#111827",
  textMuted: "#475569",
  textSubtle: "#94A3B8",
  iconMuted: "#64748B",
};

// square = 1:1  |  wide = 2:1
const WIDGET_META = [
  { id: "tasks",        title: "Günlük Görevler",   description: "Bugünkü görev akışı ve XP.",          size: "square", accent: WIDGET_COLORS.accent, icon: "tasks" },
  { id: "achievements", title: "Başarım Vitrini",   description: "Rozetler ve kilitli başarımlar.",      size: "wide",   accent: WIDGET_COLORS.accent, icon: "achievements" },
  { id: "ranking",      title: "Lig & Sıralama",    description: "Haftalık lig ve sıralama.",            size: "wide",   accent: WIDGET_COLORS.accent, icon: "ranking" },
  { id: "journey",      title: "Öğrenme Yolculuğu", description: "Aktif modül ve sıradaki durak.",       size: "square", accent: WIDGET_COLORS.accent, icon: "journey" },
  { id: "stats",        title: "İstatistikler",      description: "Seviye, coin, seri, görev.",           size: "wide",   accent: WIDGET_COLORS.accent, icon: "stats" },
  { id: "goals",        title: "Günlük Hedef",       description: "Odak, seri ve seviye ilerlemesi.",     size: "square", accent: WIDGET_COLORS.accent, icon: "goals" },
  { id: "streak",       title: "Çalışma Serisi",     description: "Isı haritası ve seri takibi.",         size: "wide",   accent: WIDGET_COLORS.accent, icon: "streak" },
  { id: "quiz",         title: "Sınav Takvimi",      description: "Yaklaşan quiz ve sınavlar.",           size: "wide",   accent: WIDGET_COLORS.accent, icon: "quiz" },
  { id: "notes",        title: "Hızlı Notlar",       description: "Kısa notları dashboard'dan düzenle.", size: "square", accent: WIDGET_COLORS.accent, icon: "notes" },
  { id: "focus",        title: "Odak Sayacı",        description: "Pomodoro tabanlı çalışma sayacı.",    size: "square", accent: WIDGET_COLORS.accent, icon: "focus" },
  { id: "xplog",        title: "XP Geçmişi",         description: "Son 7 günün XP kazanımları.",         size: "wide",   accent: WIDGET_COLORS.accent, icon: "bullish" },
];

const SHOWCASE_MAX_UNITS = 5;
const WIDGET_META_BY_ID = new Map(WIDGET_META.map((widget) => [widget.id, widget]));
const WIDGET_IDS = new Set(WIDGET_META_BY_ID.keys());

const badgeSeed = [
  { icon: "graduation", title: "İlk Ders Tamamlandı", bg: WIDGET_COLORS.accentSoft, color: WIDGET_COLORS.accent, locked: false },
  { icon: "streak", title: "7 Günlük Seri", bg: WIDGET_COLORS.accentSoft, color: WIDGET_COLORS.accent, locked: false },
  { icon: "chart", title: "İlk 100 Soru", bg: WIDGET_COLORS.accentSoft, color: WIDGET_COLORS.accent, locked: false },
  { icon: "book_stack", title: "5 Kurs Tamamlandı", bg: WIDGET_COLORS.accentSoft, color: WIDGET_COLORS.accent, locked: false },
  { icon: "bolt", title: "Hızlı Öğrenen", bg: WIDGET_COLORS.accentSoft, color: WIDGET_COLORS.accent, locked: false },
  { icon: "trophy", title: "Lig Şampiyonu", bg: WIDGET_COLORS.accentSoft, color: WIDGET_COLORS.accent, locked: false },
  { icon: "lock", title: "Mükemmeliyet Kilidi", bg: WIDGET_COLORS.surfaceAlt, color: WIDGET_COLORS.textSubtle, locked: true  },
  { icon: "lock", title: "Elmas Lig Kilidi", bg: WIDGET_COLORS.surfaceAlt, color: WIDGET_COLORS.textSubtle, locked: true  },
];

const journeySeed = [
  { title: "Temel Matematik", desc: "8 modül",    statusIcon: "check", status: "Tamam", tone: "done"   },
  { title: "Cebir I",         desc: "12 modül",   statusIcon: "check", status: "Tamam", tone: "done"   },
  { title: "Cebir II",        desc: "5/14 modül", status: "36%", tone: "active" },
  { title: "Geometri",        desc: "Kilitli",    statusIcon: "lock", status: "Kilitli", tone: "locked" },
];

const upcomingQuizzes = [
  { subject: "Cebir II",       date: "23 Nis", type: "Quiz",  color: WIDGET_COLORS.accent },
  { subject: "Geometri Giriş", date: "28 Nis", type: "Sınav", color: WIDGET_COLORS.accent },
  { subject: "Lineer Cebir",   date: "5 May",  type: "Quiz",  color: WIDGET_COLORS.accent },
  { subject: "Olasılık",       date: "12 May", type: "Ödev",  color: WIDGET_COLORS.accent },
];

const quickNotesSeed = [
  { id: 1, text: "Cebir II — türev formüllerini tekrar et",    color: WIDGET_COLORS.surface },
  { id: 2, text: "Geometri: pisagor uygulamaları konu 4",      color: WIDGET_COLORS.surface },
  { id: 3, text: "Hocaya sor: limit tanımı belirsizlik",       color: WIDGET_COLORS.surface },
];

const xpLogSeed = [
  { day: "Pzt", xp: 120 }, { day: "Sal", xp: 200 }, { day: "Çar", xp: 80  },
  { day: "Per", xp: 310 }, { day: "Cum", xp: 150 }, { day: "Cmt", xp: 260 },
  { day: "Paz", xp: 190 },
];

const POMODORO_WORK_SECONDS = 25 * 60;
const POMODORO_BREAK_SECONDS = 5 * 60;

const heatSeed = Array.from({ length: 35 }, () => ({
  active: Math.random() > 0.35,
  intensity: Math.floor(Math.random() * 3) + 1,
}));

function formatNumber(v) { return new Intl.NumberFormat("tr-TR").format(v); }

function getWidgetUnits(size) {
  return size === "wide" ? 2 : 1;
}

function getUsedWidgetUnits(widgetIds, widgetMetaById) {
  return widgetIds.reduce((sum, id) => {
    const widget = widgetMetaById.get(id);
    if (!widget) return sum;
    return sum + getWidgetUnits(widget.size);
  }, 0);
}

function clampWidgetIdsByCapacity(widgetIds, widgetMetaById, maxUnits = SHOWCASE_MAX_UNITS) {
  const nextIds = [];
  let usedUnits = 0;

  widgetIds.forEach((id) => {
    const widget = widgetMetaById.get(id);
    if (!widget) return;
    const units = getWidgetUnits(widget.size);
    if (usedUnits + units > maxUnits) return;
    nextIds.push(id);
    usedUnits += units;
  });

  return nextIds;
}

function sanitizeWidgetIds(ids) {
  if (!Array.isArray(ids)) return DEFAULT_ACTIVE_WIDGETS;
  return Array.from(new Set(ids)).filter((id) => WIDGET_IDS.has(id));
}

function hasStoredActiveWidgets() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function loadActiveWidgets() {
  if (typeof window === "undefined") return DEFAULT_ACTIVE_WIDGETS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === null ? DEFAULT_ACTIVE_WIDGETS : sanitizeWidgetIds(JSON.parse(raw));
  } catch { return DEFAULT_ACTIVE_WIDGETS; }
}

function sanitizeNotes(notes) {
  if (!Array.isArray(notes)) return quickNotesSeed;
  return notes
    .filter((note) => note && typeof note.text === "string" && note.text.trim())
    .map((note, index) => ({
      id: note.id ?? `note-${index}`,
      text: note.text.trim(),
      color: note.color || WIDGET_COLORS.surface,
    }));
}

function loadQuickNotes() {
  if (typeof window === "undefined") return quickNotesSeed;
  try {
    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY);
    return raw === null ? quickNotesSeed : sanitizeNotes(JSON.parse(raw));
  } catch {
    return quickNotesSeed;
  }
}

function ProgressBar({ value, color, height = "6px" }) {
  return (
    <div className="overflow-hidden rounded-full border border-white/70 bg-white/65 backdrop-blur-sm" style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  );
}

function Eyebrow({ accent, children }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px w-5 rounded-full" style={{ background: accent }} />
      <span className="text-[clamp(14px,0.78vw,15.5px)] font-bold uppercase tracking-[1.8px]" style={{ color: WIDGET_COLORS.text }}>
        {children}
      </span>
    </div>
  );
}

function WidgetHeader({ title, right }) {
  return (
    <div className="dashboard-widget-header flex min-h-[34px] items-start justify-between gap-2.5">
      <Eyebrow accent={WIDGET_COLORS.accent}>{title}</Eyebrow>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function WidgetBody({ className = "", children }) {
  return <div className={`dashboard-widget-body mt-3 flex min-h-0 flex-1 flex-col ${className}`}>{children}</div>;
}

function WidgetShell({ widget, isCustomizing, children }) {
  return (
    <article
      className={`dashboard-widget-shell group relative h-full overflow-visible rounded-[28px] border border-white/70 bg-white/66 p-3.5 shadow-[0_18px_50px_rgba(37,99,235,0.08)] backdrop-blur-2xl transition-all duration-300 sm:p-4 ${
        isCustomizing
          ? "ring-1 ring-blue-200/80 ring-offset-2 ring-offset-[#eef5ff] hover:-translate-y-0.5"
          : "hover:-translate-y-0.5 hover:border-blue-200/85 hover:bg-white/78 hover:shadow-[0_24px_52px_rgba(37,99,235,.14)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at top right, ${widget.accent}1f, transparent 50%)` }}
        />
      </div>
      <div className={isCustomizing ? "pointer-events-none h-full select-none" : "h-full"}>
        {children}
      </div>
    </article>
  );
}

function WidgetSlot({ widget, isCustomizing, children }) {
  const isWide = widget.size === "wide";
  const slotClass = isWide
    ? "col-span-1 sm:col-span-2 lg:col-span-2 2xl:col-span-2"
    : "col-span-1 sm:col-span-1 lg:col-span-1 2xl:col-span-1";
  const minHeight = 224;
  const maxHeight = 312;
  const fluidHeight = "clamp(224px,21vw,312px)";

  return (
    <div className={slotClass}>
      <div style={{ height: fluidHeight, minHeight, maxHeight }}>
        <WidgetShell widget={widget} isCustomizing={isCustomizing}>
          {children}
        </WidgetShell>
      </div>
    </div>
  );
}

// ── Widget: Goals (1:1) ───────────────────────────────────────────────────────
function GoalsWidget({ doneTasks, totalTasks, user }) {
  const daily  = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const weekly = Math.min(100, Math.round(((user?.streak || 0) / 7) * 100));
  const level  = Math.min(100, Math.round(((user?.xp || 0) / 1000) * 100));
  const rows   = [
    { label: "Bugün",  value: `${doneTasks}/${totalTasks}`, progress: daily,  color: WIDGET_COLORS.accent },
    { label: "Seri",   value: `${user?.streak || 0}/7`,     progress: weekly, color: WIDGET_COLORS.accent },
    { label: "Seviye", value: `%${level}`,                  progress: level,  color: WIDGET_COLORS.accent },
  ];

  return (
    <div className="flex h-full flex-col">
      <WidgetHeader title="Günlük Hedef" />
      <WidgetBody className="justify-between">
        <div className="flex min-h-0 flex-1 items-center justify-center py-1.5">
          <div
            className="dashboard-widget-goal-ring relative flex items-center justify-center rounded-full"
            style={{
              width: "clamp(72px,6.5vw,94px)",
              height: "clamp(72px,6.5vw,94px)",
              padding: "clamp(5px,0.6vw,8px)",
              background: `conic-gradient(${WIDGET_COLORS.accent} 0deg ${daily * 3.6}deg, #E2E8F0 ${daily * 3.6}deg 360deg)`,
            }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full border border-white/70 bg-white/78 backdrop-blur-md">
              <span className="text-[clamp(18px,1.2vw,22px)] font-bold text-[#111827]">%{daily}</span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="mb-0.5 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-400">{r.label}</span>
                <span className="text-[13px] font-bold" style={{ color: r.color }}>{r.value}</span>
              </div>
              <ProgressBar value={r.progress} color={r.color} height="4px" />
            </div>
          ))}
        </div>
      </WidgetBody>
    </div>
  );
}

// ── Widget: Daily Tasks (1:1) ─────────────────────────────────────────────────
function DailyTasksWidget({ tasks, doneTasks, onToggleTask }) {
  const pct = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const visibleTasks = tasks.slice(0, 3);

  return (
    <div className="flex h-full flex-col">
      <WidgetHeader
        title="Görevler"
        right={<span className="text-[14px] font-bold text-blue-600">{doneTasks}/{tasks.length}</span>}
      />
      <WidgetBody>
        <ProgressBar
          value={pct}
          color={WIDGET_COLORS.accent}
          height="4px"
        />
        <div className="mt-2.5 flex flex-1 flex-col gap-2">
          {visibleTasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onToggleTask(task.id)}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all ${
                task.done
                  ? "border-blue-200/80 bg-blue-50/65 shadow-[0_10px_22px_rgba(37,99,235,0.09)]"
                  : "border-white/70 bg-white/72 backdrop-blur-md hover:border-blue-200/80 hover:bg-white/86"
              }`}
            >
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <Icon
                  name={task.done ? "check_box" : "unchecked_box"}
                  size={15}
                  color={task.done ? WIDGET_COLORS.accent : WIDGET_COLORS.textSubtle}
                />
              </div>
              <span className={`min-w-0 flex-1 text-[14px] leading-[1.4] ${task.done ? "text-slate-700 line-through" : "text-slate-600"}`}>
                {task.title}
              </span>
              <span className={`text-[13px] font-bold ${task.done ? "text-blue-600" : "text-slate-400"}`}>
                +{task.xp}
              </span>
            </button>
          ))}
        </div>
      </WidgetBody>
    </div>
  );
}

// ── Widget: Achievements (2:1) ────────────────────────────────────────────────
function AchievementWidget({ badges }) {
  const unlocked = badges.filter((b) => !b.locked).length;
  const visibleBadges = badges.slice(0, 6);

  return (
    <div className="flex h-full flex-col">
      <WidgetHeader
        title="Başarımlar"
        right={<span className="text-[14px] font-bold text-blue-600">{unlocked}/{badges.length}</span>}
      />
      <WidgetBody className="grid grid-cols-3 gap-2">
        {visibleBadges.map((b) => (
          <div
            key={b.title}
            className={`flex flex-col items-center justify-center rounded-xl border px-2 py-2 ${
              b.locked ? "border-white/65 bg-white/50 opacity-45" : "border-white/70 bg-white/72 backdrop-blur-sm"
            }`}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: b.bg }}>
              <Icon name={b.icon} size={12} color={b.color} />
            </div>
            <div className="mt-1 text-center text-[12px] font-semibold leading-[1.25] text-slate-600">{b.title}</div>
          </div>
        ))}
      </WidgetBody>
    </div>
  );
}

// ── Widget: Ranking (2:1) ─────────────────────────────────────────────────────
function RankingWidget({ rankingTab, onRankingTabChange, rankingData }) {
  const current = rankingData[rankingTab];
  const me      = current.find((r) => r.me);
  const rankingRows = current.slice(0, 3);
  const meRankLabel = `${String(me?.rank || "#8").replace("#", "")}.`;

  return (
    <div className="flex h-full flex-col">
      <WidgetHeader
        title="Sıralama"
        right={(
          <div className="flex gap-1.5">
            {[["haftalik","Haftalık"],["sinif","Sınıf"],["arkadaslar","Arkadaş"]].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => onRankingTabChange(key)}
                className={`rounded-full px-2.5 py-1.5 text-[13px] font-semibold tracking-[0.2px] transition-all ${
                  rankingTab === key ? "border border-blue-200/80 bg-blue-50/75 text-blue-600 shadow-[0_10px_22px_rgba(37,99,235,0.1)]" : "border border-white/65 bg-white/68 text-slate-500 backdrop-blur-sm hover:border-blue-100 hover:bg-white/82"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      />
      <WidgetBody className="justify-between">
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          {rankingRows.map((row, index) => (
            <div
              key={`${rankingTab}-${row.rank}-${row.name}`}
              className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 ${
                row.me ? "border-blue-200/80 bg-blue-50/65 shadow-[0_10px_22px_rgba(37,99,235,0.1)]" : "border-white/70 bg-white/72 backdrop-blur-sm"
              }`}
            >
              <span className="flex w-6 items-center justify-center text-[14px] font-bold text-slate-400">
                {index + 1}.
              </span>
              <div className="flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-lg" style={{ background: row.bg }}>
                <Icon name={row.avatar} size={12} />
              </div>
              <span className={`min-w-0 flex-1 truncate text-[14px] font-semibold ${row.me ? "text-blue-700" : "text-slate-700"}`}>
                {row.name}
              </span>
              <span className={`text-[13px] font-bold ${row.me ? "text-blue-600" : "text-slate-500"}`}>
                {row.points}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 rounded-xl border border-blue-200/80 bg-blue-50/70 px-3 py-2 shadow-[0_12px_24px_rgba(37,99,235,0.11)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-[14px] font-bold text-[#111827]">{meRankLabel}</span>
              <div className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-lg" style={{ background: me?.bg || "linear-gradient(135deg,#2563EB,#60A5FA)" }}>
                <Icon name={me?.avatar || "avatar_teddy_bear"} size={12} />
              </div>
              <span className="truncate text-[14px] font-semibold text-blue-700">Sen</span>
            </div>
            <span className="text-[13px] font-bold text-blue-700">{me?.points || "2 750 pts"}</span>
          </div>
        </div>
      </WidgetBody>
    </div>
  );
}

// ── Widget: Journey (1:1) ─────────────────────────────────────────────────────
function JourneyWidget() {
  const tone = {
    done:   { card: "border-white/70 bg-white/74 backdrop-blur-sm",                   dot: "bg-blue-600",                       title: "text-slate-900",   badge: "bg-blue-50/75 text-blue-600"        },
    active: { card: "border-blue-200/80 bg-blue-50/68 shadow-[0_10px_24px_rgba(37,99,235,0.11)] backdrop-blur-sm",                 dot: "bg-blue-600 ring-2 ring-blue-100", title: "text-slate-900",   badge: "bg-white/90 text-blue-600"          },
    locked: { card: "border-white/65 bg-white/52 opacity-55", dot: "bg-slate-300",                    title: "text-slate-400",   badge: "bg-slate-200/80 text-slate-400"     },
  };

  return (
    <div className="flex h-full flex-col">
      <WidgetHeader title="Yolculuk" />
      <WidgetBody className="gap-2.5">
        {journeySeed.slice(0, 3).map((step, i) => {
          const t = tone[step.tone];
          return (
            <div key={step.title} className="relative">
              {i < 2 && (
                <div className="absolute left-[12px] top-8 h-3.5 w-px bg-slate-200" />
              )}
              <div className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 ${t.card}`}>
                <div className={`h-3 w-3 flex-shrink-0 rounded-full ${t.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className={`text-[clamp(13.5px,0.78vw,15.5px)] font-bold ${t.title}`}>{step.title}</div>
                  <div className="text-[clamp(13px,0.72vw,14.5px)] text-slate-400">{step.desc}</div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-[clamp(13px,0.72vw,14.5px)] font-bold ${t.badge}`}>
                  {step.statusIcon ? <Icon name={step.statusIcon} size={11} color={step.tone === "locked" ? WIDGET_COLORS.textSubtle : WIDGET_COLORS.accent} /> : step.status}
                </span>
              </div>
            </div>
          );
        })}
      </WidgetBody>
    </div>
  );
}

// ── Widget: Stats (2:1) ───────────────────────────────────────────────────────
function StatsWidget({ user, doneTasks, totalTasks }) {
  const stats = [
    { label: "Seviye", value: String(user?.level || 12),      icon: "goals", color: WIDGET_COLORS.accent, progress: Math.min(100, Math.round(((user?.xp    || 0) / 1000) * 100)) },
    { label: "Coin",   value: formatNumber(user?.coins || 0), icon: "coin", color: WIDGET_COLORS.accent, progress: Math.min(100, Math.round(((user?.coins || 0) / 2000) * 100)) },
    { label: "Seri",   value: `${user?.streak || 0} gün`,     icon: "streak", color: WIDGET_COLORS.accent, progress: Math.min(100, Math.round(((user?.streak|| 0) / 14)   * 100)) },
    { label: "Görev",  value: `${doneTasks}/${totalTasks}`,   icon: "tasks", color: WIDGET_COLORS.accent, progress: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0   },
  ];

  return (
    <div className="flex h-full flex-col">
      <WidgetHeader title="İstatistikler" />
      <WidgetBody className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col justify-between rounded-[16px] border border-white/70 bg-white/72 p-4 shadow-[0_10px_22px_rgba(37,99,235,0.08)] backdrop-blur-sm">
            <div className="text-[clamp(13px,0.72vw,14.5px)] font-bold uppercase tracking-[1.2px]" style={{ color: s.color }}>
              <span className="inline-flex items-center gap-1"><Icon name={s.icon} size={12} color={s.color} /> {s.label}</span>
            </div>
            <div className="text-[clamp(22px,2.1vw,28px)] font-bold tracking-tight text-[#111827]">{s.value}</div>
            <ProgressBar value={s.progress} color={s.color} />
          </div>
        ))}
      </WidgetBody>
    </div>
  );
}

// ── Widget: Streak (2:1) ──────────────────────────────────────────────────────
function StreakWidget({ user }) {
  const streak    = user?.streak ?? 12;
  const maxStreak = 30;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <WidgetHeader
        title="Çalışma Serisi"
        right={(
          <span className="inline-flex items-center gap-1 text-[clamp(14px,0.86vw,16.5px)] font-bold text-blue-600">
            <Icon name="streak" size={14} color={WIDGET_COLORS.accent} /> {streak} gün
          </span>
        )}
      />
      <WidgetBody className="justify-between">
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-2">
            {["P","S","Ç","P","C","C","P"].map((d, i) => (
              <div key={i} className="text-center text-[clamp(13px,0.72vw,14.5px)] font-bold text-slate-300">{d}</div>
            ))}
            {heatSeed.map((cell, i) => (
              <div
                key={i}
                className="aspect-square rounded-[4px]"
                style={{
                  background: cell.active
                    ? cell.intensity === 3 ? WIDGET_COLORS.accent : cell.intensity === 2 ? "#93C5FD" : "#DBEAFE"
                    : "#F1F5F9",
                }}
              />
            ))}
          </div>
        </div>
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[clamp(13px,0.72vw,14.5px)] text-slate-400">Rekora {maxStreak - streak} gün</span>
            <span className="text-[clamp(13px,0.72vw,14.5px)] font-bold text-blue-600">{streak}/{maxStreak}</span>
          </div>
          <ProgressBar value={Math.round((streak / maxStreak) * 100)} color={WIDGET_COLORS.accent} />
        </div>
      </WidgetBody>
    </div>
  );
}

// ── Widget: Quiz (2:1) ────────────────────────────────────────────────────────
function QuizWidget() {
  const visibleQuizzes = upcomingQuizzes.slice(0, 3);
  return (
    <div className="flex h-full flex-col">
      <WidgetHeader
        title="Sınav Takvimi"
        right={<span className="text-[clamp(13px,0.72vw,14.5px)] font-bold text-blue-600">{upcomingQuizzes.length} yaklaşan</span>}
      />
      <WidgetBody className="gap-2">
        {visibleQuizzes.map((q) => (
          <div key={q.subject} className="flex items-center gap-2.5 rounded-[14px] border border-white/70 bg-white/72 px-3 py-2.5 backdrop-blur-sm">
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[clamp(13px,0.72vw,14.5px)] font-bold text-white"
              style={{ background: q.color }}
            >
              {q.date.split(" ")[0]}
            </div>
            <span className="min-w-0 flex-1 truncate text-[clamp(13.5px,0.78vw,15.5px)] font-semibold text-slate-700">{q.subject}</span>
            <span className="text-[clamp(13px,0.72vw,14.5px)] text-slate-400">{q.date}</span>
            <span className="rounded-full px-2 py-1 text-[clamp(13px,0.72vw,14.5px)] font-bold" style={{ background: `${q.color}18`, color: q.color }}>
              {q.type}
            </span>
          </div>
        ))}
      </WidgetBody>
    </div>
  );
}

// ── Widget: Notes (1:1) ───────────────────────────────────────────────────────
function NotesWidget() {
  const [notes, setNotes] = useState(loadQuickNotes);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [draftNote, setDraftNote] = useState("");

  const closeEditor = useCallback(() => {
    setIsEditorOpen(false);
    setEditingNoteId(null);
    setDraftNote("");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch {
      /* storage blocked */
    }
  }, [notes]);

  useEffect(() => {
    if (!isEditorOpen || typeof window === "undefined") return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") closeEditor();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeEditor, isEditorOpen]);

  const openNewNote = () => {
    setEditingNoteId(null);
    setDraftNote("");
    setIsEditorOpen(true);
  };

  const openExistingNote = (note) => {
    setEditingNoteId(note.id);
    setDraftNote(note.text);
    setIsEditorOpen(true);
  };

  const removeNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (editingNoteId === id) closeEditor();
  };

  const saveNote = () => {
    const text = draftNote.trim();
    if (!text) return;

    if (editingNoteId !== null) {
      setNotes((prev) => prev.map((note) => (note.id === editingNoteId ? { ...note, text } : note)));
    } else {
      setNotes((prev) => [{ id: Date.now(), text, color: WIDGET_COLORS.surface }, ...prev]);
    }

    closeEditor();
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <WidgetHeader title="Notlar" />
        <WidgetBody>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openNewNote}
              className="flex-1 rounded-xl border border-white/70 bg-white/72 px-3 py-2.5 text-left text-[clamp(13.5px,0.78vw,15.5px)] text-slate-400 shadow-[0_8px_18px_rgba(37,99,235,0.06)] backdrop-blur-sm transition-colors hover:border-blue-200 hover:bg-white/88"
            >
              Not ekle...
            </button>
            <button
              type="button"
              onClick={openNewNote}
              className="rounded-xl border border-blue-200/90 bg-white px-3.5 py-2.5 text-[clamp(13.5px,0.78vw,15.5px)] font-bold text-blue-600 shadow-[0_10px_22px_rgba(37,99,235,0.08)] transition-colors hover:border-blue-300 hover:bg-blue-50/40"
            >
              <Icon name="plus-math" size={12} color="#7C3AED" />
            </button>
          </div>
          <div className="mt-3 flex flex-1 flex-col gap-2 overflow-hidden">
            {notes.slice(0, 3).map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-2.5 rounded-[14px] border border-white/70 bg-white/72 px-3 py-2.5 backdrop-blur-sm"
                style={{ background: n.color }}
              >
                <button
                  type="button"
                  onClick={() => openExistingNote(n)}
                  className="min-w-0 flex-1 truncate text-left text-[clamp(13.5px,0.78vw,15.5px)] text-slate-700 hover:text-blue-600"
                >
                  {n.text}
                </button>
                <button
                  type="button"
                  onClick={() => removeNote(n.id)}
                  aria-label="Notu sil"
                  className="text-[clamp(13.5px,0.78vw,15.5px)] text-slate-300 hover:text-blue-500"
                >
                  <Icon name="close" size={12} color={WIDGET_COLORS.textSubtle} />
                </button>
              </div>
            ))}
          </div>
        </WidgetBody>
      </div>

      {isEditorOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-md">
              <button
                type="button"
                onClick={closeEditor}
                aria-label="Not panelini kapat"
                className="absolute inset-0"
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label={editingNoteId !== null ? "Notu düzenle" : "Yeni not ekle"}
                className="relative z-10 flex h-[min(88vw,88vh,430px)] w-[min(88vw,88vh,430px)] flex-col rounded-[30px] border border-white/75 bg-white/88 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.24)] backdrop-blur-2xl sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Eyebrow accent={WIDGET_COLORS.accent}>
                      {editingNoteId !== null ? "Notu Düzenle" : "Yeni Not"}
                    </Eyebrow>
                  </div>
                  <button
                    type="button"
                    onClick={closeEditor}
                    aria-label="Kapat"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white/84 shadow-[0_8px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm"
                  >
                    <Icon name="close" size={14} color="#64748b" />
                  </button>
                </div>

                <textarea
                  autoFocus
                  value={draftNote}
                  onChange={(event) => setDraftNote(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") saveNote();
                  }}
                  placeholder="Notunu yaz..."
                  className="mt-4 min-h-0 flex-1 resize-none rounded-[20px] border border-blue-100/80 bg-white/76 p-4 text-[15px] leading-6 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none backdrop-blur-sm placeholder:text-slate-300 focus:border-blue-300 focus:bg-white"
                />

                <div className="mt-4 flex items-center justify-between gap-3">
                  {editingNoteId !== null ? (
                    <button
                      type="button"
                      onClick={() => removeNote(editingNoteId)}
                      className="rounded-full border border-slate-200 bg-white/82 px-4 py-2 text-[12px] font-bold uppercase tracking-[1.1px] text-slate-500 transition-colors hover:border-red-200 hover:text-red-500"
                    >
                      Sil
                    </button>
                  ) : <span />}
                  <button
                    type="button"
                    onClick={saveNote}
                    disabled={!draftNote.trim()}
                    className="rounded-full border border-blue-200/80 bg-blue-50/80 px-5 py-2 text-[12px] font-bold uppercase tracking-[1.1px] text-blue-600 shadow-[0_12px_24px_rgba(37,99,235,0.12)] transition-colors hover:bg-blue-100/80 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

// ── Widget: Focus (1:1) ───────────────────────────────────────────────────────
function FocusWidget() {
  const [seconds,  setSeconds ] = useState(POMODORO_WORK_SECONDS);
  const [running,  setRunning ] = useState(false);
  const [phase,    setPhase   ] = useState("work");
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          if (phase === "work") { setSessions((c) => c + 1); setPhase("break"); return POMODORO_BREAK_SECONDS; }
          else { setPhase("work"); return POMODORO_WORK_SECONDS; }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, phase]);

  const total      = phase === "work" ? POMODORO_WORK_SECONDS : POMODORO_BREAK_SECONDS;
  const pct        = Math.round(((total - seconds) / total) * 100);
  const mm         = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss         = String(seconds % 60).padStart(2, "0");
  const phaseColor = WIDGET_COLORS.accent;
  const reset      = () => { setRunning(false); setPhase("work"); setSeconds(POMODORO_WORK_SECONDS); };

  return (
    <div className="flex h-full flex-col">
      <WidgetHeader
        title="Odak"
        right={(
          <span
            className="rounded-full px-2.5 py-1 text-[clamp(13px,0.72vw,14.5px)] font-bold"
            style={{ background: WIDGET_COLORS.accentSoft, color: phaseColor }}
          >
            {phase === "work" ? "Çalışma" : "Mola"} · {sessions} oturum
          </span>
        )}
      />
      <WidgetBody className="justify-between">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
          <div
            className="relative flex h-30 w-30 items-center justify-center rounded-full p-[8px]"
            style={{ background: `conic-gradient(${phaseColor} 0deg ${pct * 3.6}deg, #E2E8F0 ${pct * 3.6}deg 360deg)` }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full border border-white/70 bg-white/78 backdrop-blur-sm">
              <span className="text-[clamp(22px,1.9vw,28px)] font-bold tabular-nums text-[#111827]">{mm}:{ss}</span>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="rounded-xl px-[18px] py-2.5 text-[clamp(13.5px,0.78vw,15.5px)] font-bold text-white"
              style={{ background: phaseColor }}
            >
              {running ? "Duraklat" : "Başlat"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-white/70 bg-white/74 px-3.5 py-2.5 text-[clamp(13.5px,0.78vw,15.5px)] font-bold text-slate-500 shadow-[0_8px_18px_rgba(15,23,42,0.06)] backdrop-blur-sm"
            >
              <Icon name="rotateright" size={13} color="#64748b" />
            </button>
          </div>
        </div>
      </WidgetBody>
    </div>
  );
}

// ── Widget: XP Log (2:1) ──────────────────────────────────────────────────────
function XpLogWidget() {
  const maxXp   = Math.max(...xpLogSeed.map((d) => d.xp));
  const totalXp = xpLogSeed.reduce((a, b) => a + b.xp, 0);

  return (
    <div className="flex h-full flex-col">
      <WidgetHeader
        title="XP Geçmişi"
        right={<span className="text-[clamp(13px,0.72vw,14.5px)] font-bold text-blue-600">+{formatNumber(totalXp)} bu hafta</span>}
      />
      <WidgetBody className="items-end">
        {xpLogSeed.map((d) => {
          const h       = Math.round((d.xp / maxXp) * 100);
          const isToday = d.day === "Paz";
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[clamp(13px,0.72vw,14.5px)] font-bold" style={{ color: isToday ? WIDGET_COLORS.accent : "#CBD5E1" }}>{d.xp}</span>
              <div className="dashboard-widget-xp-bar w-full overflow-hidden rounded-t-md" style={{ height: "56px" }}>
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{ height: `${h}%`, marginTop: `${100 - h}%`, background: isToday ? WIDGET_COLORS.accent : "#DBEAFE" }}
                />
              </div>
              <span className="text-[clamp(13px,0.72vw,14.5px)] font-semibold text-slate-400">{d.day}</span>
            </div>
          );
        })}
      </WidgetBody>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ onOpenCustomizer }) {
  return (
    <div
      className="flex items-center justify-center rounded-[26px] border border-dashed border-white/75 bg-white/62 px-10 py-10 text-center shadow-[0_18px_44px_rgba(37,99,235,0.09)] backdrop-blur-2xl"
      style={{ minHeight: "clamp(260px,30vh,340px)" }}
    >
      <div className="max-w-sm">
        <div className="text-[clamp(18px,1.35vw,22px)] font-bold text-[#111827]">Dashboard şu an boş.</div>
        <button
          type="button"
          onClick={onOpenCustomizer}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/78 px-4 py-2 text-[clamp(13.5px,0.78vw,15.5px)] font-bold uppercase tracking-[1.4px] text-blue-600 shadow-[0_12px_26px_rgba(37,99,235,0.12)] backdrop-blur-sm hover:bg-blue-100/90"
        >
          <Icon name="plus" size={13} color="#2563EB" /> Widget Ekle
        </button>
      </div>
    </div>
  );
}

// ── Widget Panel ──────────────────────────────────────────────────────────────
function WidgetPanel({
  widgets,
  activeWidgetIds,
  usedUnits,
  maxUnits,
  quotaNotice,
  onAdd,
  onRemove,
  onClose,
}) {
  const activeTitles = widgets.filter((w) => activeWidgetIds.includes(w.id)).map((w) => w.title);
  const usagePercent = maxUnits > 0 ? Math.min(100, Math.round((usedUnits / maxUnits) * 100)) : 0;
  const groupedWidgets = [
    {
      key: "wide",
      title: "2x1 Widget'lar",
      description: "Her biri 2 kota kullanır.",
      items: widgets.filter((widget) => widget.size === "wide"),
    },
    {
      key: "square",
      title: "1x1 Widget'lar",
      description: "Her biri 1 kota kullanır.",
      items: widgets.filter((widget) => widget.size === "square"),
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Kapat"
        className="fixed inset-0 z-[60] bg-slate-950/26 backdrop-blur-[4px]"
      />
      <div className="widget-panel fixed inset-x-3 bottom-3 top-6 z-[70] mx-auto h-[calc(100vh-2.25rem)] overflow-hidden rounded-[30px] border border-white/75 bg-white/74 shadow-[0_28px_84px_rgba(15,23,42,.22)] backdrop-blur-2xl md:inset-x-auto md:bottom-auto md:right-8 md:top-16 md:h-[82vh] md:w-[min(92vw,1100px)]">
        <div className="flex h-full min-h-0 flex-col">
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/70 px-5 py-4 sm:px-6">
            <div>
              <Eyebrow accent={WIDGET_COLORS.accent}>Vitrin Düzenleyici</Eyebrow>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
                Widgetları ekleyip çıkararak vitrinini kişiselleştir.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white/84 text-slate-500 shadow-[0_8px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-colors hover:text-blue-600"
            >
              <Icon name="close" size={14} color="#64748b" />
            </button>
          </header>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-5 py-5 sm:px-6">
            <div className="rounded-[22px] border border-white/70 bg-white/70 p-4 shadow-[0_12px_28px_rgba(37,99,235,0.06)] backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-[1.3px] text-slate-400">Kota Kullanımı</span>
                <span className="text-[13px] font-bold text-blue-600">{usedUnits}/{maxUnits}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {activeTitles.length
                  ? activeTitles.map((title) => (
                      <span key={title} className="rounded-full border border-blue-200/80 bg-blue-50/80 px-2.5 py-1 text-[12px] font-semibold text-blue-700">
                        {title}
                      </span>
                    ))
                  : <span className="text-[13px] text-slate-400">Henüz aktif widget yok.</span>}
              </div>
              {quotaNotice ? (
                <p className="mt-3 text-[13px] font-semibold text-amber-600">{quotaNotice}</p>
              ) : null}
            </div>

            <div className="mt-5 space-y-4">
              {groupedWidgets.map((group) => (
                <section key={group.key} className="rounded-[22px] border border-white/70 bg-white/68 p-4 backdrop-blur-md">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[14px] font-bold tracking-[0.3px] text-slate-800">{group.title}</h3>
                    <span className="text-[12px] font-semibold text-slate-400">{group.description}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {group.items.map((widget) => {
                      const isActive = activeWidgetIds.includes(widget.id);
                      const widgetUnits = getWidgetUnits(widget.size);
                      const cannotAdd = !isActive && usedUnits + widgetUnits > maxUnits;

                      return (
                        <div
                          key={widget.id}
                          className={`rounded-[20px] border px-4 py-3.5 transition-all ${
                            isActive
                              ? "border-blue-200/90 bg-blue-50/80 shadow-[0_12px_28px_rgba(37,99,235,0.12)]"
                              : "border-white/70 bg-white/80 hover:border-blue-100"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                              <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                style={{ background: `${widget.accent}12`, color: widget.accent }}
                              >
                                <Icon name={widget.icon} size={16} color={widget.accent} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[14px] font-bold text-[#111827]">{widget.title}</span>
                                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                                    {widget.size === "wide" ? "2x1" : "1x1"}
                                  </span>
                                  {isActive && (
                                    <span className="rounded-full border border-blue-200/80 bg-white px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                                      Aktif
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{widget.description}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={cannotAdd}
                              onClick={() => (isActive ? onRemove(widget.id) : onAdd(widget.id))}
                              className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-bold uppercase tracking-[1.1px] transition-all ${
                                isActive
                                  ? "border border-blue-200/80 bg-blue-50/75 text-blue-600 hover:bg-blue-100/90"
                                  : cannotAdd
                                    ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                                    : "border border-white/65 bg-gradient-to-br from-blue-600/95 via-blue-500/95 to-cyan-500/95 text-white shadow-[0_12px_24px_rgba(37,99,235,0.2)] hover:brightness-105"
                              }`}
                            >
                              {isActive ? "Çıkar" : cannotAdd ? "Dolu" : "Ekle"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Dashboard Root ────────────────────────────────────────────────────────────
export default function DashboardWidgets({ tasks, onToggleTask, doneTasks, user, guideState }) {
  const availableWidgetIds = WIDGET_META.map((widget) => widget.id);
  const [rankingTab, setRankingTab] = useState("haftalik");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [quotaNotice, setQuotaNotice] = useState("");
  const isShowcaseGuided = guideState?.target === "showcase";
  const [activeWidgetIds, setActiveWidgetIds] = useState(() => {
    const loaded = loadActiveWidgets().filter((id) => availableWidgetIds.includes(id));
    const fallback = clampWidgetIdsByCapacity([...DEFAULT_ACTIVE_WIDGETS], WIDGET_META_BY_ID);
    if (hasStoredActiveWidgets()) {
      if (!loaded.length) return [];
      const isAutoExpandedAll =
        loaded.length === availableWidgetIds.length &&
        availableWidgetIds.every((id) => loaded.includes(id));
      const initialIds = isAutoExpandedAll ? [...DEFAULT_ACTIVE_WIDGETS] : loaded;
      return clampWidgetIdsByCapacity(initialIds, WIDGET_META_BY_ID);
    }
    return fallback;
  });

  const rankingData = useMemo(() => ({
    haftalik: [
      { rank: "#1", avatar: "avatar_fox", name: "Zeynep Ç.", points: "3 420 pts", bg: WIDGET_COLORS.accentSoft },
      { rank: "#2", avatar: "avatar_dog", name: "Rızgar O.", points: "3 180 pts", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#3", avatar: "avatar_chameleon", name: "Rojhat T.", points: "2 990 pts", bg: WIDGET_COLORS.accentSoft },
      { rank: "#4", avatar: "avatar_teddy_bear", name: "Burak Y.", points: "2 900 pts", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#5", avatar: "avatar_penguin", name: "Selin K.", points: "2 860 pts", bg: WIDGET_COLORS.accentSoft },
      { rank: "#6", avatar: "avatar_mouse", name: "Mert D.", points: "2 810 pts", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#7", avatar: "avatar_duck", name: "Ayşe N.", points: "2 780 pts", bg: WIDGET_COLORS.accentSoft },
      { rank: "#8", avatar: user?.avatar || "avatar_teddy_bear", name: `Sen (${user?.name || "İlkhan"})`, points: "2 750 pts", bg: "linear-gradient(135deg,#2563EB,#60A5FA)", me: true },
      { rank: "#9", avatar: "avatar_hamster", name: "Ece A.", points: "2 710 pts", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#10", avatar: "avatar_doge", name: "Kerem U.", points: "2 660 pts", bg: WIDGET_COLORS.accentSoft },
      { rank: "#11", avatar: "avatar_maneki", name: "Deniz P.", points: "2 640 pts", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#12", avatar: "avatar_dragon", name: "Okan R.", points: "2 610 pts", bg: WIDGET_COLORS.accentSoft },
    ],
    sinif: [
      { rank: "#1", avatar: "avatar_dragon", name: "Rojhat T.", points: "97 puan", bg: WIDGET_COLORS.accentSoft },
      { rank: "#2", avatar: "avatar_fox", name: "Zeynep Ç.", points: "95 puan", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#3", avatar: "avatar_dog", name: "Rızgar O.", points: "94 puan", bg: WIDGET_COLORS.accentSoft },
      { rank: "#4", avatar: "avatar_teddy_bear", name: "Burak Y.", points: "92 puan", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#5", avatar: "avatar_penguin", name: "Selin K.", points: "91 puan", bg: WIDGET_COLORS.accentSoft },
      { rank: "#6", avatar: "avatar_mouse", name: "Mert D.", points: "90 puan", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#7", avatar: user?.avatar || "avatar_teddy_bear", name: `Sen (${user?.name || "İlkhan"})`, points: "89 puan", bg: "linear-gradient(135deg,#2563EB,#60A5FA)", me: true },
      { rank: "#8", avatar: "avatar_duck", name: "Ayşe N.", points: "88 puan", bg: WIDGET_COLORS.accentSoft },
      { rank: "#9", avatar: "avatar_hamster", name: "Ece A.", points: "87 puan", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#10", avatar: "avatar_doge", name: "Kerem U.", points: "86 puan", bg: WIDGET_COLORS.accentSoft },
    ],
    arkadaslar: [
      { rank: "#1", avatar: "avatar_fox", name: "Zeynep Ç.", points: "8 920 XP", bg: WIDGET_COLORS.accentSoft },
      { rank: "#2", avatar: "avatar_dragon", name: "Rojhat T.", points: "8 710 XP", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#3", avatar: "avatar_teddy_bear", name: "Burak Y.", points: "8 540 XP", bg: WIDGET_COLORS.accentSoft },
      { rank: "#4", avatar: "avatar_penguin", name: "Selin K.", points: "8 510 XP", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#5", avatar: "avatar_mouse", name: "Mert D.", points: "8 480 XP", bg: WIDGET_COLORS.accentSoft },
      { rank: "#6", avatar: user?.avatar || "avatar_teddy_bear", name: `Sen (${user?.name || "İlkhan"})`, points: "8 450 XP", bg: "linear-gradient(135deg,#2563EB,#60A5FA)", me: true },
      { rank: "#7", avatar: "avatar_dog", name: "Rızgar O.", points: "8 120 XP", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#8", avatar: "avatar_duck", name: "Ayşe N.", points: "8 030 XP", bg: WIDGET_COLORS.accentSoft },
      { rank: "#9", avatar: "avatar_hamster", name: "Ece A.", points: "7 980 XP", bg: WIDGET_COLORS.surfaceAlt },
      { rank: "#10", avatar: "avatar_doge", name: "Kerem U.", points: "7 900 XP", bg: WIDGET_COLORS.accentSoft },
      { rank: "#11", avatar: "avatar_maneki", name: "Deniz P.", points: "7 860 XP", bg: WIDGET_COLORS.surfaceAlt },
    ],
  }), [user?.avatar, user?.name]);

  const stripWidgets = useMemo(
    () => [
      {
        id: "tasks",
        accent: WIDGET_COLORS.accent,
        render: () => (
          <DailyTasksWidget tasks={tasks} doneTasks={doneTasks} onToggleTask={onToggleTask} />
        ),
      },
      {
        id: "achievements",
        accent: WIDGET_COLORS.accent,
        render: () => <AchievementWidget badges={badgeSeed} />,
      },
      {
        id: "ranking",
        accent: WIDGET_COLORS.accent,
        render: () => (
          <RankingWidget
            key={`ranking-${rankingTab}`}
            rankingTab={rankingTab}
            onRankingTabChange={setRankingTab}
            rankingData={rankingData}
          />
        ),
      },
      {
        id: "goals",
        accent: WIDGET_COLORS.accent,
        render: () => <GoalsWidget doneTasks={doneTasks} totalTasks={tasks.length} user={user} />,
      },
      {
        id: "journey",
        accent: WIDGET_COLORS.accent,
        render: () => <JourneyWidget />,
      },
      {
        id: "stats",
        accent: WIDGET_COLORS.accent,
        render: () => <StatsWidget user={user} doneTasks={doneTasks} totalTasks={tasks.length} />,
      },
      {
        id: "streak",
        accent: WIDGET_COLORS.accent,
        render: () => <StreakWidget user={user} />,
      },
      {
        id: "quiz",
        accent: WIDGET_COLORS.accent,
        render: () => <QuizWidget />,
      },
      {
        id: "notes",
        accent: WIDGET_COLORS.accent,
        render: () => <NotesWidget />,
      },
      {
        id: "focus",
        accent: WIDGET_COLORS.accent,
        render: () => <FocusWidget />,
      },
      {
        id: "xplog",
        accent: WIDGET_COLORS.accent,
        render: () => <XpLogWidget />,
      },
    ],
    [doneTasks, onToggleTask, rankingData, rankingTab, tasks, user]
  );

  const visibleStripWidgets = useMemo(() => {
    const stripWidgetMap = new Map(stripWidgets.map((widget) => [widget.id, widget]));
    return activeWidgetIds
      .map((id) => stripWidgetMap.get(id))
      .filter(Boolean);
  }, [activeWidgetIds, stripWidgets]);
  const usedWidgetUnits = useMemo(
    () => getUsedWidgetUnits(activeWidgetIds, WIDGET_META_BY_ID),
    [activeWidgetIds]
  );

  const panelWidgets = WIDGET_META;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activeWidgetIds));
    } catch {
      /* storage blocked */
    }
  }, [activeWidgetIds]);

  useEffect(() => {
    if (!isShowcaseGuided) return;
    const closeTimer = window.setTimeout(() => setIsCustomizing(false), 0);
    return () => window.clearTimeout(closeTimer);
  }, [guideState?.pulse, isShowcaseGuided]);

  const handleAddWidget = (id) => {
    if (!availableWidgetIds.includes(id)) return;
    if (activeWidgetIds.includes(id)) return;
    const nextIds = clampWidgetIdsByCapacity([...activeWidgetIds, id], WIDGET_META_BY_ID);
    if (nextIds.length === activeWidgetIds.length) {
      setQuotaNotice(`Kota dolu (${SHOWCASE_MAX_UNITS}/${SHOWCASE_MAX_UNITS}). Yeni widget eklemek için önce birini çıkar.`);
      return;
    }
    setQuotaNotice("");
    setActiveWidgetIds(nextIds);
  };

  const handleRemoveWidget = (id) => {
    setQuotaNotice("");
    setActiveWidgetIds((prev) => prev.filter((widgetId) => widgetId !== id));
  };

  return (
    <section className="relative overflow-visible pb-4 transition-all">
      <style>{`
        @media (min-width: 1280px) and (max-width: 1535.98px) {
          .dashboard-widget-showcase-grid [class*="text-[clamp(22px"] { font-size: 21px !important; }
          .dashboard-widget-showcase-grid [class*="text-[clamp(18px"] { font-size: 15.75px !important; }
          .dashboard-widget-showcase-grid [class*="text-[clamp(14px"] { font-size: 11.5px !important; }
          .dashboard-widget-showcase-grid [class*="text-[clamp(13.5px"] { font-size: 11.25px !important; }
          .dashboard-widget-showcase-grid [class*="text-[clamp(13px"] { font-size: 10.75px !important; }
          .dashboard-widget-showcase-grid [class*="text-[14px]"] { font-size: 11.5px !important; }
          .dashboard-widget-showcase-grid [class*="text-[13px]"] { font-size: 10.75px !important; }
          .dashboard-widget-showcase-grid [class*="text-[12px]"] { font-size: 10.25px !important; }
          .dashboard-widget-showcase-grid [class*="text-[11px]"] { font-size: 9.75px !important; }
          .dashboard-widget-showcase-grid {
            gap: 0.625rem !important;
            margin-left: -0.35rem;
            margin-right: -0.35rem;
          }
          .dashboard-widget-showcase-grid .dashboard-widget-shell {
            padding: 0.78rem !important;
            border-radius: 24px !important;
          }
          .dashboard-widget-showcase-grid .dashboard-widget-shell > .pointer-events-none {
            border-radius: 24px !important;
          }
          .dashboard-widget-showcase-grid .dashboard-widget-header {
            min-height: 27px !important;
            gap: 0.5rem !important;
          }
          .dashboard-widget-showcase-grid .dashboard-widget-body { margin-top: 0.55rem !important; }
          .dashboard-widget-showcase-grid [class~="gap-4"] { gap: 0.78rem !important; }
          .dashboard-widget-showcase-grid [class~="gap-3"] { gap: 0.65rem !important; }
          .dashboard-widget-showcase-grid [class~="gap-2.5"] { gap: 0.55rem !important; }
          .dashboard-widget-showcase-grid [class~="gap-2"] { gap: 0.45rem !important; }
          .dashboard-widget-showcase-grid [class~="gap-1.5"] { gap: 0.32rem !important; }
          .dashboard-widget-showcase-grid [class~="p-4"] { padding: 0.68rem !important; }
          .dashboard-widget-showcase-grid [class~="px-3.5"] { padding-left: 0.65rem !important; padding-right: 0.65rem !important; }
          .dashboard-widget-showcase-grid [class~="px-3"] { padding-left: 0.6rem !important; padding-right: 0.6rem !important; }
          .dashboard-widget-showcase-grid [class~="px-2.5"] { padding-left: 0.52rem !important; padding-right: 0.52rem !important; }
          .dashboard-widget-showcase-grid [class~="px-2"] { padding-left: 0.42rem !important; padding-right: 0.42rem !important; }
          .dashboard-widget-showcase-grid [class~="py-2.5"] { padding-top: 0.55rem !important; padding-bottom: 0.55rem !important; }
          .dashboard-widget-showcase-grid [class~="py-2"] { padding-top: 0.45rem !important; padding-bottom: 0.45rem !important; }
          .dashboard-widget-showcase-grid [class~="py-1.5"] { padding-top: 0.32rem !important; padding-bottom: 0.32rem !important; }
          .dashboard-widget-showcase-grid [class~="py-1"] { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
          .dashboard-widget-showcase-grid [class~="mt-3"] { margin-top: 0.55rem !important; }
          .dashboard-widget-showcase-grid [class~="mt-2.5"] { margin-top: 0.45rem !important; }
          .dashboard-widget-showcase-grid [class~="mt-1"] { margin-top: 0.25rem !important; }
          .dashboard-widget-showcase-grid [class~="mb-1"] { margin-bottom: 0.25rem !important; }
          .dashboard-widget-showcase-grid [class~="space-y-1.5"] > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0.32rem !important;
          }
          .dashboard-widget-showcase-grid [class~="h-28"] { height: 5.45rem !important; }
          .dashboard-widget-showcase-grid [class~="w-28"] { width: 5.45rem !important; }
          .dashboard-widget-showcase-grid [class~="h-7"] { height: 1.5rem !important; }
          .dashboard-widget-showcase-grid [class~="w-7"] { width: 1.5rem !important; }
          .dashboard-widget-showcase-grid [class~="h-5"] { height: 1.1rem !important; }
          .dashboard-widget-showcase-grid [class~="w-5"] { width: 1.1rem !important; }
          .dashboard-widget-showcase-grid [class~="h-3"] { height: 0.65rem !important; }
          .dashboard-widget-showcase-grid [class~="w-3"] { width: 0.65rem !important; }
          .dashboard-widget-showcase-grid [class~="w-6"] { width: 1.3rem !important; }
          .dashboard-widget-showcase-grid [class~="h-[24px]"],
          .dashboard-widget-showcase-grid [class~="w-[24px]"] { width: 1.35rem !important; height: 1.35rem !important; }
          .dashboard-widget-showcase-grid [class~="h-[22px]"],
          .dashboard-widget-showcase-grid [class~="w-[22px]"] { width: 1.25rem !important; height: 1.25rem !important; }
          .dashboard-widget-showcase-grid .dashboard-widget-goal-ring {
            width: 70px !important;
            height: 70px !important;
            padding: 5px !important;
          }
          .dashboard-widget-showcase-grid .dashboard-widget-xp-bar { height: 48px !important; }
          .dashboard-widget-showcase-grid img {
            width: 11px !important;
            height: 11px !important;
          }
        }

        @media (min-width: 1280px) {
          .dashboard-widget-showcase-grid {
            --widget-unit: clamp(210px, 15.5vw, 285px);
            grid-template-columns: repeat(5, var(--widget-unit));
            grid-auto-rows: var(--widget-unit);
            justify-content: space-between;
            align-items: stretch;
            margin-left: 0;
            margin-right: 0;
          }

          .dashboard-widget-showcase-grid > .dashboard-widget-slot {
            min-height: 0;
            height: 100%;
            min-width: 0;
            aspect-ratio: auto;
          }

          .dashboard-widget-showcase-grid > .dashboard-widget-slot-square {
            grid-column: span 1 / span 1;
          }

          .dashboard-widget-showcase-grid > .dashboard-widget-slot-wide {
            grid-column: span 2 / span 2;
          }
        }
      `}</style>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-[27px] font-bold tracking-[-0.04em] text-slate-950">Kişisel Vitrin</h2>
        <div className="relative">
          {isShowcaseGuided && (
            <GuideCartoonPointer
              routeKey={`showcase-pointer-${guideState?.pulse ?? "active"}`}
              target="showcase"
              side="left"
              size={82}
              className="right-[calc(100%+8px)] top-1/2 -translate-y-1/2"
            />
          )}
          <button
            type="button"
            onClick={() => setIsCustomizing(true)}
            className={`action-btn inline-flex items-center gap-1.5 ${isShowcaseGuided ? "enigma-guide-button-toon" : ""}`}
          >
            Vitrin Düzenle
            <Icon name="slider" size={20} color="#64748B" />
          </button>
        </div>
      </div>

      {visibleStripWidgets.length > 0 ? (
        <div className="overflow-visible pb-4 pt-1">
          <div
            className="dashboard-widget-showcase-grid grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2"
          >
            {visibleStripWidgets.map((widget) => (
              <div
                key={widget.id}
                className={`dashboard-widget-slot h-full min-h-[228px] md:min-h-[248px] xl:min-h-0 ${
                  WIDGET_META_BY_ID.get(widget.id)?.size === "wide"
                    ? "dashboard-widget-slot-wide col-span-1 sm:col-span-2"
                    : "dashboard-widget-slot-square col-span-1"
                }`}
              >
                <WidgetShell widget={widget} isCustomizing={false}>
                  {widget.render()}
                </WidgetShell>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState onOpenCustomizer={() => setIsCustomizing(true)} />
      )}

      {isCustomizing && (
        <WidgetPanel
          widgets={panelWidgets}
          activeWidgetIds={activeWidgetIds}
          usedUnits={usedWidgetUnits}
          maxUnits={SHOWCASE_MAX_UNITS}
          quotaNotice={quotaNotice}
          onAdd={handleAddWidget}
          onRemove={handleRemoveWidget}
          onClose={() => setIsCustomizing(false)}
        />
      )}
    </section>
  );
}
