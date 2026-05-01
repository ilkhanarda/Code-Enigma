import { useState, useMemo, useEffect, useRef } from "react";
import { QUESTIONS } from "../../data/questions/guvenirlik.js";
import Icon from "../../components/ui/icons8-icon.jsx";
import { DashboardShell } from "../../components/dashboard/dashboard-design.jsx";

const TOTAL_SECONDS = 30 * 60;

const DIFFICULTY_COLOR = {
  Kolay: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  Orta:  { text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
  Zor:   { text: "text-red-700",     bg: "bg-red-50",     border: "border-red-200"      },
};

/* ═══════════════════════════════════════
   SMALL REUSABLE COMPONENTS
═══════════════════════════════════════ */

function ProgressBar({ value, color = "bg-blue-600", h = "h-1.5" }) {
  return (
    <div className={`${h} w-full overflow-hidden rounded-full bg-slate-100`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

function SectionLabel({ text, color = "text-blue-500", lineColor = "bg-blue-400" }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-px w-4 rounded ${lineColor}`} />
      <span className={`text-[9px] font-bold uppercase tracking-[2px] ${color}`}>{text}</span>
    </div>
  );
}

function IconBtn({ onClick, active, activeClass = "", title, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition-all duration-150
        ${active ? activeClass : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"}
        ${className}`}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   TIMER
═══════════════════════════════════════ */
function useTimer(initial, onExpire) {
  const [seconds, setSeconds] = useState(initial);
  const runningRef = useRef(true);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!runningRef.current) return;
      setSeconds((s) => {
        if (s <= 1) {
          runningRef.current = false;
          queueMicrotask(() => onExpireRef.current?.());
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return { seconds, fmt: fmt(seconds), stop: () => { runningRef.current = false; } };
}

/* ═══════════════════════════════════════
   QUESTION PALETTE (Right Panel)
═══════════════════════════════════════ */
function QuestionPalette({ questions, answers, flagged, current, onSelect, stats, finished }) {
  const getStatus = (q) => {
    if (current === q.id) return "active";
    if (flagged.has(q.id)) return "flagged";
    if (answers[q.id]) return "answered";
    return "empty";
  };

  const STATUS_STYLE = {
    active:   "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200",
    answered: "bg-blue-400 border-blue-400 text-white",
    flagged:  "bg-amber-400 border-amber-400 text-white",
    empty:    "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:bg-blue-50",
  };

  const statCells = finished
    ? [
        { label: "Doğru",  val: stats.correct,   cls: "text-emerald-600" },
        { label: "Yanlış", val: stats.wrong,     cls: "text-red-500"     },
        { label: "Boş",    val: stats.empty,     cls: "text-slate-400"   },
      ]
    : [
        { label: "Cevaplanan", val: stats.answered, cls: "text-blue-600"   },
        { label: "Boş",        val: stats.empty,    cls: "text-slate-400"  },
        { label: "İşaretli",   val: flagged.size,   cls: "text-amber-600"  },
      ];

  return (
    <aside className="flex w-full flex-shrink-0 flex-col gap-4 xl:w-[220px]">
      {/* Stats summary */}
      <div className="surface-wrap rounded-2xl border border-slate-200/70 bg-white p-4">
        <SectionLabel text="Test Durumu" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {statCells.map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-lg font-bold leading-none ${s.cls}`}>{s.val}</div>
              <div className="mt-0.5 text-[9px] text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <ProgressBar
            value={(stats.answered / questions.length) * 100}
            color="bg-blue-500"
          />
          <p className="mt-1 text-[9px] text-slate-400">
            {stats.answered}/{questions.length} cevaplanmış
          </p>
        </div>
      </div>

      {/* Question grid */}
      <div className="surface-wrap rounded-2xl border border-slate-200/70 bg-white p-4">
        <SectionLabel text="Soru Paleti" />
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {questions.map((q) => (
            <button
              key={q.id}
              onClick={() => onSelect(q.id)}
              title={`Soru ${q.id}`}
              className={`flex h-9 w-full items-center justify-center rounded-lg border text-[11px] font-bold transition-all duration-150 ${STATUS_STYLE[getStatus(q)]}`}
            >
              {q.id}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-col gap-1.5">
          {[
            { color: "bg-blue-600",    label: "Aktif"       },
            { color: "bg-blue-400",    label: "Cevaplandı"  },
            { color: "bg-amber-400",   label: "İşaretlendi" },
            { color: "bg-slate-200",   label: "Boş"         },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <div className={`h-3 w-3 flex-shrink-0 rounded ${l.color}`} />
              <span className="text-[9px] text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational card */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="text-sm"><Icon name="idea" size={14} color="#2563EB" /></div>
        <p className="mt-1.5 text-[10px] leading-relaxed text-blue-700">
          Her soruyu dikkatli oku. Şıkları eleyerek ilerle.
        </p>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════
   HINT PANEL
═══════════════════════════════════════ */
function HintPanel({ hint }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-semibold text-amber-700 transition-all hover:bg-amber-100"
      >
        <Icon name="idea" size={12} color="#b45309" /> {open ? "İpucunu Gizle" : "İpucu Al"}
      </button>
      {open && (
        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-[11px] leading-relaxed text-amber-800">{hint}</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   EXPLANATION PANEL
═══════════════════════════════════════ */
function ExplanationPanel({ explanation, isCorrect, correctKey }) {
  const [showVideo, setShowVideo] = useState(false);
  const [difficulty, setDifficulty] = useState(null);

  return (
    <div className="surface-wrap mt-4 animate-[fadeIn_.3s_ease_both] rounded-2xl border border-slate-200/70 bg-white">
      {/* Result banner */}
      <div
        className={`flex items-center gap-2 rounded-t-2xl border-b px-5 py-3 ${
          isCorrect
            ? "border-emerald-100 bg-emerald-50"
            : "border-red-100 bg-red-50"
        }`}
      >
        <span className="text-base">{isCorrect ? <Icon name="check_circle" size={16} color="#059669" /> : <Icon name="xmark" size={16} color="#DC2626" />}</span>
        <span
          className={`text-[12px] font-bold ${
            isCorrect ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {isCorrect
            ? "Doğru cevap!"
            : `Yanlış — Doğru cevap: ${correctKey}`}
        </span>
      </div>

      <div className="p-5">
        {/* Explanation text */}
        <div className="mb-4">
          <SectionLabel text="Açıklamalı Çözüm" />
          <p className="mt-2 text-[12px] leading-relaxed text-slate-600">
            {explanation}
          </p>
        </div>

        {/* Video solution */}
        <div className="mb-4">
          {!showVideo ? (
            <button
              onClick={() => setShowVideo(true)}
              className="flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-[11px] font-semibold text-purple-700 transition-all hover:bg-purple-100"
            >
              <Icon name="play" size={12} color="#7C3AED" /> Video Çözümü İzle
            </button>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-purple-200 bg-purple-50">
              <div className="text-center">
                <div className="flex justify-center"><Icon name="video" size={22} color="#7C3AED" /></div>
                <p className="mt-1 text-[10px] text-purple-500">
                  Video çözüm yüklenecek
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Why did I struggle */}
        <div className="mb-4">
          <SectionLabel text="Neden Zorlandım?" color="text-slate-500" lineColor="bg-slate-300" />
          <div className="mt-2 flex flex-wrap gap-2">
            {["Kavram eksiği", "Dikkat hatası", "İşlem hatası", "Süre yetmedi"].map(
              (opt) => (
                <button
                  key={opt}
                  onClick={() => setDifficulty((d) => (d === opt ? null : opt))}
                  className={`rounded-lg border px-3 py-1.5 text-[10px] font-semibold transition-all ${
                    difficulty === opt
                      ? "border-blue-400 bg-blue-600 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-300"
                  }`}
                >
                  {opt}
                </button>
              )
            )}
          </div>
        </div>

        {/* Similar question */}
        <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-semibold text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
          <Icon name="refresh" size={11} color="#64748b" /> Benzer Soru Getir
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   INTERACTION BAR
═══════════════════════════════════════ */
function InteractionBar({ qId, flagged, onFlag, favorites, onFavorite }) {
  const [liked, setLiked]       = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment]   = useState("");
  const isFav    = favorites.has(qId);
  const isMarked = flagged.has(qId);

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
      <IconBtn
        onClick={() => { setLiked((v) => !v); setDisliked(false); }}
        active={liked}
        activeClass="border-emerald-400 bg-emerald-50 text-emerald-700"
        title="Beğen"
      >
        <Icon name="like" size={12} color={liked ? "#047857" : "#64748b"} /> <span>Beğendim</span>
      </IconBtn>

      <IconBtn
        onClick={() => { setDisliked((v) => !v); setLiked(false); }}
        active={disliked}
        activeClass="border-red-300 bg-red-50 text-red-600"
        title="Beğenme"
      >
        <Icon name="dislike" size={12} color={disliked ? "#DC2626" : "#64748b"} /> <span>Beğenmedim</span>
      </IconBtn>

      <IconBtn
        onClick={() => onFavorite(qId)}
        active={isFav}
        activeClass="border-amber-400 bg-amber-50 text-amber-700"
        title="Favorile"
      >
        <Icon name="favorite" size={12} color={isFav ? "#D97706" : "#64748b"} /> <span>Favori</span>
      </IconBtn>

      <IconBtn
        onClick={() => onFlag(qId)}
        active={isMarked}
        activeClass="border-amber-400 bg-amber-50 text-amber-700"
        title="İşaretle"
      >
        <Icon name="flag" size={12} color={isMarked ? "#D97706" : "#64748b"} /> <span>{isMarked ? "İşaretlendi" : "İşaretle"}</span>
      </IconBtn>

      <IconBtn
        onClick={() => setShowComment((v) => !v)}
        active={showComment}
        activeClass="border-blue-300 bg-blue-50 text-blue-700"
        title="Yorum yap"
      >
        <Icon name="comment" size={12} color={showComment ? "#2563EB" : "#64748b"} /> <span>Yorum</span>
      </IconBtn>

      <IconBtn
        onClick={() => alert("Bildiriminiz alındı.")}
        title="Bildir"
        className="ml-auto"
      >
        <Icon name="report_issue" size={12} color="#64748b" /> <span>Bildir</span>
      </IconBtn>

      {showComment && (
        <div className="mt-2 w-full">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bu soru hakkında yorumunuzu yazın..."
            rows={2}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700 placeholder:text-slate-300 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <div className="mt-1.5 flex justify-end gap-2">
            <button
              onClick={() => setShowComment(false)}
              className="rounded-lg border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-500 hover:bg-slate-50"
            >
              Vazgeç
            </button>
            <button
              onClick={() => { alert("Yorumunuz gönderildi!"); setShowComment(false); setComment(""); }}
              className="rounded-lg bg-blue-600 px-3 py-1 text-[10px] font-semibold text-white hover:bg-blue-700"
            >
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN: TestPage
═══════════════════════════════════════ */
export default function TestPage() {
  const [currentId, setCurrentId]     = useState(1);
  const [answers, setAnswers]          = useState({});   // { qId: optionKey }
  const [flagged, setFlagged]          = useState(new Set());
  const [favorites, setFavorites]      = useState(new Set());
  const [showFinish, setShowFinish]    = useState(false);
  const [testFinished, setTestFinished] = useState(false);

  const timer = useTimer(TOTAL_SECONDS, () => setTestFinished(true));

  const current  = QUESTIONS.find((q) => q.id === currentId);
  const currentIdx = QUESTIONS.findIndex((q) => q.id === currentId);

  const stats = useMemo(() => {
    let correct = 0, wrong = 0;
    QUESTIONS.forEach((q) => {
      if (answers[q.id]) {
        if (answers[q.id] === q.correctAnswer) correct++;
        else wrong++;
      }
    });
    const answered = Object.keys(answers).length;
    return { correct, wrong, empty: QUESTIONS.length - answered, answered };
  }, [answers]);

  const hasAnswer   = !!answers[currentId];
  const selectedKey = answers[currentId] || null;
  const isCorrect   = selectedKey === current.correctAnswer;
  const diffColor   = DIFFICULTY_COLOR[current.difficulty];
  const progressPct = ((currentIdx + 1) / QUESTIONS.length) * 100;
  const timerDanger = timer.seconds < 120;
  const reveal      = testFinished;

  const selectOption = (key) => {
    if (testFinished) return;
    setAnswers((prev) => ({ ...prev, [currentId]: key }));
  };

  const clearAnswer = () => {
    if (testFinished) return;
    setAnswers((prev) => { const n = { ...prev }; delete n[currentId]; return n; });
  };

  const skipQuestion = () => {
    if (testFinished) return;
    setAnswers((prev) => { const n = { ...prev }; delete n[currentId]; return n; });
    goNext();
  };

  const toggleFlag = (id) =>
    setFlagged((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleFavorite = (id) =>
    setFavorites((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const goPrev = () => currentIdx > 0 && setCurrentId(QUESTIONS[currentIdx - 1].id);
  const goNext = () => currentIdx < QUESTIONS.length - 1 && setCurrentId(QUESTIONS[currentIdx + 1].id);

  const OPTION_STYLE = (key) => {
    if (!reveal) {
      return selectedKey === key
        ? "border-blue-500 bg-blue-50 text-blue-800 shadow-sm"
        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50";
    }
    if (key === current.correctAnswer)
      return "border-emerald-500 bg-emerald-50 text-emerald-800";
    if (key === selectedKey && key !== current.correctAnswer)
      return "border-red-400 bg-red-50 text-red-700";
    return "border-slate-100 bg-slate-50 text-slate-400";
  };

  return (
    <DashboardShell>

      {/* ══ HEADER ══ */}
      <header className="glass-header sticky top-0 z-40 px-4 py-3 sm:px-6 sm:py-4 xl:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: test info */}
            <div className="flex items-center gap-3">
              <div
                style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-blue-600 text-[9px] font-bold text-white"
              >
                C:E
              </div>
              <div>
                <div className="text-[13px] font-bold tracking-tight text-slate-800">
                  Psikolojik Ölçme — Güvenirlik Testi
                </div>
                <div className="text-[9px] text-slate-400">
                  {QUESTIONS.length} soru · Konu: Ölçme ve Değerlendirme
                </div>
              </div>
            </div>

            {/* Center: progress */}
            <div className="flex flex-1 max-w-xs flex-col gap-1">
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>İlerleme</span>
                <span>{currentIdx + 1} / {QUESTIONS.length}</span>
              </div>
              <ProgressBar value={progressPct} color="bg-blue-600" />
            </div>

            {/* Right: timer + finish */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-bold tabular-nums ${
                  timerDanger
                    ? "animate-pulse border-red-300 bg-red-50 text-red-600"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                <Icon name="timer" size={12} color={timerDanger ? "#DC2626" : "#334155"} /> {timer.fmt}
              </div>
              <button
                onClick={() => setShowFinish(true)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-[11px] font-bold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700"
              >
                Testi Bitir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6 xl:flex-row xl:px-8">

        {/* ─ MAIN QUESTION AREA ─ */}
        <main className="min-w-0 flex-1">

          {/* Question card */}
          <div className="surface-wrap rounded-2xl border border-slate-200/70 bg-white">

            {/* Card header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-[12px] font-bold text-white">
                  {currentId}
                </span>
                <div>
                  <div className="text-[10px] text-slate-400">{current.topic}</div>
                  <div
                    className={`mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold ${diffColor.text} ${diffColor.bg} ${diffColor.border}`}
                  >
                    {current.difficulty}
                  </div>
                </div>
              </div>
              <HintPanel hint={current.hint} />
            </div>

            {/* Question body */}
            <div className="px-6 py-5">
              {/* Question text */}
              <p className="mb-5 text-[14px] font-semibold leading-relaxed text-slate-800">
                {currentId}. {current.questionText}
              </p>

              {/* Image placeholder */}
              {current.image && (
                <div className="mb-5 flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                  <span className="text-[11px] text-slate-400">Soru görseli</span>
                </div>
              )}

              {/* Options */}
              <div className="flex flex-col gap-2.5">
                {current.options.map((opt) => {
                  const isRight = reveal && opt.key === current.correctAnswer;
                  const isWrong = reveal && opt.key === selectedKey && !isRight;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => selectOption(opt.key)}
                      disabled={reveal}
                      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150 ${OPTION_STYLE(opt.key)} ${reveal ? "cursor-default" : "cursor-pointer"}`}
                    >
                      {/* Key badge */}
                      <span
                        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-bold transition-colors
                          ${isRight ? "bg-emerald-600 text-white"
                            : isWrong ? "bg-red-500 text-white"
                            : selectedKey === opt.key ? "bg-blue-600 text-white"
                            : "border border-slate-300 text-slate-500"}`}
                      >
                        {opt.key}
                      </span>
                      <span className="flex-1 text-[12px] leading-relaxed">{opt.text}</span>
                      {isRight && <span className="ml-auto flex-shrink-0 text-emerald-600"><Icon name="check_circle" size={12} color="#059669" /></span>}
                      {isWrong && <span className="ml-auto flex-shrink-0 text-red-500"><Icon name="xmark" size={12} color="#DC2626" /></span>}
                    </button>
                  );
                })}
              </div>

              {/* Submit / navigation */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={goPrev}
                    disabled={currentIdx === 0}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-500 transition-all hover:border-blue-300 hover:text-blue-600 disabled:opacity-40"
                  >
                    <span className="inline-flex items-center gap-1"><Icon name="previous" size={11} color="#64748b" /> Önceki</span>
                  </button>
                  <button
                    onClick={goNext}
                    disabled={currentIdx === QUESTIONS.length - 1}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold text-slate-500 transition-all hover:border-blue-300 hover:text-blue-600 disabled:opacity-40"
                  >
                    <span className="inline-flex items-center gap-1">Sonraki <Icon name="next" size={11} color="#64748b" /></span>
                  </button>
                </div>

                <div className="flex gap-2">
                  {!testFinished && (
                    <>
                      <button
                        onClick={clearAnswer}
                        disabled={!selectedKey}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-400 transition-all hover:border-red-200 hover:text-red-500 disabled:opacity-30"
                      >
                        <span className="inline-flex items-center gap-1"><Icon name="close" size={10} color="#94a3b8" /> Temizle</span>
                      </button>
                      <button
                        onClick={skipQuestion}
                        disabled={currentIdx === QUESTIONS.length - 1}
                        className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-semibold text-amber-700 transition-all hover:bg-amber-100 disabled:opacity-40"
                      >
                        ⇥ Boş Bırak
                      </button>
                    </>
                  )}
                  {currentIdx < QUESTIONS.length - 1 && (
                    <button
                      onClick={goNext}
                      className="rounded-xl bg-blue-600 px-5 py-2 text-[11px] font-bold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700"
                    >
                      <span className="inline-flex items-center gap-1">Sonraki Soru <Icon name="next" size={11} color="#ffffff" /></span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Interaction bar */}
          <div className="surface-wrap mt-3 rounded-2xl border border-slate-200/70 bg-white px-5 py-4">
            <InteractionBar
              qId={currentId}
              flagged={flagged}
              onFlag={toggleFlag}
              favorites={favorites}
              onFavorite={toggleFavorite}
            />
          </div>

          {/* Explanation panel (shown after test is finished) */}
          {reveal && hasAnswer && (
            <ExplanationPanel
              explanation={current.explanation}
              isCorrect={isCorrect}
              correctKey={current.correctAnswer}
            />
          )}
        </main>

        {/* ─ RIGHT PANEL ─ */}
        <QuestionPalette
          questions={QUESTIONS}
          answers={answers}
          flagged={flagged}
          current={currentId}
          onSelect={setCurrentId}
          stats={stats}
          finished={testFinished}
        />
      </div>

      {/* ══ FINISH MODAL ══ */}
      {showFinish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="surface-wrap w-full max-w-md rounded-2xl border border-slate-200/70 bg-white p-8 shadow-2xl">
            <h2 className="text-[18px] font-bold text-slate-800">Testi Bitir</h2>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
              Cevaplanmamış {stats.empty} sorunuz var. Testi bitirmek istediğinizden emin misiniz?
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              {[
                { label: "Cevaplanan", val: stats.answered, color: "text-blue-600"    },
                { label: "Boş",        val: stats.empty,    color: "text-slate-400"   },
                { label: "İşaretli",   val: flagged.size,   color: "text-amber-600"   },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-[9px] text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowFinish(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-50"
              >
                Geri Dön
              </button>
              <button
                onClick={() => { timer.stop(); setTestFinished(true); setShowFinish(false); }}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-[11px] font-bold text-white shadow-sm shadow-blue-200 hover:bg-blue-700"
              >
                Testi Bitir
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
