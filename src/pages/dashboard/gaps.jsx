import { useMemo, useState } from "react";
import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";

const GAPS = [
  { topic: "Denklemler",         category: "Cebir",     severity: "Kritik", score: 48, missed: 12, total: 24, lastTest: "3 gün önce", suggested: "Mini Test 3 + 2 video", color: "#DC2626", bg: "#FEF2F2" },
  { topic: "Eşitsizlikler",      category: "Cebir",     severity: "Kritik", score: 20, missed: 18, total: 25, lastTest: "1 hafta önce", suggested: "Başlangıç modülünden tekrar", color: "#DC2626", bg: "#FEF2F2" },
  { topic: "Logaritma",          category: "Cebir",     severity: "Orta",   score: 38, missed: 9,  total: 18, lastTest: "2 gün önce", suggested: "Kural kartları + 5 soru", color: "#D97706", bg: "#FFFBEB" },
  { topic: "Problem Çözme",      category: "Karma",     severity: "Orta",   score: 35, missed: 11, total: 20, lastTest: "Dün", suggested: "Günde 3 problem çöz", color: "#D97706", bg: "#FFFBEB" },
  { topic: "Limit ve Süreklilik",category: "Analiz",    severity: "Yüksek", score: 12, missed: 14, total: 16, lastTest: "Başlanmadı", suggested: "Konuyu baştan al", color: "#DC2626", bg: "#FEF2F2" },
  { topic: "Olasılık",           category: "İstatistik",severity: "Hafif",  score: 44, missed: 7,  total: 15, lastTest: "4 gün önce", suggested: "Kavram haritasını incele", color: "#2563EB", bg: "#EFF6FF" },
  { topic: "Geometri",           category: "Uzay",      severity: "Hafif",  score: 58, missed: 5,  total: 14, lastTest: "5 gün önce", suggested: "Formül defterini gözden geçir", color: "#2563EB", bg: "#EFF6FF" },
];

const STUDY_PLAN = [
  { day: "Pazartesi", focus: "Eşitsizlikler",   duration: "45 dk", type: "Video + Mini Test", color: "#DC2626", bg: "#FEF2F2", icon: "⬡" },
  { day: "Salı",      focus: "Denklemler",      duration: "60 dk", type: "Problem Çözümü",    color: "#DC2626", bg: "#FEF2F2", icon: "◫" },
  { day: "Çarşamba",  focus: "Limit",           duration: "40 dk", type: "Kavram Dersi",      color: "#D97706", bg: "#FFFBEB", icon: "∞" },
  { day: "Perşembe",  focus: "Logaritma",       duration: "35 dk", type: "Kural + Uygulama",  color: "#D97706", bg: "#FFFBEB", icon: "ln" },
  { day: "Cuma",      focus: "Problem Çözme",   duration: "50 dk", type: "Karma Set",         color: "#D97706", bg: "#FFFBEB", icon: "◈" },
  { day: "Cumartesi", focus: "Tekrar Testi",    duration: "30 dk", type: "Deneme Sınavı",     color: "#2563EB", bg: "#EFF6FF", icon: "📝" },
];

const SEVERITY_ORDER = { "Kritik": 0, "Yüksek": 1, "Orta": 2, "Hafif": 3 };

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
      className={`w-full text-left rounded-2xl border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,.06)]
        ${selected ? "border-blue-300 shadow-md shadow-blue-100" : "border-slate-100"}`}
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
  const [selectedTopic, setSelectedTopic] = useState(GAPS[0].topic);

  const sortedGaps = useMemo(() => {
    const list = filter === "Tümü" ? GAPS : GAPS.filter((g) => g.severity === filter);
    return [...list].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
  }, [filter]);

  const stats = useMemo(() => {
    const avg = Math.round(GAPS.reduce((s, g) => s + g.score, 0) / GAPS.length);
    const critical = GAPS.filter((g) => g.severity === "Kritik" || g.severity === "Yüksek").length;
    const hoursNeeded = Math.round(GAPS.reduce((s, g) => s + (100 - g.score) / 10, 0));
    return { avg, critical, hoursNeeded };
  }, []);

  const selected = GAPS.find((g) => g.topic === selectedTopic) || GAPS[0];

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111827]">
      <style>{`* { font-family: 'IBM Plex Mono', monospace; }`}</style>

      <div className="flex min-h-screen">
        <DashboardNavbar />

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          {/* HEADER */}
          <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 px-8 py-5 backdrop-blur-md">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-px w-5 bg-amber-400 rounded" />
                  <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-amber-500">Analiz Raporu</span>
                </div>
                <h1 className="text-[26px] font-bold tracking-[-0.4px] leading-tight">Eksiklerim ⚠️</h1>
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
                  <div key={s.label} className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 min-w-[72px]">
                    <div className="text-[17px] font-bold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                    <div className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[1.5px] text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Severity filter chips */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[9px] font-bold uppercase tracking-[1.5px] text-slate-400">Öncelik</span>
              {["Tümü", "Kritik", "Yüksek", "Orta", "Hafif"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                    filter === s
                      ? "bg-[#DC2626] text-white shadow-sm shadow-red-200"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:text-[#DC2626]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </header>

          {/* MAIN */}
          <main className="flex-1 px-8 py-7">
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
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
                      <div className="mb-2 text-3xl">🎯</div>
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
                        className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                      >
                        <div
                          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[14px]"
                          style={{ background: p.bg, color: p.color }}
                        >
                          {p.icon}
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
                <div className="rounded-2xl border border-slate-100 bg-white p-5">
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
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="text-[9px] font-bold uppercase tracking-[1.4px] text-slate-400">Yanlış</div>
                      <div className="mt-1 text-[14px] font-bold text-[#DC2626]">{selected.missed}/{selected.total}</div>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="text-[9px] font-bold uppercase tracking-[1.4px] text-slate-400">Son Test</div>
                      <div className="mt-1 text-[12px] font-bold text-slate-600">{selected.lastTest}</div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="mt-4 rounded-xl p-3.5" style={{ background: selected.bg }}>
                    <div className="text-[9px] font-bold uppercase tracking-[1.4px]" style={{ color: selected.color }}>💡 Öneri</div>
                    <p className="mt-1 text-[11px] leading-relaxed" style={{ color: selected.color }}>{selected.suggested}</p>
                  </div>

                  <button
                    className="mt-4 w-full rounded-xl py-2.5 text-[11px] font-bold text-white transition-all hover:shadow-md"
                    style={{ background: selected.color }}
                  >
                    Çalışmaya Başla →
                  </button>
                </div>

                {/* Tips */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="mb-4">
                    <SectionLabel text="Genel İpuçları" color="#059669" />
                  </div>
                  <ul className="flex flex-col gap-2.5 text-[11px] text-slate-600">
                    <li className="flex gap-2"><span>✅</span><span>Günde 25 dk hedefli çalışma, dağınık 2 saatten etkili.</span></li>
                    <li className="flex gap-2"><span>🔁</span><span>Kritik konuları 48 saatte bir tekrar et (spacing).</span></li>
                    <li className="flex gap-2"><span>🧠</span><span>Yanlışları defterine yazıp açıklamayı ekle.</span></li>
                    <li className="flex gap-2"><span>📊</span><span>Haftada bir deneme ile skorunu izle.</span></li>
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
