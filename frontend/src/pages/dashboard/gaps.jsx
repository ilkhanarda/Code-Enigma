import { useMemo, useState, useEffect } from "react";
import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";
import Icon from "../../components/ui/icons8-icon.jsx";

function classify(score) {
  if (score < 25) return { severity: "Kritik", color: "#DC2626", bg: "#FEF2F2" };
  if (score < 40) return { severity: "Yüksek", color: "#DC2626", bg: "#FEF2F2" };
  if (score < 55) return { severity: "Orta",   color: "#D97706", bg: "#FFFBEB" };
  return            { severity: "Hafif",  color: "#2563EB", bg: "#EFF6FF" };
}

const GAPS = [
  { topic: "Denklemler",         category: "Cebir",      score: 48, missed: 12, total: 24, lastTest: "3 gün önce",   suggested: "Mini Test 3 + 2 video" },
  { topic: "Eşitsizlikler",      category: "Cebir",      score: 20, missed: 18, total: 25, lastTest: "1 hafta önce", suggested: "Başlangıç modülünden tekrar" },
  { topic: "Logaritma",          category: "Cebir",      score: 38, missed: 9,  total: 18, lastTest: "2 gün önce",   suggested: "Kural kartları + 5 soru" },
  { topic: "Problem Çözme",      category: "Karma",      score: 35, missed: 11, total: 20, lastTest: "Dün",          suggested: "Günde 3 problem çöz" },
  { topic: "Limit ve Süreklilik",category: "Analiz",     score: 12, missed: 14, total: 16, lastTest: "Başlanmadı",   suggested: "Konuyu baştan al" },
  { topic: "Olasılık",           category: "İstatistik", score: 44, missed: 7,  total: 15, lastTest: "4 gün önce",   suggested: "Kavram haritasını incele" },
  { topic: "Geometri",           category: "Uzay",       score: 58, missed: 5,  total: 14, lastTest: "5 gün önce",   suggested: "Formül defterini gözden geçir" },
];

const STUDY_PLAN = [
  { day: "Pazartesi", focus: "Eşitsizlikler",   duration: "45 dk", type: "Video + Mini Test", color: "#DC2626", bg: "#FEF2F2", icon: "warning" },
  { day: "Salı",      focus: "Denklemler",      duration: "60 dk", type: "Problem Çözümü",    color: "#DC2626", bg: "#FEF2F2", icon: "tasks" },
  { day: "Çarşamba",  focus: "Limit",           duration: "40 dk", type: "Kavram Dersi",      color: "#D97706", bg: "#FFFBEB", icon: "infinity" },
  { day: "Perşembe",  focus: "Logaritma",       duration: "35 dk", type: "Kural + Uygulama",  color: "#D97706", bg: "#FFFBEB", icon: "module" },
  { day: "Cuma",      focus: "Problem Çözme",   duration: "50 dk", type: "Karma Set",         color: "#D97706", bg: "#FFFBEB", icon: "goals" },
  { day: "Cumartesi", focus: "Tekrar Testi",    duration: "30 dk", type: "Deneme Sınavı",     color: "#2563EB", bg: "#EFF6FF", icon: "test" },
];

const SEVERITY_ORDER = { "Kritik": 0, "Yüksek": 1, "Orta": 2, "Hafif": 3 };

const FILTER_COLORS = {
  "Tümü":   "#64748B",
  "Kritik": "#DC2626",
  "Yüksek": "#DC2626",
  "Orta":   "#D97706",
  "Hafif":  "#2563EB",
};

