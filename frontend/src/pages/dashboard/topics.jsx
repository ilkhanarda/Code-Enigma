import { useMemo, useState } from "react";
import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";
import Icon from "../../components/ui/icons8-icon.jsx";

const ALL_TOPICS = [
  { title: "Temel Kavramlar",     category: "Cebir",        level: "Başlangıç", progress: 84, items: 12, instructor: "Dr. Ayşe Kaya",  color: "#2563EB", bg: "#EFF6FF", icon: "goals", trend: "up" },
  { title: "Sayı Basamakları",    category: "Aritmetik",    level: "Orta",      progress: 72, items: 8,  instructor: "Mert Demir",     color: "#7C3AED", bg: "#F5F3FF", icon: "stats", trend: "up" },
  { title: "Rasyonel Sayılar",    category: "Sayı Teorisi", level: "Orta",      progress: 91, items: 14, instructor: "Dr. Zeynep Alp", color: "#059669", bg: "#ECFDF5", icon: "journey", trend: "flat" },
  { title: "Denklemler",          category: "Cebir",        level: "Orta",      progress: 48, items: 6,  instructor: "Burak Yıldız",   color: "#D97706", bg: "#FFFBEB", icon: "tasks", trend: "down" },
  { title: "Eşitsizlikler",       category: "Cebir",        level: "İleri",     progress: 20, items: 19, instructor: "Dr. Selin Taş",  color: "#DC2626", bg: "#FEF2F2", icon: "module", trend: "up" },
  { title: "Fonksiyonlar",        category: "Analiz",       level: "İleri",     progress: 66, items: 11, instructor: "Dr. Ayşe Kaya",  color: "#2563EB", bg: "#EFF6FF", icon: "target", trend: "up" },
  { title: "Problem Çözme",       category: "Karma",        level: "Orta",      progress: 35, items: 5,  instructor: "Mert Demir",     color: "#7C3AED", bg: "#F5F3FF", icon: "goals", trend: "flat" },
  { title: "Geometri",            category: "Uzay",         level: "Orta",      progress: 58, items: 7,  instructor: "Burak Yıldız",   color: "#059669", bg: "#ECFDF5", icon: "module", trend: "up" },
  { title: "Limit ve Süreklilik", category: "Analiz",       level: "İleri",     progress: 12, items: 9,  instructor: "Dr. Ayşe Kaya",  color: "#2563EB", bg: "#EFF6FF", icon: "infinity", trend: "flat" },
  { title: "Türev",               category: "Analiz",       level: "İleri",     progress: 0,  items: 15, instructor: "Dr. Zeynep Alp", color: "#059669", bg: "#ECFDF5", icon: "derivative", trend: "flat" },
  { title: "İntegral",            category: "Analiz",       level: "İleri",     progress: 0,  items: 13, instructor: "Dr. Zeynep Alp", color: "#059669", bg: "#ECFDF5", icon: "integral", trend: "flat" },
  { title: "Olasılık",            category: "İstatistik",   level: "Orta",      progress: 44, items: 8,  instructor: "Mert Demir",     color: "#7C3AED", bg: "#F5F3FF", icon: "percent", trend: "up" },
  { title: "İstatistik Temelleri",category: "İstatistik",   level: "Başlangıç", progress: 55, items: 10, instructor: "Dr. Selin Taş",  color: "#DC2626", bg: "#FEF2F2", icon: "chart", trend: "flat" },
  { title: "Logaritma",           category: "Cebir",        level: "İleri",     progress: 38, items: 7,  instructor: "Burak Yıldız",   color: "#D97706", bg: "#FFFBEB", icon: "module", trend: "down" },
];

const CATEGORIES = ["Tümü", "Cebir", "Aritmetik", "Analiz", "Sayı Teorisi", "İstatistik", "Uzay", "Karma"];
const LEVELS = ["Tümü", "Başlangıç", "Orta", "İleri"];
const SORTS = [
  { id: "progress-desc", label: "İlerleme ↓" },
  { id: "progress-asc",  label: "İlerleme ↑" },
  { id: "title",         label: "A → Z" },
  { id: "items",         label: "İçerik Sayısı" },
];

function normalize(s) {
  return s.toLocaleLowerCase("tr-TR")
    .replace(/ç/g,"c").replace(/ğ/g,"g").replace(/ı/g,"i")
    .replace(/ö/g,"o").replace(/ş/g,"s").replace(/ü/g,"u");
}

