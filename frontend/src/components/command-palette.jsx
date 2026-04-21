import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./ui/icons8-icon.jsx";

const COMMANDS = [
  { id: "home", label: "Ana Sayfa", hint: "Public", icon: "home", to: "/", kind: "Sayfa" },
  { id: "dashboard", label: "Panel", hint: "Dashboard", icon: "dashboard", to: "/dashboard", kind: "Sayfa" },
  { id: "topics", label: "Konular", hint: "Kütüphane", icon: "topics", to: "/topics", kind: "Sayfa" },
  { id: "test", label: "Testler", hint: "Güvenirlik", icon: "test", to: "/test", kind: "Sayfa" },
  { id: "gaps", label: "Eksiklerim", hint: "Analiz", icon: "warning", to: "/gaps", kind: "Sayfa" },
  { id: "video", label: "Video Dersler", hint: "İzleme", icon: "video", to: "/video", kind: "Sayfa" },
  { id: "profile", label: "Profil", hint: "Hesap", icon: "profile", to: "/profile", kind: "Sayfa" },
  { id: "settings", label: "Ayarlar", hint: "Sistem", icon: "settings", to: "/settings", kind: "Sayfa" },
  { id: "absent", label: "Devamsızlık", hint: "Durum", icon: "tasks", to: "/absent", kind: "Sayfa" },
  { id: "t-algebra", label: "Temel Kavramlar", hint: "Cebir", icon: "goals", to: "/topics", kind: "Konu" },
  { id: "t-digits", label: "Sayı Basamakları", hint: "Aritmetik", icon: "stats", to: "/topics", kind: "Konu" },
  { id: "t-rational", label: "Rasyonel Sayılar", hint: "Sayı Teorisi", icon: "journey", to: "/topics", kind: "Konu" },
  { id: "t-eq", label: "Denklemler", hint: "Cebir", icon: "tasks", to: "/topics", kind: "Konu" },
  { id: "t-ineq", label: "Eşitsizlikler", hint: "Canlı", icon: "module", to: "/topics", kind: "Konu" },
  { id: "t-func", label: "Fonksiyonlar", hint: "Analiz", icon: "target", to: "/topics", kind: "Konu" },
  { id: "t-geom", label: "Geometri", hint: "Uzay", icon: "module", to: "/topics", kind: "Konu" },
  { id: "q-guv", label: "Güvenirlik Testi", hint: "Psikoloji", icon: "brain", to: "/test", kind: "Test" },
];

function normalize(s) {
  return s
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u");
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      const isK = e.key === "k" || e.key === "K";
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = normalize(query.trim());
    return COMMANDS.filter((c) =>
      normalize(c.label).includes(q) ||
      normalize(c.hint).includes(q) ||
      normalize(c.kind).includes(q)
    );
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const run = (cmd) => {
    setOpen(false);
    if (cmd?.to) navigate(cmd.to);
  };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(filtered[active]);
    }
  };

  if (!open) return null;

  const groups = filtered.reduce((acc, c) => {
    (acc[c.kind] ||= []).push(c);
    return acc;
  }, {});

  let globalIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-900/40 backdrop-blur-sm px-4 pt-[12vh] font-['IBM_Plex_Mono',monospace]"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="w-full max-w-[580px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <Icon name="search" size={16} color="#94a3b8" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Ara: konu, test, sayfa..."
            className="flex-1 bg-transparent text-[13px] text-[#111827] placeholder:text-slate-400 outline-none"
          />
          <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-[11px] text-slate-400">
              Sonuç bulunamadı
            </div>
          ) : (
            Object.entries(groups).map(([group, items]) => (
              <div key={group} className="mb-1">
                <div className="px-4 py-1.5 text-[9px] font-bold uppercase tracking-[2px] text-slate-400">
                  {group}
                </div>
                {items.map((c) => {
                  globalIndex++;
                  const isActive = globalIndex === active;
                  return (
                    <button
                      key={c.id}
                      onMouseEnter={() => setActive(globalIndex)}
                      onClick={() => run(c)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isActive ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-[13px] ${
                          isActive ? "bg-[#2563EB] text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon
                          name={c.icon}
                          size={13}
                          color={isActive ? "#ffffff" : "#64748b"}
                        />
                      </span>
                      <span className={`flex-1 text-[12px] font-semibold ${isActive ? "text-[#111827]" : "text-slate-700"}`}>
                        {c.label}
                      </span>
                      <span className="text-[10px] text-slate-400">{c.hint}</span>
                      {isActive && (
                        <kbd className="rounded-md border border-blue-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#2563EB]">
                          ⏎
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-[9px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-bold">↑↓</kbd> gezin
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-bold">⏎</kbd> git
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-bold">Ctrl</kbd>
            <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-bold">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