function ProgressBar({ value, color }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function SectionLabel({ text, color = "#2563EB" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px w-5 rounded" style={{ background: color }} />
      <span className="text-[10px] font-bold uppercase tracking-[2.5px]" style={{ color }}>{text}</span>
    </div>
  );
}

function SeverityBadge({ level, color, bg }) {
  return (
    <span className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[1.4px]" style={{ background: bg, color }}>
      {level}
    </span>
  );
}

function GapRow({ g, onSelect, selected }) {
  return (
    <button
      onClick={onSelect}
      className={`surface-wrap w-full rounded-2xl border bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5
        ${selected ? "border-blue-300 shadow-md shadow-blue-100" : "border-slate-200/70"}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[14px] font-bold" style={{ background: g.bg, color: g.color }}>
          {g.score}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold text-[#111827] leading-snug truncate">{g.topic}</h3>
            <SeverityBadge level={g.severity} color={g.color} bg={g.bg} />
          </div>
          <p className="mt-0.5 text-[10px] text-slate-400">{g.category} · {g.missed}/{g.total} soru yanlış · Son test: {g.lastTest}</p>
          <div className="mt-2">
            <ProgressBar value={g.score} color={g.color} />
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <span className="text-[9px] font-bold uppercase tracking-[1px] text-slate-400">Skor</span>
          <span className="text-[18px] font-bold" style={{ color: g.color }}>%{g.score}</span>
        </div>
      </div>
    </button>
  );
}

export default function Gaps() {
  const [filter, setFilter] = useState("Tümü");

  const enriched = useMemo(() => GAPS.map((g) => ({ ...g, ...classify(g.score) })), []);

  const [selectedTopic, setSelectedTopic] = useState(enriched[0].topic);

  const sortedGaps = useMemo(() => {
    const list = filter === "Tümü" ? enriched : enriched.filter((g) => g.severity === filter);
    return [...list].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  }, [filter, enriched]);

  const stats = useMemo(() => {
    const avg = Math.round(enriched.reduce((s, g) => s + g.score, 0) / enriched.length);
    const critical = enriched.filter((g) => g.severity === "Kritik" || g.severity === "Yüksek").length;
    const hoursNeeded = Math.round(enriched.reduce((s, g) => s + (100 - g.score) / 10, 0));
    return { avg, critical, hoursNeeded };
  }, [enriched]);

  useEffect(() => {
    if (sortedGaps.length > 0 && !sortedGaps.find((g) => g.topic === selectedTopic)) {
      setSelectedTopic(sortedGaps[0].topic);
    }
  }, [sortedGaps, selectedTopic]);

  const selected = enriched.find((g) => g.topic === selectedTopic) || enriched[0];

  return (
    <div className="dashboard-grid-bg min-h-screen text-[#111827]">
      <style>{`
        .dashboard-grid-bg * {
          font-family: "Plus Jakarta Sans", "Inter", "Segoe UI", sans-serif;
        }
        .dashboard-grid-bg {
          background-color: #f3f6fc;
          background-image:
            radial-gradient(circle at 15% -8%, rgba(59,130,246,0.18), transparent 30%),
            radial-gradient(circle at 90% 5%, rgba(14,165,233,0.14), transparent 26%),
            radial-gradient(circle at 1px 1px, rgba(148,163,184,0.16) 1px, transparent 1px);
          background-size: auto, auto, 26px 26px;
        }
        .glass-header {
          border-bottom: 1px solid rgba(226,232,240,0.88);
          background: rgba(255,255,255,0.84);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .surface-wrap {
          border: 1px solid #dbe5f3;
          background: #ffffff;
          box-shadow:
            0 10px 32px rgba(15,23,42,0.07),
            0 2px 8px rgba(15,23,42,0.03);
        }
        .surface-pill {
          border: 1px solid #dbe5f3;
          background: rgba(255,255,255,0.92);
          box-shadow: 0 6px 16px rgba(15,23,42,0.05);
        }
      `}</style>

      <div className="flex min-h-screen">
        <DashboardNavbar />

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          {/* HEADER */}
          <header className="glass-header sticky top-0 z-40 px-4 py-4 sm:px-6 sm:py-5 xl:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-px w-5 bg-amber-400 rounded" />
                  <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-amber-500">Analiz Raporu</span>
                </div>
                <h1 className="inline-flex items-center gap-2 text-[26px] font-bold tracking-[-0.4px] leading-tight">Eksiklerim <Icon name="warning" size={22} color="#DC2626" /></h1>
                <p className="mt-1 text-[11px] text-slate-400">
                  Son 30 günün verisine göre hazırlandı · {GAPS.length} odak alanı tespit edildi
                </p>
              </div>

              <div className="flex items-center gap-3">
                {[
                  { value: `%${stats.avg}`,    label: "Ort. Skor", color: "#D97706" },
                  { value: stats.critical,     label: "Öncelikli", color: "#DC2626" },
                  { value: `${stats.hoursNeeded}sa`, label: "Önerilen", color: "#2563EB" },
                ].map((s) => (
                  <div key={s.label} className="surface-pill flex min-w-[72px] flex-col items-center justify-center rounded-xl px-4 py-2.5">
                    <div className="text-[17px] font-bold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                    <div className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[1.5px] text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Severity filter chips */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[9px] font-bold uppercase tracking-[1.5px] text-slate-400">Öncelik</span>
              {["Tümü", "Kritik", "Yüksek", "Orta", "Hafif"].map((s) => {
                const fc = FILTER_COLORS[s];
                const isActive = filter === s;
                const hoverCls = {
                  "Tümü":   "hover:border-slate-300 hover:text-slate-600",
                  "Kritik": "hover:border-red-200 hover:text-[#DC2626]",
                  "Yüksek": "hover:border-red-200 hover:text-[#DC2626]",
                  "Orta":   "hover:border-amber-200 hover:text-[#D97706]",
                  "Hafif":  "hover:border-blue-200 hover:text-[#2563EB]",
                }[s];
                return (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all border ${!isActive ? hoverCls : ""}`}
                    style={isActive
                      ? { background: fc, color: "#fff", borderColor: fc }
                      : { background: "#fff", color: "#64748B", borderColor: "#e2e8f0" }
                    }
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </header>

          {/* MAIN */}
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
            <div className="grid grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">

              {/* LEFT: Gap list */}
              <section className="min-w-0">
                <div className="mb-4">
                  <SectionLabel text="Odak Alanları" color="#DC2626" />
                  <p className="mt-2 text-[11px] text-slate-400">Seçim yaparak detayı sağda incele</p>
                </div>
                <div className="flex flex-col gap-3">
                  {sortedGaps.map((g) => (
                    <GapRow
                      key={g.topic}
                      g={g}
                      selected={selectedTopic === g.topic}
                      onSelect={() => setSelectedTopic(g.topic)}
                    />
                  ))}
                  {sortedGaps.length === 0 && (
                    <div className="surface-wrap rounded-2xl border border-dashed border-slate-200 py-12 text-center">
                      <div className="mb-2 flex justify-center"><Icon name="target" size={30} color="#94a3b8" /></div>
                      <p className="text-[11px] font-semibold text-slate-500">Bu kategoride eksik yok</p>
                    </div>
                  )}
                </div>

                {/* Weekly study plan */}
                <div className="mt-7">
                  <div className="mb-4">
                    <SectionLabel text="Haftalık Çalışma Planı" color="#2563EB" />
                    <p className="mt-2 text-[11px] text-slate-400">Eksiklerine göre otomatik oluşturuldu</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                    {STUDY_PLAN.map((p) => (
                      <div
                        key={p.day}
                        className="surface-pill group flex items-center gap-3 rounded-xl p-3.5 transition-all hover:-translate-y-0.5"
                      >
                        <div
                          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[14px]"
                          style={{ background: p.bg, color: p.color }}
                        >
                          <Icon name={p.icon} size={16} color={p.color} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-[1.4px] text-slate-400">{p.day}</span>
                            <span className="text-[9px] font-bold" style={{ color: p.color }}>· {p.duration}</span>
                          </div>
                          <div className="text-[12px] font-bold text-[#111827] leading-snug">{p.focus}</div>
                          <div className="mt-0.5 text-[10px] text-slate-400">{p.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* RIGHT: Detail panel */}
              <aside className="flex flex-col gap-5">
                <div className="surface-wrap rounded-2xl p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <SectionLabel text="Seçili Eksik" color={selected.color} />
                    <SeverityBadge level={selected.severity} color={selected.color} bg={selected.bg} />
                  </div>

                  <h2 className="text-[18px] font-bold tracking-tight text-[#111827]">{selected.topic}</h2>
                  <p className="mt-1 text-[11px] text-slate-400">{selected.category}</p>

                  {/* Circular score */}
                  <div className="my-5 flex items-center justify-center">
                    <div className="relative h-32 w-32">
                      <svg viewBox="0 0 100 100" className="-rotate-90 h-full w-full">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke={selected.color} strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={`${(selected.score / 100) * 263.9} 263.9`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[24px] font-bold" style={{ color: selected.color }}>%{selected.score}</span>
                        <span className="text-[9px] font-bold uppercase tracking-[1.5px] text-slate-400">Skor</span>
                      </div>
                    </div>
                  </div>

                  {/* Facts */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3">
                      <div className="text-[9px] font-bold uppercase tracking-[1.4px] text-slate-400">Yanlış</div>
                      <div className="mt-1 text-[14px] font-bold text-[#DC2626]">{selected.missed}/{selected.total}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3">
                      <div className="text-[9px] font-bold uppercase tracking-[1.4px] text-slate-400">Son Test</div>
                      <div className="mt-1 text-[12px] font-bold text-slate-600">{selected.lastTest}</div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="mt-4 rounded-xl p-3.5" style={{ background: selected.bg }}>
                    <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[1.4px]" style={{ color: selected.color }}>
                      <Icon name="idea" size={11} color={selected.color} /> Öneri
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed" style={{ color: selected.color }}>{selected.suggested}</p>
                  </div>

                  <button
                    className="mt-4 w-full rounded-xl py-2.5 text-[11px] font-bold text-white transition-all hover:shadow-md"
                    style={{ background: selected.color }}
                  >
                    <span className="inline-flex items-center gap-1">Çalışmaya Başla <Icon name="next" size={12} color="#ffffff" /></span>
                  </button>
                </div>

                {/* Tips */}
                <div className="surface-wrap rounded-2xl p-5">
                  <div className="mb-4">
                    <SectionLabel text="Genel İpuçları" color="#059669" />
                  </div>
                  <ul className="flex flex-col gap-2.5 text-[11px] text-slate-600">
                    <li className="flex gap-2"><Icon name="check_circle" size={13} color="#059669" /><span>Günde 25 dk hedefli çalışma, dağınık 2 saatten etkili.</span></li>
                    <li className="flex gap-2"><Icon name="repeat" size={13} color="#64748b" /><span>Kritik konuları 48 saatte bir tekrar et (spacing).</span></li>
                    <li className="flex gap-2"><Icon name="brain" size={13} color="#2563EB" /><span>Yanlışları defterine yazıp açıklamayı ekle.</span></li>
                    <li className="flex gap-2"><Icon name="chart" size={13} color="#059669" /><span>Haftada bir deneme ile skorunu izle.</span></li>
                  </ul>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
