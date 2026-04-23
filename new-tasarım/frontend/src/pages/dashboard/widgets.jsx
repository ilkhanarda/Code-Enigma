import { useEffect, useMemo, useState } from "react";
import Icon from "../../../../../frontend/src/components/ui/icons8-icon.jsx";

const STORAGE_KEY = "code-enigma:dashboard-widgets";
const DEFAULT_ACTIVE_WIDGETS = ["goals", "ranking", "xplog", "streak"];

// square = 1:1  |  wide = 2:1
const WIDGET_META = [
  { id: "tasks",        title: "Günlük Görevler",   description: "Bugünkü görev akışı ve XP.",          size: "square", accent: "#2563EB", icon: "tasks" },
  { id: "achievements", title: "Başarım Vitrini",   description: "Rozetler ve kilitli başarımlar.",      size: "wide",   accent: "#D97706", icon: "achievements" },
  { id: "ranking",      title: "Lig & Sıralama",    description: "Haftalık lig ve sıralama.",            size: "wide",   accent: "#2563EB", icon: "ranking" },
  { id: "journey",      title: "Öğrenme Yolculuğu", description: "Aktif modül ve sıradaki durak.",       size: "square", accent: "#059669", icon: "journey" },
  { id: "stats",        title: "İstatistikler",      description: "Seviye, coin, seri, görev.",           size: "wide",   accent: "#7C3AED", icon: "stats" },
  { id: "goals",        title: "Günlük Hedef",       description: "Odak, seri ve seviye ilerlemesi.",     size: "square", accent: "#7C3AED", icon: "goals" },
  { id: "streak",       title: "Çalışma Serisi",     description: "Isı haritası ve seri takibi.",         size: "wide",   accent: "#F59E0B", icon: "streak" },
  { id: "quiz",         title: "Sınav Takvimi",      description: "Yaklaşan quiz ve sınavlar.",           size: "wide",   accent: "#DC2626", icon: "quiz" },
  { id: "notes",        title: "Hızlı Notlar",       description: "Kısa notları dashboard'dan düzenle.", size: "square", accent: "#0891B2", icon: "notes" },
  { id: "focus",        title: "Odak Sayacı",        description: "Pomodoro tabanlı çalışma sayacı.",    size: "square", accent: "#BE185D", icon: "focus" },
  { id: "xplog",        title: "XP Geçmişi",         description: "Son 7 günün XP kazanımları.",         size: "wide",   accent: "#059669", icon: "bullish" },
];

const WIDGET_IDS = new Set(WIDGET_META.map((w) => w.id));

const badgeSeed = [
  { icon: "graduation", title: "İlk Ders",  bg: "#EFF6FF", color: "#2563EB", locked: false },
  { icon: "streak", title: "7 Gün",     bg: "#FFFBEB", color: "#D97706", locked: false },
  { icon: "chart", title: "İlk 100",   bg: "#ECFDF5", color: "#059669", locked: false },
  { icon: "book_stack", title: "5 Kurs",    bg: "#F5F3FF", color: "#7C3AED", locked: false },
  { icon: "bolt", title: "Hızlı Öğr", bg: "#FFFBEB", color: "#D97706", locked: false },
  { icon: "trophy", title: "Şampiyon",  bg: "#FEF2F2", color: "#DC2626", locked: false },
  { icon: "lock", title: "Mükemmel",  bg: "#F8F9FB", color: "#94A3B8", locked: true  },
  { icon: "lock", title: "Elmas",     bg: "#F8F9FB", color: "#94A3B8", locked: true  },
];

const journeySeed = [
  { title: "Temel Matematik", desc: "8 modül",    statusIcon: "check", status: "Tamam", tone: "done"   },
  { title: "Cebir I",         desc: "12 modül",   statusIcon: "check", status: "Tamam", tone: "done"   },
  { title: "Cebir II",        desc: "5/14 modül", status: "36%", tone: "active" },
  { title: "Geometri",        desc: "Kilitli",    statusIcon: "lock", status: "Kilitli", tone: "locked" },
];

const upcomingQuizzes = [
  { subject: "Cebir II",       date: "23 Nis", type: "Quiz",  color: "#DC2626" },
  { subject: "Geometri Giriş", date: "28 Nis", type: "Sınav", color: "#7C3AED" },
  { subject: "Lineer Cebir",   date: "5 May",  type: "Quiz",  color: "#2563EB" },
  { subject: "Olasılık",       date: "12 May", type: "Ödev",  color: "#059669" },
];

