import React, { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";

const CHAPTERS = [
  {
    id: 1,
    title: "Giriş",
    start: 0,
    end: 35,
    phase: "Bölüm 01",
    accent: "#2563EB",
    accentBg: "#EFF6FF",
    summary:
      "Bu bölümde güvenirlik katsayısının ne olduğuna ve neden önemli olduğuna genel bir bakış yapılmaktadır. Psikolojik testlerin tutarlılığını değerlendirmek için kullanılan temel kavramlar tanıtılmaktadır.",
    questions: [
      {
        q: "Güvenirlik katsayısı hangi aralıkta değer alır?",
        opts: [
          "A) 0 ile 100 arasında",
          "B) −1 ile +1 arasında",
          "C) 0 ile 1 arasında",
          "D) 1 ile 10 arasında",
          "E) Sınırsız değer alır",
        ],
        correct: 2,
        solution:
          "Güvenirlik katsayısı (rₓ) 0 ile 1 arasında değer alır. 0 tam güvensizliği, 1 ise mükemmel güvenirliği ifade eder. Negatif değer almaz çünkü varyans oranı olarak tanımlanır.",
      },
      {
        q: "Bir ölçme aracının güvenirliği ne anlama gelir?",
        opts: [
          "A) Ölçtüğü şeyi doğru ölçmesi",
          "B) Farklı koşullarda tutarlı sonuç vermesi",
          "C) Kısa sürede uygulanabilmesi",
          "D) Geniş kapsama sahip olması",
          "E) Puanlamanın kolay yapılabilmesi",
        ],
        correct: 1,
        solution:
          "Güvenirlik, ölçme aracının aynı veya benzer koşullarda tekrarlandığında tutarlı sonuçlar vermesi demektir. Bu, geçerlilikten (doğru ölçme) farklı bir kavramdır.",
      },
    ],
    flashcards: [
      {
        front: "Güvenirlik",
        back: "Bir ölçme aracının tutarlı ve tekrarlanabilir sonuçlar verme derecesi.",
      },
      {
        front: "Ölçüm Hatası",
        back: "Gözlenen puan ile gerçek puan arasındaki fark.",
      },
    ],
  },
  {
    id: 2,
    title: "Matematiksel İlişki",
    start: 35,
    end: 106,
    phase: "Bölüm 02",
    accent: "#7C3AED",
    accentBg: "#F5F3FF",
    summary:
      "ÖSH = S · √(1 − rₓ) formülü ile Ölçmenin Standart Hatası hesaplanır. Güvenirlik katsayısı 1'e yaklaştıkça kök içindeki ifade küçülür ve ÖSH değeri düşer. Bu yüksek güvenirliğin daha az ölçme hatası anlamına geldiğini gösterir.",
    questions: [
      {
        q: "ÖSH formülünde 'S' neyi temsil eder?",
        opts: [
          "A) Standart hatayı",
          "B) Testin standart sapmasını",
          "C) Örneklem büyüklüğünü",
          "D) Güvenirlik katsayısını",
          "E) Ortalama puanı",
        ],
        correct: 1,
        solution:
          "S, testin standart sapmasını temsil eder. Formül: ÖSH = S · √(1 − rₓ). Standart sapma yükseldikçe ölçüm hatası da artar.",
      },
      {
        q: "Güvenirlik katsayısı (rₓ) 1'e eşit olsaydı ÖSH ne olurdu?",
        opts: [
          "A) Maksimum olurdu",
          "B) S değerine eşit olurdu",
          "C) Sıfır olurdu",
          "D) Tanımsız olurdu",
          "E) Değişmezdi",
        ],
        correct: 2,
        solution:
          "rₓ = 1 iken: ÖSH = S · √(1−1) = S · √0 = S · 0 = 0. Mükemmel güvenirlik, sıfır ölçüm hatası anlamına gelir. Bu teorik bir üst sınırdır.",
      },
    ],
    flashcards: [
      { front: "ÖSH", back: "Ölçmenin Standart Hatası = S · √(1 − rₓ)" },
      { front: "rₓ", back: "Güvenirlik katsayısı; 0 ile 1 arasında değer alır." },
      { front: "S", back: "Testin standart sapması." },
    ],
  },
  {
    id: 3,
    title: "Güvenirlik Örnekleri",
    start: 106,
    end: 150,
    phase: "Bölüm 03",
    accent: "#059669",
    accentBg: "#ECFDF5",
    summary:
      "Yüksek güvenirlik (rₓ = 0.96) durumunda ÖSH = 5 gibi düşük bir değer elde edilirken, düşük güvenirlik (rₓ = 0.51) durumunda ÖSH = 7 gibi daha yüksek bir hata ortaya çıkar. Bu örnekler teorik ilişkiyi somutlaştırır.",
    questions: [
      {
        q: "rₓ = 0.96, S = 25 iken ÖSH yaklaşık kaçtır?",
        opts: ["A) 25", "B) 5", "C) 12", "D) 0.96", "E) 1"],
        correct: 1,
        solution:
          "ÖSH = 25 · √(1 − 0.96) = 25 · √0.04 = 25 · 0.2 = 5. Yüksek güvenirlik (0.96) çok küçük bir hata (5 puan) üretir.",
      },
      {
        q: "Hangi durum daha yüksek ölçüm hatasına yol açar?",
        opts: [
          "A) rₓ = 0.95 ve S = 10",
          "B) rₓ = 0.51 ve S = 10",
          "C) rₓ = 0.90 ve S = 15",
          "D) rₓ = 0.80 ve S = 8",
          "E) rₓ = 0.70 ve S = 6",
        ],
        correct: 1,
        solution:
          "rₓ=0.51, S=10 → ÖSH=10·√0.49≈7.0. Diğerleri: A→2.24, C→4.74, D→3.58, E→4.24. Düşük güvenirlik ve yüksek standart sapma birlikte en büyük hatayı üretir.",
      },
    ],
    flashcards: [
      { front: "Yüksek Güvenirlik", back: "rₓ ≥ 0.80 → ÖSH düşük → hassas ölçüm." },
      { front: "Düşük Güvenirlik", back: "rₓ < 0.60 → ÖSH yüksek → tutarsız ölçüm." },
    ],
  },
  {
    id: 4,
    title: "Güvenirlik Katsayısı",
    start: 150,
    end: 210,
    phase: "Bölüm 04",
    accent: "#D97706",
    accentBg: "#FFFBEB",
    summary:
      "Güvenirlik katsayısı hesaplama yöntemleri (test-tekrar test, iç tutarlılık, paralel form) karşılaştırılır. Her yöntemin avantajları ve hangi durumlarda tercih edilmesi gerektiği ele alınır.",
    questions: [
      {
        q: "Cronbach alfa katsayısı hangi güvenirlik türünü ölçer?",
        opts: [
          "A) Test-tekrar test güvenirliği",
          "B) Paralel form güvenirliği",
          "C) İç tutarlılık güvenirliği",
          "D) Gözlemciler arası güvenirlik",
          "E) Kapsam geçerliği",
        ],
        correct: 2,
        solution:
          "Cronbach alfa (α), bir testin maddelerinin birbiriyle ne kadar tutarlı olduğunu gösteren iç tutarlılık katsayısıdır. α ≥ 0.70 genellikle kabul edilebilir sınır olarak kullanılır.",
      },
      {
        q: "Test-tekrar test yönteminin temel sınırlılığı nedir?",
        opts: [
          "A) Hesaplaması çok zordur",
          "B) Sadece çoktan seçmeli testlere uygulanır",
          "C) Öğrenme ve hatırlama etkilerinden etkilenir",
          "D) Paralel form gerektirmesi",
          "E) Madde sayısına bağlı olması",
        ],
        correct: 2,
        solution:
          "Test-tekrar test yönteminde aynı test iki kez uygulanır. Bu nedenle birinci uygulamada öğrenilen bilgiler veya hatırlama etkileri ikinci uygulamayı olumlu yönde etkiler; bu da güvenirliği olduğundan yüksek gösterebilir.",
      },
    ],
    flashcards: [
      { front: "Test-Tekrar Test", back: "Aynı testin farklı zamanlarda uygulanmasıyla hesaplanan güvenirlik." },
      { front: "Cronbach Alfa", back: "İç tutarlılık katsayısı; α ≥ 0.70 genellikle kabul edilebilir." },
    ],
  },
  {
    id: 5,
    title: "Test Eşik Değeri",
    start: 210,
    end: 265,
    phase: "Bölüm 05",
    accent: "#DC2626",
    accentBg: "#FEF2F2",
    summary:
      "Bir testin kabul edilebilir güvenirlik eşiği bağlama göre değişir. Yüksek riskli kararlar için rₓ ≥ 0.90 beklenirken, araştırma ortamlarında rₓ ≥ 0.70 yeterli kabul edilebilir.",
    questions: [
      {
        q: "Bireysel klinik karar almada önerilen minimum güvenirlik eşiği nedir?",
        opts: ["A) 0.50", "B) 0.60", "C) 0.70", "D) 0.80", "E) 0.90"],
        correct: 4,
        solution:
          "Yüksek riskli bireysel kararlar (klinik tanı, yetenek seçimi) için rₓ ≥ 0.90 önerilir. Bunun altındaki değerler bireysel hataları kabul edilemez ölçüde yükseltir.",
      },
      {
        q: "Araştırma amaçlı testlerde genellikle hangi güvenirlik eşiği yeterli kabul edilir?",
        opts: ["A) 0.90 ve üzeri", "B) 0.80 ve üzeri", "C) 0.70 ve üzeri", "D) 0.60 ve üzeri", "E) 0.50 ve üzeri"],
        correct: 2,
        solution:
          "Grup düzeyinde araştırmalarda bireysel hata oranları daha az kritik olduğundan rₓ ≥ 0.70 yeterli kabul edilir. Grup ortalamaları, bireysel hatalar ortalamasıyla dengelenir.",
      },
    ],
    flashcards: [
      { front: "Klinik Eşik", back: "rₓ ≥ 0.90 — yüksek riskli bireysel kararlar." },
      { front: "Araştırma Eşiği", back: "rₓ ≥ 0.70 — grup düzeyinde araştırmalar." },
    ],
  },
];

const TOTAL = 265;
const OPTS_LABELS = ["A", "B", "C", "D", "E"];

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const getChapter = (time) => CHAPTERS.find((chapter) => time >= chapter.start && time < chapter.end) || CHAPTERS[CHAPTERS.length - 1];

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#F8F9FB",
    color: "#111827",
    fontFamily: '"IBM Plex Mono", monospace',
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: 60,
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    flexShrink: 0,
    zIndex: 50,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: 46,
    background: "#fff",
    borderTop: "1px solid #e2e8f0",
    flexShrink: 0,
  },
  main: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  logoHex: {
    clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
  },
  fadein: {
    animation: "fadein 0.35s ease both",
  },
  pulseDot: {
    animation: "pulse-dot 2s ease-in-out infinite",
  },
};

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap');

      * , *::before, *::after { box-sizing: border-box; }
      html, body, #root { margin: 0; padding: 0; height: 100%; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #f1f5f9; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

      @keyframes fadein {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.7); }
      }

      .chapter-card { transition: box-shadow 0.2s, transform 0.2s; }
      .chapter-card:hover { box-shadow: 0 4px 16px rgba(37,99,235,0.10); transform: translateY(-1px); }

      input[type=range] {
        -webkit-appearance: none;
        appearance: none;
        height: 3px;
        border-radius: 2px;
        outline: none;
        cursor: pointer;
      }

      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #fff;
        border: 2px solid #2563EB;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      }

      .opt-base {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 7px;
        border: 1px solid #e2e8f0;
        cursor: pointer;
        transition: border-color 0.15s, background 0.15s;
        font-size: 11px;
        font-family: "IBM Plex Mono", monospace;
        line-height: 1.55;
        text-align: left;
        width: 100%;
        background: #fff;
      }

      .opt-base:hover:not(:disabled) {
        border-color: #93c5fd;
        background: #EFF6FF;
      }

      .opt-correct { border-color: #059669 !important; background: #ECFDF5 !important; color: #065f46; }
      .opt-wrong { border-color: #DC2626 !important; background: #FEF2F2 !important; color: #991b1b; }
      .opt-disabled { cursor: not-allowed; opacity: 0.6; }

      .solution-box {
        animation: fadein 0.3s ease both;
        margin-top: 10px;
        padding: 14px;
        background: #FFFBEB;
        border: 1px solid #D97706;
        border-left: 3px solid #D97706;
        border-radius: 8px;
        font-size: 11px;
        line-height: 1.75;
        color: #374151;
      }
    `}</style>
  );
}

function ChapterTimeline({ currentTime, duration, onSeek }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(null);
  const [dragging, setDragging] = useState(false);

  const getRatio = (event) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  };

  useEffect(() => {
    const handleMouseUp = () => setDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div style={{ position: "relative", padding: "4px 0 0" }}>
      {hover && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: Math.max(36, Math.min(hover.px, (ref.current?.offsetWidth || 300) - 80)),
            transform: "translateX(-40%)",
            background: "#111827",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.5px",
            padding: "4px 10px",
            borderRadius: 3,
            pointerEvents: "none",
            zIndex: 20,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {hover.chapter.title} · {fmt(hover.ratio * duration)}
        </div>
      )}


      <div
        ref={ref}
        style={{ display: "flex", gap: 3, cursor: "pointer", userSelect: "none" }}
        onMouseMove={(event) => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const px = event.clientX - rect.left;
          const ratio = px / rect.width;
          const safeRatio = Math.max(0, Math.min(1, ratio));
          setHover({ ratio: safeRatio, px, chapter: getChapter(safeRatio * duration) });
          if (dragging) onSeek(safeRatio * duration);
        }}
        onMouseLeave={() => setHover(null)}
        onMouseDown={(event) => {
          setDragging(true);
          onSeek(getRatio(event) * duration);
        }}
      >
        {CHAPTERS.map((chapter) => {
          const width = ((chapter.end - chapter.start) / duration) * 100;
          const progress =
            currentTime <= chapter.start
              ? 0
              : currentTime >= chapter.end
                ? 100
                : ((currentTime - chapter.start) / (chapter.end - chapter.start)) * 100;
          const isActive = currentTime >= chapter.start && currentTime < chapter.end;

          return (
            <div
              key={chapter.id}
              style={{
                flex: `0 0 calc(${width}% - 2px)`,
                height: isActive ? 7 : 4,
                marginTop: isActive ? 0 : 1.5,
                borderRadius: 2,
                background: "rgba(255,255,255,0.12)",
                overflow: "hidden",
                transition: "height 0.15s, margin-top 0.15s",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: chapter.accent,
                  transition: dragging ? "none" : "width 0.1s linear",
                }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 3, marginTop: 5 }}>
        {CHAPTERS.map((chapter) => {
          const width = ((chapter.end - chapter.start) / duration) * 100;
          const isActive = currentTime >= chapter.start && currentTime < chapter.end;

          return (
            <div
              key={chapter.id}
              onClick={() => onSeek(chapter.start)}
              style={{
                flex: `0 0 calc(${width}% - 2px)`,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: 9,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? chapter.accent : "rgba(255,255,255,0.3)",
                letterSpacing: "0.04em",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
            >
              {chapter.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Controls({ playing, currentTime, duration, volume, muted, onPlay, onSeek, onVolume, onMute, onFullscreen }) {
  const chapter = getChapter(currentTime);

  return (
    <div
      style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)",
        padding: "32px 18px 14px",
      }}
    >
      <ChapterTimeline currentTime={currentTime} duration={duration} onSeek={onSeek} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
        <button onClick={onPlay} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", padding: 3, borderRadius: 4 }}>
          {playing ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <button onClick={onMute} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", padding: 3 }}>
          {muted || volume === 0 ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2.5" />
              <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={muted ? 0 : volume}
          onChange={(event) => onVolume(parseFloat(event.target.value))}
          style={{
            width: 52,
            background: `linear-gradient(to right, ${chapter.accent} ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 0%)`,
          }}
        />

        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: '"IBM Plex Mono", monospace' }}>
          <span style={{ color: "#fff" }}>{fmt(currentTime)}</span> / {fmt(duration)}
        </span>

        <div style={{ flex: 1 }} />

        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: chapter.accent,
            background: `${chapter.accent}22`,
            border: `1px solid ${chapter.accent}44`,
            padding: "3px 9px",
            borderRadius: 3,
          }}
        >
          {chapter.phase}
        </div>

        <button onClick={onFullscreen} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", padding: 3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ChapterSidebar({ currentTime, onSeek }) {
  return (
    <div
      style={{
        width: 152,
        minWidth: 152,
        background: "#fff",
        borderRight: "1px solid #e2e8f0",
        overflowY: "auto",
        padding: "10px 7px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94a3b8", padding: "4px 6px 8px" }}>
        İçindekiler
      </div>

      {CHAPTERS.map((chapter) => {
        const isActive = currentTime >= chapter.start && currentTime < chapter.end;
        const isDone = currentTime >= chapter.end;

        return (
          <div
            key={chapter.id}
            onClick={() => onSeek(chapter.start)}
            className="chapter-card"
            style={{
              borderRadius: 8,
              overflow: "hidden",
              cursor: "pointer",
              border: `1px solid ${isActive ? `${chapter.accent}55` : "#e2e8f0"}`,
              background: isActive ? chapter.accentBg : "#fff",
              transition: "all 0.2s",
            }}
          >
            <div style={{ height: 3, background: isDone ? chapter.accent : isActive ? chapter.accent : "#e2e8f0", transition: "background 0.3s" }} />
            <div style={{ padding: "8px 10px 10px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: isActive ? chapter.accent : "#cbd5e1", marginBottom: 3 }}>
                {chapter.phase}
              </div>
              <div style={{ fontSize: 11, fontWeight: isActive ? 600 : 400, color: isActive ? "#111827" : "#64748b", lineHeight: 1.4 }}>
                {chapter.title}
              </div>
              <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 3 }}>
                {fmt(chapter.start)}–{fmt(chapter.end)}
              </div>
              {isDone && <div style={{ fontSize: 9, color: chapter.accent, marginTop: 4, fontWeight: 600 }}>✓ Tamamlandı</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TabSummary({ chapter }) {
  return (
    <div style={{ padding: "16px 0", animation: "fadein 0.35s ease both" }}>
      <p style={{ fontSize: 12, lineHeight: 1.85, color: "#475569", fontWeight: 300 }}>{chapter.summary}</p>
    </div>
  );
}

function TabQuestion({ chapter }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const resetQuestion = (index) => {
    setQuestionIndex(index);
    setSelected(null);
    setShowSolution(false);
  };

  useEffect(() => {
    resetQuestion(0);
  }, [chapter.id]);

  const questions = chapter.questions;
  const question = questions[questionIndex];
  const answered = selected !== null;
  const isCorrect = selected === question.correct;

  return (
    <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 10, animation: "fadein 0.35s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94a3b8" }}>
          Soru {questionIndex + 1} / {questions.length}
        </span>

        <div style={{ display: "flex", gap: 5 }}>
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => resetQuestion(index)}
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                border: `1px solid ${index === questionIndex ? chapter.accent : "#e2e8f0"}`,
                background: index === questionIndex ? chapter.accentBg : "#fff",
                color: index === questionIndex ? chapter.accent : "#94a3b8",
                fontSize: 9,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: '"IBM Plex Mono", monospace',
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#F8F9FB", border: "1px solid #e2e8f0", borderLeft: `3px solid ${chapter.accent}`, borderRadius: 8, padding: "12px 14px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94a3b8", marginBottom: 8 }}>Soru</div>
        <p style={{ fontSize: 12, color: "#111827", lineHeight: 1.7, fontWeight: 500 }}>{question.q}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {question.opts.map((option, index) => {
          let className = "opt-base";
          if (answered) {
            if (index === question.correct) className += " opt-correct";
            else if (index === selected && !isCorrect) className += " opt-wrong";
            else className += " opt-disabled";
          }

          return (
            <button key={index} className={className} disabled={answered} onClick={() => setSelected(index)}>
              <span
                style={{
                  minWidth: 20,
                  color:
                    answered && index === question.correct
                      ? "#059669"
                      : answered && index === selected && !isCorrect
                        ? "#DC2626"
                        : "#64748b",
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1.55,
                  flexShrink: 0,
                }}
              >
                {OPTS_LABELS[index]})
              </span>

              <span style={{ fontSize: 11, lineHeight: 1.55, flex: 1 }}>{option.slice(3)}</span>

              {answered && index === question.correct && (
                <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}

              {answered && index === selected && !isCorrect && index !== question.correct && (
                <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "fadein 0.35s ease both" }}>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 7,
              background: isCorrect ? "#ECFDF5" : "#FEF2F2",
              border: `1px solid ${isCorrect ? "#059669" : "#DC2626"}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {isCorrect ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}

            <span style={{ fontSize: 11, fontWeight: 700, color: isCorrect ? "#065f46" : "#991b1b" }}>
              {isCorrect ? "Doğru cevap!" : `Yanlış. Doğru cevap: ${OPTS_LABELS[question.correct]}`}
            </span>
          </div>

          {!showSolution ? (
            <button
              onClick={() => setShowSolution(true)}
              style={{
                background: "#FFFBEB",
                border: "1px solid #D97706",
                color: "#92400e",
                padding: "9px 12px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: '"IBM Plex Mono", monospace',
                display: "flex",
                alignItems: "center",
                gap: 7,
                justifyContent: "center",
                transition: "background .15s",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Çözümü Gör
            </button>
          ) : (
            <div className="solution-box">
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#D97706", marginBottom: 8 }}>Çözüm</div>
              {question.solution}
            </div>
          )}
        </div>
      )}

      {answered && questionIndex < questions.length - 1 && (
        <button
          onClick={() => resetQuestion(questionIndex + 1)}
          style={{
            background: chapter.accentBg,
            border: `1px solid ${chapter.accent}44`,
            color: chapter.accent,
            padding: "9px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: '"IBM Plex Mono", monospace',
            marginTop: 2,
          }}
        >
          Sonraki Soru →
        </button>
      )}

      {answered && questionIndex === questions.length - 1 && (
        <button
          onClick={() => resetQuestion(0)}
          style={{
            background: "#F8F9FB",
            border: "1px solid #e2e8f0",
            color: "#64748b",
            padding: "9px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 11,
            fontFamily: '"IBM Plex Mono", monospace',
            marginTop: 2,
          }}
        >
          Baştan Başla
        </button>
      )}
    </div>
  );
}