function ProgressBar({ value, color }) {
  return (
    <div className="h-1 overflow-hidden rounded-full bg-slate-100">
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

function TopicCard({ t, patternVariant = 0 }) {
  const badge =
    t.progress >= 90 ? "Güçlü Alan" :
    t.progress >= 65 ? "Devam Et" :
    t.progress >= 35 ? "Planlı" :
    "Eksik Var";
  const lastSeen = t.trend === "up" ? "Bugün" : t.trend === "down" ? "1 hafta önce" : "3 gün önce";

  return (
    <article className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(37,99,235,.10)]">
      <div
        className="relative h-[96px] border-b border-slate-100"
        style={{
          background: `linear-gradient(135deg, ${t.color}24 0%, ${t.color}12 52%, #F8FAFC 100%)`,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-full opacity-90"
          style={{
            background: `radial-gradient(circle at top right, ${t.color}22, transparent 42%)`,
          }}
        />
        <HeaderPattern color={t.color} variant={patternVariant} />
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-end px-5 pt-4">
          <span
            className="inline-flex rounded-full border border-white/50 bg-white/30 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.9px] backdrop-blur-[10px]"
            style={{
              color: t.color,
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {badge}
          </span>
        </div>
      </div>

      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-bold tracking-[-0.2px] text-slate-950 leading-[1.2]">
              {t.title}
            </h2>
            <p className="mt-1.5 text-[13px] font-medium text-slate-500">
              {t.category} · {t.items} içerik
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2.5">
            <span className="text-[12px] font-semibold uppercase tracking-[0.9px] text-slate-400">
              İlerleme
            </span>
            <span className="text-[13px] font-bold" style={{ color: t.color }}>
              %{t.progress}
            </span>
          </div>
          <ProgressBar value={t.progress} color={t.color} />
        </div>

        <div className="mt-4 w-full">
          <div className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-[1px] text-slate-400">
                  Eğitmen
                </div>
                <div className="mt-1 truncate text-[13px] font-semibold text-slate-700">
                  {t.instructor}
                </div>
              </div>

              <div className="min-w-0 text-right">
                <div className="text-[11px] uppercase tracking-[1px] text-slate-400">
                  Son Giriş
                </div>
                <div className="mt-1 whitespace-nowrap text-[13px] font-semibold text-slate-700">
                  {lastSeen}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Topics() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("Tümü");
  const [level, setLevel] = useState("Tümü");
  const [sort, setSort] = useState("progress-desc");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    let list = ALL_TOPICS.filter((t) => {
      if (cat !== "Tümü" && t.category !== cat) return false;
      if (level !== "Tümü" && t.level !== level) return false;
      if (q && !normalize(`${t.title} ${t.category} ${t.instructor}`).includes(q)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "progress-asc":  return a.progress - b.progress;
        case "progress-desc": return b.progress - a.progress;
        case "title":         return a.title.localeCompare(b.title, "tr");
        case "items":         return b.items - a.items;
        default:              return 0;
      }
    });
    return list;
  }, [query, cat, level, sort]);

  const stats = useMemo(() => {
    const started  = ALL_TOPICS.filter((t) => t.progress > 0).length;
    const done     = ALL_TOPICS.filter((t) => t.progress >= 90).length;
    const avg      = Math.round(ALL_TOPICS.reduce((s, t) => s + t.progress, 0) / ALL_TOPICS.length);
    return { started, done, avg };
  }, []);

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
                  <div className="h-px w-5 bg-blue-400 rounded" />
                  <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-blue-500">Konu Kütüphanesi</span>
                </div>
                <h1 className="text-[26px] font-bold tracking-[-0.4px] leading-tight">
                  <span className="inline-flex items-center gap-1">Konular <Icon name="topics" size={16} color="#2563EB" /></span>
                </h1>
                <p className="mt-1 text-[11px] text-slate-400">
                  Toplam {ALL_TOPICS.length} konu · {stats.started} başlanmış · {stats.done} tamamlanmış · ortalama %{stats.avg}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {[
                  { value: stats.started, label: "Başlandı",    color: "#2563EB" },
                  { value: stats.done,    label: "Tamamlandı",  color: "#059669" },
                  { value: `%${stats.avg}`, label: "Ortalama",  color: "#7C3AED" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 min-w-[72px]">
                    <div className="text-[17px] font-bold tracking-tight" style={{ color: s.color }}>{s.value}</div>
                    <div className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[1.5px] text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search + Sort */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus-within:border-blue-300">
                <Icon name="search" size={14} color="#94a3b8" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Konu, kategori veya eğitmen ara..."
                  className="flex-1 bg-transparent text-[11px] outline-none placeholder:text-slate-400"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="inline-flex items-center text-[10px] font-bold text-slate-300 hover:text-slate-500"><Icon name="close" size={10} color="#94a3b8" /></button>
                )}
                <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">Ctrl+K</kbd>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-bold text-slate-600 outline-none transition-all hover:border-blue-200 focus:border-blue-300"
              >
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>

            {/* Filter Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[9px] font-bold uppercase tracking-[1.5px] text-slate-400">Kategori</span>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                    cat === c
                      ? "bg-[#2563EB] text-white shadow-sm shadow-blue-200"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-[#2563EB]"
                  }`}
                >
                  {c}
                </button>
              ))}
              <span className="ml-4 mr-1 text-[9px] font-bold uppercase tracking-[1.5px] text-slate-400">Seviye</span>
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                    level === l
                      ? "bg-[#7C3AED] text-white shadow-sm shadow-purple-200"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-purple-200 hover:text-[#7C3AED]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </header>

          {/* MAIN */}
          <main className="flex-1 px-8 py-7">
            <div className="mb-4 flex items-center justify-between">
              <SectionLabel text={`${filtered.length} konu bulundu`} />
              {(cat !== "Tümü" || level !== "Tümü" || query) && (
                <button
                  onClick={() => { setCat("Tümü"); setLevel("Tümü"); setQuery(""); }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-500 transition-all hover:border-blue-200 hover:text-[#2563EB]"
                >
                  <span className="inline-flex items-center gap-1">Filtreleri Temizle <Icon name="close" size={10} color="#64748b" /></span>
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                <div className="mb-3 flex justify-center"><Icon name="search" size={32} color="#94a3b8" /></div>
                <p className="text-[12px] font-semibold text-slate-500">Sonuç bulunamadı</p>
                <p className="mt-1 text-[10px] text-slate-400">Farklı bir arama veya filtre dene.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filtered.map((t, idx) => <TopicCard key={t.title} t={t} patternVariant={idx} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
