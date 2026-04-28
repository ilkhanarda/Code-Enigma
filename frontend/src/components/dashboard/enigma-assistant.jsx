import { useMemo, useState } from "react";
import Icon from "../ui/icons8-icon.jsx";

const ENIGMA_SUGGESTIONS = [
  {
    id: "showcase",
    label: "Vitrine götür",
  },
  {
    id: "topics",
    label: "Dersleri işaretle",
  },
  {
    id: "mission",
    label: "Hedefe ışınlan",
  },
];

export default function EnigmaAssistant({
  playerName = "Kaşif",
  strongTopic,
  weakTopic,
  activeTarget,
  onSuggestionClick,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const greeting = useMemo(() => {
    const strong = strongTopic || "Rasyonel Sayılar";
    const weak = weakTopic || "Eşitsizlikler";
    return `Selam ${playerName}! ${strong} tarafında harika iş çıkardın, ${weak} tarafında ise biraz zorlandığını fark ettim. İstersen bunu oyun modunda birlikte toparlayalım.`;
  }, [playerName, strongTopic, weakTopic]);

  return (
    <div className="fixed bottom-6 right-4 z-[120] flex items-end gap-3 md:right-7">
      {isOpen && (
        <section
          id="enigma-assistant-popup"
          className="flex h-[min(520px,78vh)] w-[min(400px,calc(100vw-1rem))] flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white/95 shadow-[0_24px_44px_rgba(15,23,42,.22)] backdrop-blur-xl"
          style={{ aspectRatio: "4 / 5" }}
        >
          <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <Icon name="ai" size={16} color="#2563EB" />
              </span>
              <div>
                <p className="text-[12px] font-bold text-slate-900">Enigma</p>
                <p className="text-[9px] uppercase tracking-[1.2px] text-blue-600">Mini Rehber</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-blue-200 hover:text-blue-600"
              aria-label="Enigma penceresini kapat"
            >
              <Icon name="close" size={12} color="#64748B" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-3 py-2.5">
              <p className="text-[11px] leading-[1.6] text-slate-700">{greeting}</p>
            </div>

            <div className="space-y-2">
              {ENIGMA_SUGGESTIONS.map((item) => {
                const isActive = activeTarget === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSuggestionClick?.(item.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition-all ${
                      isActive
                        ? "border-blue-300 bg-blue-50 shadow-[0_10px_20px_rgba(37,99,235,0.16)]"
                        : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-slate-800">{item.label}</span>
                    <Icon name="next" size={12} color={isActive ? "#2563EB" : "#64748B"} />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="enigma-assistant-popup"
        aria-label="Enigma asistanını aç"
        className={`group relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all ${
          isOpen
            ? "border-blue-300 bg-white shadow-[0_16px_32px_rgba(37,99,235,0.25)]"
            : "border-white bg-gradient-to-br from-blue-500 to-cyan-500 shadow-[0_18px_34px_rgba(37,99,235,0.35)] hover:scale-[1.04]"
        }`}
      >
        {!isOpen && (
          <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-blue-300/70 animate-ping" />
        )}
        <Icon name="ai" size={24} color={isOpen ? "#2563EB" : "#FFFFFF"} />
        <span className="pointer-events-none absolute -top-2 right-0 rounded-full border border-blue-200 bg-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-[1px] text-blue-600 shadow-sm">
          Enigma
        </span>
      </button>
    </div>
  );
}
