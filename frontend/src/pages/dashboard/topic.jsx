import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";
import Icon from "../../components/ui/icons8-icon.jsx";
import { useUser } from "../../context/UserContext.jsx";

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const TOPIC_FLOW = [
  { label: "Konuya Giriş",              done: true  },
  { label: "Terimler",                  done: true  },
  { label: "Sabit / Değişken / Katsayı",done: true  },
  { label: "Cebirsel İfade Yapısı",     done: false, active: true },
  { label: "Cebirsel İfadelerde İşlemler",             done: false },
];

const COMPLETION_PERCENT = 45;
const COMPLETED_STEPS    = 3;
const CURRENT_TOPIC_NAME = "Temel Kavramlar";

const VIDEOS = [
  {
    id: 1,
    title: "Cebire Giriş ve Tarihsel Arka Plan",
    watched: true,
    chapters: 3,
    questions: 5,
    flashcards: 8,
  },
  {
    id: 2,
    title: "Temel Terimler: Terim, İfade, Denklem",
    watched: true,
    chapters: 4,
    questions: 7,
    flashcards: 12,
  },
  {
    id: 3,
    title: "Sabit Sayılar ve Özellikleri",
    watched: true,
    chapters: 2,
    questions: 4,
    flashcards: 6,
  },
  {
    id: 4,
    title: "Değişkenler ve Sembolik Gösterim",
    watched: false,
    active: true,
    chapters: 3,
    questions: 8,
    flashcards: 10,
  },
  {
    id: 5,
    title: "Katsayı Kavramı ve Örnekler",
    watched: false,
    chapters: 3,
    questions: 6,
    flashcards: 9,
  },
  {
    id: 6,
    title: "Cebirsel İfadelerin Yapısı",
    watched: false,
    chapters: 5,
    questions: 10,
    flashcards: 14,
  }
];

/* ═══════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════ */

function SectionLabel({ text, color = "#2563EB" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px w-5 rounded" style={{ background: color }} />
      <span
        className="text-[12px] font-bold tracking-[0.5px]"
        style={{ color }}
      >
        {text}
      </span>
    </div>
  );
}

/* Top progress bar — no motivational text, just bar + % */
function TopProgressBar({ value }) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative flex-1 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${value}%`,
            background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)",
          }}
        />
      </div>
      <span className="shrink-0 text-[12px] font-bold tracking-tight text-[#2563EB]">
        %{value}
      </span>
    </div>
  );
}

/* Left sidebar — full height topic flow, no progress bar inside */
function TopicFlowSidebar({ steps, topicName }) {
  return (
    <aside
      className="flex w-[230px] shrink-0 flex-col rounded-[22px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,.05)] xl:sticky xl:top-[132px] self-start"
      style={{ minHeight: "calc(100vh - 160px)" }}
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-4 pt-5 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#2563EB]">
          Cebir &rsaquo; {topicName}
        </p>
      </div>

      {/* Steps */}
      <ol className="flex flex-col gap-1.5 px-3 py-4 flex-1">
        {steps.map((step, index) => {
          const isCompleted = step.done && !step.active;
          const isActive    = !!step.active;

          const rowCls = isActive
            ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
            : isCompleted
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-slate-100 bg-slate-50 text-slate-400";

          const dotCls = isActive
            ? "bg-[#2563EB] text-white"
            : isCompleted
            ? "bg-[#059669] text-white"
            : "bg-white text-slate-400 border border-slate-200";

          return (
            <li key={step.label}>
              <div
                className={`flex items-center gap-2.5 rounded-xl border px-2.5 py-2 ${rowCls}`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${dotCls}`}
                >
                  {isCompleted ? (
                    <Icon name="check" size={9} color="#ffffff" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="text-[10px] font-semibold leading-snug">
                  {step.label}
                </span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Completed count footer */}
      <div className="border-t border-slate-100 px-4 py-3">
        <p className="text-[10px] font-semibold text-slate-400">
          {COMPLETED_STEPS} / {steps.length} bölüm tamamlandı
        </p>
      </div>
    </aside>
  );
}