const quickNotesSeed = [
  { id: 1, text: "Cebir II — türev formüllerini tekrar et",    color: "#EFF6FF" },
  { id: 2, text: "Geometri: pisagor uygulamaları konu 4",      color: "#ECFDF5" },
  { id: 3, text: "Hocaya sor: limit tanımı belirsizlik",       color: "#FFFBEB" },
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

function sanitizeWidgetIds(ids) {
  if (!Array.isArray(ids)) return DEFAULT_ACTIVE_WIDGETS;
  return Array.from(new Set(ids)).filter((id) => WIDGET_IDS.has(id));
}

function loadActiveWidgets() {
  if (typeof window === "undefined") return DEFAULT_ACTIVE_WIDGETS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === null ? DEFAULT_ACTIVE_WIDGETS : sanitizeWidgetIds(JSON.parse(raw));
  } catch { return DEFAULT_ACTIVE_WIDGETS; }
}

function ProgressBar({ value, color, height = "6px" }) {
  return (
    <div className="overflow-hidden rounded-full bg-slate-100" style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  );
}

function Eyebrow({ accent, children }) {
  return (
    <span className="text-[clamp(11px,0.72vw,12.5px)] font-bold uppercase tracking-[1.8px]" style={{ color: accent }}>
      {children}
    </span>
  );
}

function WidgetEyebrowTitle({ accent, children }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-px w-5 rounded-full" style={{ background: accent }} />
      <span className="text-[clamp(18px,1.55vw,24px)] font-bold tracking-[-0.01em]" style={{ color: accent }}>
        {children}
      </span>
    </div>
  );
}

function WidgetShell({ widget, isCustomizing, children }) {
  return (
    <article
      className={`group relative h-full overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,.08)] transition-all duration-300 ${
        isCustomizing
          ? "ring-1 ring-slate-300 ring-offset-2 ring-offset-[#F3F6FC] hover:-translate-y-0.5"
          : "hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_36px_rgba(37,99,235,.16)]"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(circle at top right, ${widget.accent}10, transparent 44%)` }}
      />
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
  const minHeight = 250;
  const maxHeight = 350;
  const fluidHeight = "clamp(250px,24vw,350px)";

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
    { label: "Bugün",  value: `${doneTasks}/${totalTasks}`, progress: daily,  color: "#2563EB" },
    { label: "Seri",   value: `${user?.streak || 0}/7`,     progress: weekly, color: "#7C3AED" },
    { label: "Seviye", value: `%${level}`,                  progress: level,  color: "#059669" },
  ];

  return (
    <div className="flex h-full flex-col">
      <Eyebrow accent="#7C3AED">Günlük Hedef</Eyebrow>
      <div className="flex min-h-0 flex-1 items-center justify-center py-1">
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: "clamp(92px,11vw,152px)",
            height: "clamp(92px,11vw,152px)",
            padding: "clamp(6px,0.7vw,10px)",
            background: `conic-gradient(#2563EB 0deg ${daily * 3.6}deg, #E2E8F0 ${daily * 3.6}deg 360deg)`,
          }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
            <span className="text-[clamp(18px,1.5vw,24px)] font-bold text-[#111827]">%{daily}</span>
          </div>
        </div>
      </div>
      <div className="mt-auto space-y-2">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[clamp(11px,0.72vw,12.5px)] font-semibold text-slate-400">{r.label}</span>
              <span className="text-[clamp(11px,0.72vw,12.5px)] font-bold" style={{ color: r.color }}>{r.value}</span>
            </div>
            <ProgressBar value={r.progress} color={r.color} height="clamp(6px,0.55vw,10px)" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Widget: Daily Tasks (1:1) ─────────────────────────────────────────────────
function DailyTasksWidget({ tasks, doneTasks, onToggleTask }) {
  const pct = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Eyebrow accent="#2563EB">Görevler</Eyebrow>
        <span className="text-[clamp(11px,0.72vw,12.5px)] font-bold text-blue-600">{doneTasks}/{tasks.length}</span>
      </div>
      <div className="mt-2">
        <ProgressBar
          value={pct}
          color="linear-gradient(90deg,#2563EB,#059669)"
          height="clamp(7px,0.7vw,12px)"
        />
      </div>
      <div className="mt-1.5 flex flex-1 flex-col gap-1.5">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => onToggleTask(task.id)}
            className={`flex items-center gap-2 rounded-[14px] border px-2.5 py-2 text-left transition-all ${
              task.done
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/40"
            }`}
          >
            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
              <Icon
                name={task.done ? "check_box" : "unchecked_box"}
                size={14}
                color={task.done ? "#059669" : "#94a3b8"}
              />
            </div>
            <span className={`min-w-0 flex-1 text-[clamp(11.5px,0.78vw,13.5px)] leading-[1.3] ${task.done ? "text-emerald-700 line-through" : "text-slate-600"}`}>
              {task.title}
            </span>
            <span className={`text-[clamp(11.5px,0.78vw,13.5px)] font-bold ${task.done ? "text-emerald-500" : "text-slate-400"}`}>
              +{task.xp}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Widget: Achievements (2:1) ────────────────────────────────────────────────