function TabFlashcards({ chapter }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [chapter.id]);

  const cards = chapter.flashcards;
  const card = cards[index];

  return (
    <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 10, animation: "fadein 0.35s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#94a3b8" }}>
          {index + 1} / {cards.length}
        </span>

        <div style={{ display: "flex", gap: 4 }}>
          {cards.map((_, dotIndex) => (
            <div
              key={dotIndex}
              onClick={() => {
                setIndex(dotIndex);
                setFlipped(false);
              }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: dotIndex === index ? chapter.accent : "#e2e8f0",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>
      </div>

      <div onClick={() => setFlipped(!flipped)} style={{ perspective: 600, cursor: "pointer" }}>
        <div
          style={{
            position: "relative",
            height: 114,
            transformStyle: "preserve-3d",
            transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: "#F8F9FB",
              border: "1px solid #e2e8f0",
              borderTop: `3px solid ${chapter.accent}`,
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94a3b8", marginBottom: 8 }}>Kavram</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{card.front}</div>
            <div style={{ fontSize: 9, color: "#cbd5e1", marginTop: 10 }}>Çevirmek için tıkla →</div>
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: chapter.accentBg,
              border: `1px solid ${chapter.accent}44`,
              borderTop: `3px solid ${chapter.accent}`,
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: chapter.accent, marginBottom: 8 }}>Tanım</div>
            <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.65, fontWeight: 400 }}>{card.back}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {[
          ["← Önceki", Math.max(0, index - 1), index === 0],
          ["Sonraki →", Math.min(cards.length - 1, index + 1), index === cards.length - 1],
        ].map(([label, nextIndex, disabled]) => (
          <button
            key={label}
            onClick={() => {
              setIndex(nextIndex);
              setFlipped(false);
            }}
            disabled={disabled}
            style={{
              flex: 1,
              background: "none",
              border: "1px solid #e2e8f0",
              color: disabled ? "#cbd5e1" : "#374151",
              borderRadius: 6,
              padding: "7px",
              cursor: disabled ? "not-allowed" : "pointer",
              fontSize: 11,
              fontFamily: '"IBM Plex Mono", monospace',
              transition: "border-color 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContentPanel({ chapter, visible }) {
  const [tab, setTab] = useState("summary");

  useEffect(() => {
    setTab("summary");
  }, [chapter?.id]);

  if (!visible) {
    return (
      <div
        style={{
          width: 300,
          minWidth: 300,
          background: "#fff",
          borderLeft: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <div style={{ width: 44, height: 44, background: "#EFF6FF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#374151", fontWeight: 600, letterSpacing: "0.3px", marginBottom: 4 }}>Panel Kapalı</p>
          <p style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.6, maxWidth: 140 }}>Videoyu durdurunca içerik paneli açılır</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "summary", label: "Özet", icon: "◈" },
    { id: "question", label: "Soru", icon: "⌖" },
    { id: "flashcards", label: "Kartlar", icon: "◎" },
  ];

  return (
    <div style={{ width: 300, minWidth: 300, background: "#fff", borderLeft: "1px solid #e2e8f0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #e2e8f0", background: chapter.accentBg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <div style={{ width: 16, height: 2, background: chapter.accent, borderRadius: 1 }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: chapter.accent }}>{chapter.phase}</span>
        </div>
        <h2 style={{ fontWeight: 700, fontSize: 15, color: "#111827", letterSpacing: "-0.3px", lineHeight: 1.3, margin: 0 }}>{chapter.title}</h2>
        <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
          {fmt(chapter.start)} – {fmt(chapter.end)}
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", background: "#fff" }}>
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              flex: 1,
              padding: "10px 4px",
              background: "none",
              border: "none",
              borderBottom: tab === item.id ? `2px solid ${chapter.accent}` : "2px solid transparent",
              color: tab === item.id ? chapter.accent : "#94a3b8",
              fontFamily: '"IBM Plex Mono", monospace',
              fontWeight: 700,
              fontSize: 9,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color 0.15s,border-color 0.15s",
            }}
          >
            <div style={{ fontSize: 14, marginBottom: 2 }}>{item.icon}</div>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {tab === "summary" && <TabSummary chapter={chapter} key={chapter.id} />}
        {tab === "question" && <TabQuestion chapter={chapter} key={chapter.id} />}
        {tab === "flashcards" && <TabFlashcards chapter={chapter} key={chapter.id} />}
      </div>

      <div style={{ padding: "12px 20px", borderTop: "1px solid #e2e8f0", display: "flex", gap: 10 }}>
        {[
          { value: chapter.questions.length, label: "Soru" },
          { value: chapter.flashcards.length, label: "Kart" },
          { value: fmt(chapter.end - chapter.start), label: "Süre" },
        ].map((stat) => (
          <div key={stat.label} style={{ flex: 1, background: "#F8F9FB", border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px", textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{stat.value}</div>
            <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 1 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Video2() {
  const containerRef = useRef(null);
  const tickRef = useRef(null);
  const hideTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    if (playing) {
      tickRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL) {
            setPlaying(false);
            return TOTAL;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      clearInterval(tickRef.current);
    }

    return () => clearInterval(tickRef.current);
  }, [playing]);

  useEffect(() => {
    return () => clearTimeout(hideTimer.current);
  }, []);

  const handlePlayToggle = () => {
    const nextPlaying = !playing;
    setPlaying(nextPlaying);
    setPanelOpen(!nextPlaying);
  };

  const showControls = () => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 2500);
    }
  };

  const currentChapter = getChapter(currentTime);

  return (
    <>
      <GlobalStyles />

      <div style={styles.app}>
        <header style={styles.header}>
          <Link to="/" className="flex flex-col items-center gap-2 no-underline">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-[#2563EB] text-white font-bold text-[11px] tracking-tighter" style={styles.logoHex}>C:E</div>              
              <div>
                <p className="font-bold text-[15px] tracking-tight text-[#111827]">Code:Enigma</p>
                <p className="text-[9px] font-medium tracking-[1.8px] uppercase text-slate-400 mt-px">Uzaktan Eğitim Platformu</p>
              </div>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8" }}>
            <span style={{ color: "#64748b" }}>Güvenirlik Katsayısı</span>
            <span>›</span>
            <span style={{ color: currentChapter.accent, fontWeight: 600 }}>{currentChapter.title}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ ...styles.pulseDot, width: 5, height: 5, borderRadius: "50%", background: playing ? "#059669" : "#94a3b8" }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: playing ? "#059669" : "#94a3b8" }}>
              {playing ? "Oynatılıyor" : "Durduruldu"}
            </span>
          </div>
        </header>

        <div style={styles.main}>

          <DashboardNavbar />

          <ChapterSidebar currentTime={currentTime} onSeek={setCurrentTime} />

          <div
            ref={containerRef}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "#0f172a",
              position: "relative",
              minWidth: 0,
              cursor: "pointer",
            }}
            onMouseMove={showControls}
            onClick={handlePlayToggle}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `radial-gradient(ellipse at 30% 40%, ${currentChapter.accent}18 0%, #0f172a 65%)`,
                transition: "background 0.6s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: currentChapter.accent,
                  background: `${currentChapter.accent}22`,
                  border: `1px solid ${currentChapter.accent}44`,
                  padding: "3px 10px",
                  borderRadius: 3,
                }}
              >
                {currentChapter.phase}
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(2px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderLeft: `3px solid ${currentChapter.accent}`,
                  borderRadius: 12,
                  padding: "28px 36px",
                  maxWidth: 520,
                  width: "78%",
                  transition: "border-color 0.4s",
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: currentChapter.accent, marginBottom: 12 }}>
                  {currentChapter.phase} — {currentChapter.title}
                </div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#f1f5f9", marginBottom: 14, letterSpacing: "-0.3px", lineHeight: 1.3 }}>
                  {currentChapter.title}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, fontWeight: 300 }}>
                  {currentChapter.summary.slice(0, 140)}…
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  width: 62,
                  height: 62,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: playing ? 0 : 1,
                  transition: "opacity 0.2s",
                  pointerEvents: "none",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                opacity: controlsVisible || !playing ? 1 : 0,
                transition: "opacity 0.3s",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <Controls
                playing={playing}
                currentTime={currentTime}
                duration={TOTAL}
                volume={volume}
                muted={muted}
                onPlay={handlePlayToggle}
                onSeek={(time) => setCurrentTime(Math.max(0, Math.min(TOTAL, time)))}
                onVolume={(nextVolume) => {
                  setVolume(nextVolume);
                  setMuted(nextVolume === 0);
                }}
                onMute={() => setMuted((prev) => !prev)}
                onFullscreen={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    containerRef.current?.requestFullscreen();
                  }
                }}
              />
            </div>
          </div>

          <ContentPanel chapter={currentChapter} visible={panelOpen} />
        </div>

        <footer style={styles.footer}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ ...styles.logoHex, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", background: "#2563EB", color: "#fff", fontWeight: 700, fontSize: 8 }}>
              C:E
            </div>
            <span style={{ fontWeight: 600, fontSize: 12, color: "#111827" }}>Code:Enigma</span>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {[
              { label: "Cebir", value: 72, color: "#2563EB" },
              { label: "Geometri", value: 48, color: "#7C3AED" },
              { label: "Sayı Teorisi", value: 91, color: "#059669" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 36, height: 3, background: "#e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${item.value}%`, height: "100%", background: item.color }} />
                </div>
                <span style={{ fontSize: 9, color: "#64748b" }}>
                  {item.label} <span style={{ color: item.color, fontWeight: 600 }}>{item.value}%</span>
                </span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>© {new Date().getFullYear()} Açık ve Uzaktan Eğitim Projesi</p>
        </footer>
      </div>
    </>
  );
}