/* Single video row */
function VideoRow({ video, index, onPlayClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all duration-200
        ${
          video.active
            ? "border-blue-300 bg-blue-50 shadow-sm shadow-blue-100"
            : video.watched
            ? "border-emerald-100 bg-emerald-50/60"
            : hovered
            ? "border-slate-200 bg-white shadow-sm"
            : "border-transparent bg-slate-50"
        }
      `}
    >
      {/* LEFT GROUP */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Watched indicator */}
        <div className="shrink-0">
          {video.watched ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200">
              <Icon name="check" size={11} color="#059669" />
            </span>
          ) : (
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[9px] font-bold
                ${video.active ? "border-[#2563EB] text-[#2563EB]" : "border-slate-200 text-slate-300"}
              `}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>

        {/* Play button */}
        <button
          type="button"
          onClick={onPlayClick}
          aria-label={`${video.title} videosunu oynat`}
          className={`
            flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-150
            ${
              video.active
                ? "bg-[#2563EB] shadow-md shadow-blue-200 hover:bg-[#1D4ED8]"
                : video.watched
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-slate-200 hover:bg-slate-300"
            }
          `}
        >
          <Icon
            name="play"
            size={13}
            color="#ffffff"
          />
        </button>

        {/* Title */}
        <p
          className={`text-[12px] font-semibold leading-snug truncate
            ${video.active ? "text-blue-800" : video.watched ? "text-emerald-800" : "text-slate-600"}
          `}
        >
          {video.title}
        </p>
      </div>

      {/* RIGHT GROUP — meta info */}
      <div className="hidden shrink-0 grid-cols-3 gap-4 sm:grid sm:min-w-[270px]">
        <MetaPill value={`${video.chapters} chapter`} />
        <MetaPill value={`${video.questions} soru`} />
        <MetaPill value={`${video.flashcards} kart`} />
      </div>
    </div>
  );
}

function MetaPill({ value }) {
  return (
    <span className="inline-flex min-w-0 justify-center text-[12px] font-semibold text-slate-600">
      {value}
    </span>
  );
}

/* ═══════════════════════════════════════
   PAGE
═══════════════════════════════════════ */
export default function Topic() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111827]">
      <style>{`* { font-family: 'IBM Plex Mono', monospace; }`}</style>

      <div className="flex min-h-screen">
        <DashboardNavbar />

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">

          {/* ══ HEADER ══ */}
          <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 px-8 py-3.5 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left */}
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[1.2px] text-slate-500 transition-all hover:border-blue-200 hover:text-[#2563EB]"
                >
                  <Icon name="back" size={12} color="#64748B" />
                  Geri
                </button>

                <nav
                  aria-label="Breadcrumb"
                  className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-[11px]"
                >
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="font-semibold text-slate-400 transition-colors hover:text-[#2563EB]"
                  >
                    Dashboard
                  </button>
                  <span className="text-slate-300">›</span>
                  <span className="font-semibold text-slate-400">Cebir</span>
                  <span className="text-slate-300">›</span>
                  <span className="truncate font-bold text-[#111827]">{CURRENT_TOPIC_NAME}</span>
                </nav>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[1.2px] text-slate-500 transition-all hover:border-blue-200 hover:text-[#2563EB]"
                >
                  <Icon name="notes" size={12} color="#64748B" />
                  Notlar
                </button>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-xl bg-[#2563EB] px-3 py-2 text-[10px] font-semibold uppercase tracking-[1.2px] text-white transition-all hover:bg-[#1D4ED8] hover:shadow-md hover:shadow-blue-200"
                >
                  <Icon name="check" size={12} color="#ffffff" />
                  Kaydet
                </button>

                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">
                    <Icon name={user.avatar} size={15} />
                  </div>
                  <span className="max-w-[92px] truncate text-[10px] font-semibold text-slate-500">
                    {user.name}
                  </span>
                </div>
              </div>
            </div>

            {/* ── TOP PROGRESS BAR ── */}
            <div className="mt-3 px-0">
              <TopProgressBar value={COMPLETION_PERCENT} />
            </div>
          </header>

          {/* ══ MAIN ══ */}
          <main className="flex-1 overflow-x-hidden px-8 py-6">
            {/* Layout: LEFT sidebar (flow) + RIGHT content (videos) */}
            <div className="flex gap-6 items-start">

              {/* ── LEFT: Topic Flow Sidebar ── */}
              <TopicFlowSidebar steps={TOPIC_FLOW} topicName={CURRENT_TOPIC_NAME} />

              {/* ── RIGHT: Video Content ── */}
              <section className="flex-1 min-w-0 space-y-3">

                {/* Section header */}
                <div className="mb-4 flex items-center justify-between gap-4">
                  <SectionLabel text={CURRENT_TOPIC_NAME} color="#2563EB" />
                  <span className="text-[10px] font-semibold text-slate-400">
                    {VIDEOS.filter((v) => v.watched).length} / {VIDEOS.length} video izlendi
                  </span>
                </div>

                {/* Video rows */}
                {VIDEOS.map((video, index) => (
                  <VideoRow
                    key={video.id}
                    video={video}
                    index={index}
                    onPlayClick={video.title === "Değişkenler ve Sembolik Gösterim" ? () => navigate("/video") : undefined}
                  />
                ))}
              </section>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