function AchievementWidget({ badges }) {
  const unlocked = badges.filter((b) => !b.locked).length;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Eyebrow accent="#D97706">Başarımlar</Eyebrow>
        <span className="text-[clamp(11px,0.72vw,12.5px)] font-bold text-amber-600">{unlocked}/{badges.length}</span>
      </div>
      <div className="mt-3 grid flex-1 grid-cols-4 gap-2">
        {badges.map((b) => (
          <div
            key={b.title}
            className={`flex flex-col items-center justify-center rounded-xl border py-2 ${
              b.locked ? "border-slate-100 bg-slate-50 opacity-40" : "border-slate-100 bg-white shadow-sm"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-[clamp(12.5px,0.92vw,15.5px)]" style={{ background: b.bg }}>
              <Icon name={b.icon} size={15} color={b.color} />
            </div>
            <div className="mt-1 text-[clamp(11px,0.72vw,12.5px)] font-semibold text-slate-600">{b.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Widget: Ranking (2:1) ─────────────────────────────────────────────────────
function RankingWidget({ rankingTab, onRankingTabChange, rankingData }) {
  const current = rankingData[rankingTab];
  const me      = current.find((r) => r.me);
  const rankingRows = current.slice(0, 4);
  const meRankLabel = `${String(me?.rank || "#8").replace("#", "")}.`;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Eyebrow accent="#2563EB">Sıralama</Eyebrow>
        <div className="flex gap-1.5">
          {[["haftalik","Haftalık"],["sinif","Sınıf"],["arkadaslar","Arkadaş"]].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => onRankingTabChange(key)}
              className={`rounded-full px-2.5 py-1 text-[clamp(11px,0.72vw,12.5px)] font-semibold tracking-[0.3px] transition-all ${
                rankingTab === key ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400 hover:bg-slate-200/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
        <div className="flex min-h-0 flex-1 flex-col p-2.5 md:p-3">
          <div className="flex flex-1 flex-col gap-1.5">
            {rankingRows.map((row, index) => (
              <div
                key={`${rankingTab}-${row.rank}-${row.name}`}
                className={`flex w-full items-center gap-2 rounded-[12px] border px-2.5 py-1.5 ${
                  row.me ? "border-blue-200 bg-blue-50" : "border-slate-100 bg-white"
                }`}
              >
                <span className="flex w-6 items-center justify-center text-[clamp(11.5px,0.78vw,13.5px)] font-bold text-slate-400">
                  {index + 1}.
                </span>
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[clamp(12.5px,0.92vw,15.5px)]" style={{ background: row.bg }}>
                  <Icon name={row.avatar} size={15} />
                </div>
                <span className={`min-w-0 flex-1 truncate text-[clamp(11.5px,0.78vw,13.5px)] font-semibold ${row.me ? "text-blue-700" : "text-slate-700"}`}>
                  {row.name}
                </span>
                <span className={`text-[clamp(11.5px,0.78vw,13.5px)] font-bold ${row.me ? "text-blue-600" : "text-slate-500"}`}>
                  {row.points}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto h-px w-[94%] rounded-full bg-slate-200/80" />
        <div className="p-2.5 md:p-3">
          <div className="flex items-center justify-between rounded-[12px] border border-amber-200 bg-amber-50 px-2.5 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-[clamp(12px,0.86vw,14.5px)] font-bold text-[#111827]">{meRankLabel}</span>
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[clamp(12.5px,0.92vw,15.5px)]" style={{ background: me?.bg || "linear-gradient(135deg,#2563EB,#7C3AED)" }}>
                <Icon name={me?.avatar || "avatar_teddy_bear"} size={15} />
              </div>
              <span className="truncate text-[clamp(11.5px,0.78vw,13.5px)] font-semibold text-amber-700">Sen</span>
            </div>
            <span className="text-[clamp(11.5px,0.78vw,13.5px)] font-bold text-amber-700">{me?.points || "2 750 pts"}</span>
          </div>
        </div>
      </div>
  );
}

// ── Widget: Journey (1:1) ─────────────────────────────────────────────────────
function JourneyWidget() {
  const tone = {
    done:   { card: "border-emerald-200 bg-emerald-50",           dot: "bg-emerald-500",                  title: "text-emerald-700", badge: "bg-emerald-100 text-emerald-600" },
    active: { card: "border-blue-200 bg-blue-50",                 dot: "bg-blue-500 ring-2 ring-blue-100", title: "text-blue-700",    badge: "bg-blue-100 text-blue-600"       },
    locked: { card: "border-slate-100 bg-slate-50/80 opacity-55", dot: "bg-slate-300",                    title: "text-slate-400",   badge: "bg-slate-200 text-slate-400"     },
  };

  return (
    <div className="flex h-full flex-col">
      <Eyebrow accent="#059669">Yolculuk</Eyebrow>
      <div className="mt-3 flex flex-1 flex-col gap-2">
        {journeySeed.map((step, i) => {
          const t = tone[step.tone];
          return (
            <div key={step.title} className="relative">
              {i < journeySeed.length - 1 && (
                <div className="absolute left-[12px] top-8 h-3.5 w-px bg-slate-200" />
              )}
              <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 ${t.card}`}>
                <div className={`h-3 w-3 flex-shrink-0 rounded-full ${t.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className={`text-[clamp(11.5px,0.78vw,13.5px)] font-bold ${t.title}`}>{step.title}</div>
                  <div className="text-[clamp(11px,0.72vw,12.5px)] text-slate-400">{step.desc}</div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-[clamp(11px,0.72vw,12.5px)] font-bold ${t.badge}`}>
                  {step.statusIcon ? <Icon name={step.statusIcon} size={11} color={step.tone === "locked" ? "#94a3b8" : (step.tone === "active" ? "#2563EB" : "#059669")} /> : step.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Widget: Stats (2:1) ───────────────────────────────────────────────────────
function StatsWidget({ user, doneTasks, totalTasks }) {
  const stats = [
    { label: "Seviye", value: String(user?.level || 12),      icon: "goals", color: "#2563EB", progress: Math.min(100, Math.round(((user?.xp    || 0) / 1000) * 100)) },
    { label: "Coin",   value: formatNumber(user?.coins || 0), icon: "coin", color: "#D97706", progress: Math.min(100, Math.round(((user?.coins || 0) / 2000) * 100)) },
    { label: "Seri",   value: `${user?.streak || 0} gün`,     icon: "streak", color: "#059669", progress: Math.min(100, Math.round(((user?.streak|| 0) / 14)   * 100)) },
    { label: "Görev",  value: `${doneTasks}/${totalTasks}`,   icon: "tasks", color: "#7C3AED", progress: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0   },
  ];

  return (
    <div className="flex h-full flex-col">
      <Eyebrow accent="#7C3AED">İstatistikler</Eyebrow>
      <div className="mt-3 grid flex-1 grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col justify-between rounded-[16px] border border-slate-100 bg-white p-3 shadow-sm">
            <div className="text-[clamp(11px,0.72vw,12.5px)] font-bold uppercase tracking-[1.2px]" style={{ color: s.color }}>
              <span className="inline-flex items-center gap-1"><Icon name={s.icon} size={12} color={s.color} /> {s.label}</span>
            </div>
            <div className="text-[clamp(20px,2.1vw,26px)] font-bold tracking-tight text-[#111827]">{s.value}</div>
            <ProgressBar value={s.progress} color={s.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Widget: Streak (2:1) ──────────────────────────────────────────────────────
function StreakWidget({ user }) {
  const streak    = user?.streak || 12;
  const maxStreak = 30;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Eyebrow accent="#F59E0B">Çalışma Serisi</Eyebrow>
        <span className="inline-flex items-center gap-1 text-[clamp(12px,0.86vw,14.5px)] font-bold text-amber-600"><Icon name="streak" size={14} color="#D97706" /> {streak} gün</span>
      </div>
      <div className="mt-2 flex-1">
        <div className="grid grid-cols-7 gap-1.5">
          {["P","S","Ç","P","C","C","P"].map((d, i) => (
            <div key={i} className="text-center text-[clamp(11px,0.72vw,12.5px)] font-bold text-slate-300">{d}</div>
          ))}
          {heatSeed.map((cell, i) => (
            <div
              key={i}
              className="aspect-square rounded-[4px]"
              style={{
                background: cell.active
                  ? cell.intensity === 3 ? "#F59E0B" : cell.intensity === 2 ? "#FCD34D" : "#FEF3C7"
                  : "#F1F5F9",
              }}
            />
          ))}
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[clamp(11px,0.72vw,12.5px)] text-slate-400">Rekora {maxStreak - streak} gün</span>
          <span className="text-[clamp(11px,0.72vw,12.5px)] font-bold text-amber-600">{streak}/{maxStreak}</span>
        </div>
        <ProgressBar value={Math.round((streak / maxStreak) * 100)} color="#F59E0B" />
      </div>
    </div>
  );
}

// ── Widget: Quiz (2:1) ────────────────────────────────────────────────────────
function QuizWidget() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Eyebrow accent="#DC2626">Sınav Takvimi</Eyebrow>
        <span className="text-[clamp(11px,0.72vw,12.5px)] font-bold text-red-500">{upcomingQuizzes.length} yaklaşan</span>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1.5">
        {upcomingQuizzes.map((q) => (
          <div key={q.subject} className="flex items-center gap-2 rounded-[14px] border border-slate-100 bg-white px-2.5 py-2">
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[clamp(11px,0.72vw,12.5px)] font-bold text-white"
              style={{ background: q.color }}
            >
              {q.date.split(" ")[0]}
            </div>
            <span className="min-w-0 flex-1 truncate text-[clamp(11.5px,0.78vw,13.5px)] font-semibold text-slate-700">{q.subject}</span>
            <span className="text-[clamp(11px,0.72vw,12.5px)] text-slate-400">{q.date}</span>
            <span className="rounded-full px-2 py-1 text-[clamp(11px,0.72vw,12.5px)] font-bold" style={{ background: `${q.color}18`, color: q.color }}>
              {q.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Widget: Notes (1:1) ───────────────────────────────────────────────────────
function NotesWidget() {
  const [notes, setNotes] = useState(quickNotesSeed);
  const [input, setInput] = useState("");

  const addNote = () => {
    const text = input.trim();
    if (!text) return;
    const colors = ["#EFF6FF", "#ECFDF5", "#FFFBEB", "#F5F3FF"];
    setNotes((prev) => [{ id: Date.now(), text, color: colors[prev.length % colors.length] }, ...prev]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <Eyebrow accent="#0891B2">Notlar</Eyebrow>
      <div className="mt-3 flex gap-1.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="Not ekle..."
          className="flex-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[clamp(11.5px,0.78vw,13.5px)] text-slate-600 outline-none focus:border-cyan-300"
        />
        <button
          type="button"
          onClick={addNote}
          className="rounded-xl bg-cyan-600 px-3 py-2 text-[clamp(11.5px,0.78vw,13.5px)] font-bold text-white hover:bg-cyan-700"
        >
          <Icon name="plus" size={12} color="#ffffff" />
        </button>
      </div>
      <div className="mt-2.5 flex flex-1 flex-col gap-1.5 overflow-hidden">
        {notes.slice(0, 4).map((n) => (
          <div
            key={n.id}
            className="flex items-center gap-2 rounded-[14px] border border-slate-100 px-2.5 py-2"
            style={{ background: n.color }}
          >
            <span className="min-w-0 flex-1 truncate text-[clamp(11.5px,0.78vw,13.5px)] text-slate-700">{n.text}</span>
            <button
              type="button"
              onClick={() => setNotes((prev) => prev.filter((x) => x.id !== n.id))}
              className="text-[clamp(11.5px,0.78vw,13.5px)] text-slate-300 hover:text-red-400"
            >
              <Icon name="close" size={12} color="#94A3B8" />
            </button>
          </div>
        ))}
      </div>
    </div>
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
  const phaseColor = phase === "work" ? "#BE185D" : "#059669";
  const reset      = () => { setRunning(false); setPhase("work"); setSeconds(POMODORO_WORK_SECONDS); };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Eyebrow accent="#BE185D">Odak</Eyebrow>
        <span
          className="rounded-full px-2.5 py-1 text-[clamp(11px,0.72vw,12.5px)] font-bold"
          style={{ background: phase === "work" ? "#FCE7F3" : "#ECFDF5", color: phaseColor }}
        >
          {phase === "work" ? "Çalışma" : "Mola"} · {sessions} oturum
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <div
          className="relative flex h-24 w-24 items-center justify-center rounded-full p-[7px]"
          style={{ background: `conic-gradient(${phaseColor} 0deg ${pct * 3.6}deg, #E2E8F0 ${pct * 3.6}deg 360deg)` }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
            <span className="text-[clamp(18px,1.8vw,24px)] font-bold tabular-nums text-[#111827]">{mm}:{ss}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="rounded-xl px-4 py-2 text-[clamp(11.5px,0.78vw,13.5px)] font-bold text-white"
            style={{ background: phaseColor }}
          >
            {running ? "Duraklat" : "Başlat"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[clamp(11.5px,0.78vw,13.5px)] font-bold text-slate-500"
          >
            <Icon name="refresh" size={13} color="#64748b" />
          </button>
        </div>
      </div>
      <ProgressBar value={pct} color={phaseColor} />
    </div>
  );
}

// ── Widget: XP Log (2:1) ──────────────────────────────────────────────────────
function XpLogWidget() {
  const maxXp   = Math.max(...xpLogSeed.map((d) => d.xp));
  const totalXp = xpLogSeed.reduce((a, b) => a + b.xp, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Eyebrow accent="#059669">XP Geçmişi</Eyebrow>
        <span className="text-[clamp(11px,0.72vw,12.5px)] font-bold text-emerald-600">+{formatNumber(totalXp)} bu hafta</span>
      </div>
      <div className="mt-3 flex flex-1 items-end gap-1.5">
        {xpLogSeed.map((d) => {
          const h       = Math.round((d.xp / maxXp) * 100);
          const isToday = d.day === "Paz";
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[clamp(11px,0.72vw,12.5px)] font-bold" style={{ color: isToday ? "#059669" : "#CBD5E1" }}>{d.xp}</span>
              <div className="w-full overflow-hidden rounded-t-md" style={{ height: "56px" }}>
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{ height: `${h}%`, marginTop: `${100 - h}%`, background: isToday ? "#059669" : "#E2E8F0" }}
                />
              </div>
              <span className="text-[clamp(11px,0.72vw,12.5px)] font-semibold text-slate-400">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ onOpenCustomizer }) {
  return (
    <div
      className="flex items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white/80 px-8 text-center shadow-sm"
      style={{ minHeight: "clamp(240px,30vh,360px)" }}
    >
      <div className="max-w-sm">
        <div className="text-[clamp(16px,1.35vw,20px)] font-bold text-[#111827]">Dashboard şu an boş.</div>
        <button
          type="button"
          onClick={onOpenCustomizer}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[clamp(11.5px,0.78vw,13.5px)] font-bold uppercase tracking-[1.4px] text-blue-600 hover:bg-blue-100"
        >
          <Icon name="plus" size={13} color="#2563EB" /> Widget Ekle
        </button>
      </div>
    </div>
  );
}

// ── Widget Panel ──────────────────────────────────────────────────────────────
function WidgetPanel({ widgets, activeWidgetIds, onAdd, onRemove, onClose }) {
  const activeTitles = widgets.filter((w) => activeWidgetIds.includes(w.id)).map((w) => w.title);

  return (
    <>
      <button type="button" onClick={onClose} aria-label="Kapat"
        className="fixed inset-0 z-[60] bg-slate-950/12 backdrop-blur-[2px]" />
      <div className="widget-panel fixed inset-x-4 top-20 z-[70] mx-auto w-[min(100%,980px)] rounded-[30px] border border-slate-200 bg-white/95 p-5 shadow-[0_28px_60px_rgba(15,23,42,.2)] backdrop-blur-xl md:right-10 md:left-auto md:mx-0">
        <div className="flex items-center justify-between">
          <Eyebrow accent="#2563EB">Vitrin Düzenleyici</Eyebrow>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-[clamp(13px,1vw,16px)] text-slate-500 hover:text-blue-600">
            <Icon name="close" size={14} color="#64748b" />
          </button>
        </div>
        <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[clamp(11px,0.72vw,12.5px)] font-bold uppercase tracking-[1.4px] text-slate-400">Aktif</span>
            <span className="text-[clamp(11px,0.72vw,12.5px)] font-bold text-blue-600">{activeWidgetIds.length}/{widgets.length}</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {activeTitles.length
              ? activeTitles.map((t) => (
                  <span key={t} className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[clamp(11px,0.72vw,12.5px)] font-bold text-blue-600">{t}</span>
                ))
              : <span className="text-[clamp(11px,0.72vw,12.5px)] text-slate-400">Henüz aktif widget yok.</span>}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {widgets.map((widget) => {
            const isActive = activeWidgetIds.includes(widget.id);
            return (
              <div key={widget.id}
                className={`rounded-[22px] border px-4 py-3 transition-all ${isActive ? "border-blue-200 bg-blue-50/70" : "border-slate-200 bg-white"}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-[clamp(13px,1vw,16px)]"
                    style={{ background: `${widget.accent}12`, color: widget.accent }}>
                    <Icon name={widget.icon} size={16} color={widget.accent} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[clamp(12px,0.86vw,14.5px)] font-bold text-[#111827]">{widget.title}</span>
                      <span className="text-[clamp(11px,0.72vw,12.5px)] text-slate-400">{widget.size === "wide" ? "2:1" : "1:1"}</span>
                      {isActive && <span className="rounded-full bg-white px-2 py-0.5 text-[clamp(11px,0.72vw,12.5px)] font-bold text-blue-600">Aktif</span>}
                    </div>
                    <p className="mt-0.5 text-[clamp(11px,0.72vw,12.5px)] leading-relaxed text-slate-400">{widget.description}</p>
                  </div>
                  <button type="button"
                    onClick={() => (isActive ? onRemove(widget.id) : onAdd(widget.id))}
                    className={`rounded-full px-3 py-1.5 text-[clamp(11px,0.72vw,12.5px)] font-bold uppercase tracking-[1.2px] transition-all ${
                      isActive ? "bg-white text-slate-500 hover:text-rose-500" : "bg-slate-900 text-white hover:bg-slate-700"
                    }`}>
                    {isActive ? "Çıkar" : "Ekle"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── Dashboard Root ────────────────────────────────────────────────────────────
export default function DashboardWidgets({ tasks, onToggleTask, doneTasks, user }) {
  const [activeWidgetIds, setActiveWidgetIds] = useState(loadActiveWidgets);
  const [isCustomizing,   setIsCustomizing  ] = useState(false);
  const [rankingTab,      setRankingTab     ] = useState("haftalik");

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activeWidgetIds)); } catch { /* ignore persistence errors */ }
  }, [activeWidgetIds]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setIsCustomizing(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rankingData = useMemo(() => ({
    haftalik: [
      { rank: "#1", avatar: "avatar_fox", name: "Zeynep Ç.", points: "3 420 pts", bg: "#EFF6FF" },
      { rank: "#2", avatar: "avatar_dog", name: "Rızgar O.", points: "3 180 pts", bg: "#F5F3FF" },
      { rank: "#3", avatar: "avatar_chameleon", name: "Rojhat T.", points: "2 990 pts", bg: "#ECFDF5" },
      { rank: "#4", avatar: "avatar_teddy_bear", name: "Burak Y.", points: "2 900 pts", bg: "#FFFBEB" },
      { rank: "#5", avatar: "avatar_penguin", name: "Selin K.", points: "2 860 pts", bg: "#FEF2F2" },
      { rank: "#6", avatar: "avatar_mouse", name: "Mert D.", points: "2 810 pts", bg: "#EFF6FF" },
      { rank: "#7", avatar: "avatar_duck", name: "Ayşe N.", points: "2 780 pts", bg: "#F5F3FF" },
      { rank: "#8", avatar: user?.avatar || "avatar_teddy_bear", name: `Sen (${user?.name || "İlkhan"})`, points: "2 750 pts", bg: "linear-gradient(135deg,#2563EB,#7C3AED)", me: true },
      { rank: "#9", avatar: "avatar_hamster", name: "Ece A.", points: "2 710 pts", bg: "#ECFDF5" },
      { rank: "#10", avatar: "avatar_doge", name: "Kerem U.", points: "2 660 pts", bg: "#FFFBEB" },
      { rank: "#11", avatar: "avatar_maneki", name: "Deniz P.", points: "2 640 pts", bg: "#FEF2F2" },
      { rank: "#12", avatar: "avatar_dragon", name: "Okan R.", points: "2 610 pts", bg: "#EFF6FF" },
    ],
    sinif: [
      { rank: "#1", avatar: "avatar_dragon", name: "Rojhat T.", points: "97 puan", bg: "#ECFDF5" },
      { rank: "#2", avatar: "avatar_fox", name: "Zeynep Ç.", points: "95 puan", bg: "#EFF6FF" },
      { rank: "#3", avatar: "avatar_dog", name: "Rızgar O.", points: "94 puan", bg: "#F5F3FF" },
      { rank: "#4", avatar: "avatar_teddy_bear", name: "Burak Y.", points: "92 puan", bg: "#FFFBEB" },
      { rank: "#5", avatar: "avatar_penguin", name: "Selin K.", points: "91 puan", bg: "#FEF2F2" },
      { rank: "#6", avatar: "avatar_mouse", name: "Mert D.", points: "90 puan", bg: "#EFF6FF" },
      { rank: "#7", avatar: user?.avatar || "avatar_teddy_bear", name: `Sen (${user?.name || "İlkhan"})`, points: "89 puan", bg: "linear-gradient(135deg,#2563EB,#7C3AED)", me: true },
      { rank: "#8", avatar: "avatar_duck", name: "Ayşe N.", points: "88 puan", bg: "#F5F3FF" },
      { rank: "#9", avatar: "avatar_hamster", name: "Ece A.", points: "87 puan", bg: "#ECFDF5" },
      { rank: "#10", avatar: "avatar_doge", name: "Kerem U.", points: "86 puan", bg: "#FFFBEB" },
    ],
    arkadaslar: [
      { rank: "#1", avatar: "avatar_fox", name: "Zeynep Ç.", points: "8 920 XP", bg: "#EFF6FF" },
      { rank: "#2", avatar: "avatar_dragon", name: "Rojhat T.", points: "8 710 XP", bg: "#ECFDF5" },
      { rank: "#3", avatar: "avatar_teddy_bear", name: "Burak Y.", points: "8 540 XP", bg: "#FFFBEB" },
      { rank: "#4", avatar: "avatar_penguin", name: "Selin K.", points: "8 510 XP", bg: "#FEF2F2" },
      { rank: "#5", avatar: "avatar_mouse", name: "Mert D.", points: "8 480 XP", bg: "#EFF6FF" },
      { rank: "#6", avatar: user?.avatar || "avatar_teddy_bear", name: `Sen (${user?.name || "İlkhan"})`, points: "8 450 XP", bg: "linear-gradient(135deg,#2563EB,#7C3AED)", me: true },
      { rank: "#7", avatar: "avatar_dog", name: "Rızgar O.", points: "8 120 XP", bg: "#F5F3FF" },
      { rank: "#8", avatar: "avatar_duck", name: "Ayşe N.", points: "8 030 XP", bg: "#ECFDF5" },
      { rank: "#9", avatar: "avatar_hamster", name: "Ece A.", points: "7 980 XP", bg: "#FFFBEB" },
      { rank: "#10", avatar: "avatar_doge", name: "Kerem U.", points: "7 900 XP", bg: "#FEF2F2" },
      { rank: "#11", avatar: "avatar_maneki", name: "Deniz P.", points: "7 860 XP", bg: "#EFF6FF" },
    ],
  }), [user?.avatar, user?.name]);

  const widgetRegistry = useMemo(() =>
    WIDGET_META.map((meta) => ({
      ...meta,
      render: () => {
        switch (meta.id) {
          case "tasks":        return <DailyTasksWidget tasks={tasks} doneTasks={doneTasks} onToggleTask={onToggleTask} />;
          case "achievements": return <AchievementWidget badges={badgeSeed} />;
          case "ranking":      return <RankingWidget key={`ranking-${rankingTab}`} rankingTab={rankingTab} onRankingTabChange={setRankingTab} rankingData={rankingData} />;
          case "journey":      return <JourneyWidget />;
          case "stats":        return <StatsWidget user={user} doneTasks={doneTasks} totalTasks={tasks.length} />;
          case "streak":       return <StreakWidget user={user} />;
          case "quiz":         return <QuizWidget />;
          case "notes":        return <NotesWidget />;
          case "focus":        return <FocusWidget />;
          case "xplog":        return <XpLogWidget />;
          case "goals":
          default:             return <GoalsWidget doneTasks={doneTasks} totalTasks={tasks.length} user={user} />;
        }
      },
    })),
    [doneTasks, onToggleTask, rankingData, rankingTab, tasks, user]
  );

  const activeWidgets      = activeWidgetIds.map((id) => widgetRegistry.find((w) => w.id === id)).filter(Boolean);
  const handleAddWidget    = (id) => setActiveWidgetIds((c) => (c.includes(id) ? c : [...c, id]));
  const handleRemoveWidget = (id) => setActiveWidgetIds((c) => c.filter((x) => x !== id));

  return (
    <section className="relative">
      <style>{`
        @keyframes widget-panel-in {
          from { opacity: 0; transform: translateY(12px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .widget-panel { animation: widget-panel-in .22s cubic-bezier(.2,.8,.2,1); }
      `}</style>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <WidgetEyebrowTitle accent="#2563EB">Kişisel Vitrin</WidgetEyebrowTitle>
        <button
          type="button"
          onClick={() => setIsCustomizing(true)}
          className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-[clamp(11.5px,0.78vw,13.5px)] font-bold tracking-[0.2px] text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 md:inline-flex"
        >
          Vitrin Düzenle
        </button>
      </div>

      {activeWidgets.length ? (
        <div className="grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
          {activeWidgets.map((widget) => (
            <WidgetSlot key={widget.id} widget={widget} isCustomizing={isCustomizing}>
              {widget.render()}
            </WidgetSlot>
          ))}
        </div>
      ) : (
        <EmptyState onOpenCustomizer={() => setIsCustomizing(true)} />
      )}

      {isCustomizing && (
        <WidgetPanel
          widgets={widgetRegistry}
          activeWidgetIds={activeWidgetIds}
          onAdd={handleAddWidget}
          onRemove={handleRemoveWidget}
          onClose={() => setIsCustomizing(false)}
        />
      )}
    </section>
  );
}
