import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/public/navbar.jsx';
import Footer from './components/public/footer.jsx';

const centerImages = [
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
];

const orbitMathIcons = ["∑", "π", "∫", "√", "∆", "∞", "Ω", "λ", "σ", "∇"];

const features = [
  { num: "01", icon: "◈", title: "Tanışma ve Adaptasyon",      desc: "Sisteme giriş sürecinde kapsamlı seviye analizi yapılarak öğrencinin başlangıç noktası belirlenir." },
  { num: "02", icon: "⌖", title: "Dinamik Seviye Belirleme",   desc: "Performans verilerine göre anlık güncellenen kişiselleştirilmiş öğrenme rotası oluşturulur." },
  { num: "03", icon: "◎", title: "Gelişim Odaklı Görevler",    desc: "Haftalık hedeflere göre atanan görevler, eksik kazanımların kapatılmasına öncelik verir." },
  { num: "04", icon: "⬡", title: "Etkileşimli Ortak Çalışma", desc: "Grup bazlı analitik problem çözme seansları ile iş birlikli öğrenme deneyimi sunulur." },
  { num: "05", icon: "◉", title: "Performans Sistemi",          desc: "Sürekli gelişim takibi ve motivasyon mekanizmaları ile öğrenci bağlılığı en üst düzeyde tutulur." },
  { num: "06", icon: "◫", title: "Kazanım Değerlendirme",       desc: "Kazanım bazlı detaylı analitik raporlar ile öğrenci, veli ve öğretmen bilgilendirilir." },
];

const modules = [
  {
    phase: "Faz 01", num: "01", title: "Başlangıç Modülü",
    desc: "Temel konu anlatımları, adım adım yapılandırılmış örnekler ve kavrama testleri ile temeller atılır.",
    tags: ["Konu Anlatımı", "Örnekler", "Kavrama Testleri"],
    accent: "#2563EB", accentBg: "#EFF6FF",
  },
  {
    phase: "Faz 02", num: "02", title: "Orta Düzey Modülü",
    desc: "Kazanım pekiştirme soruları, ara değerlendirme sınavları ve analitik problemlerle derinleşilir.",
    tags: ["Pekiştirme", "Ara Sınavlar", "Analitik Sorular"],
    accent: "#7C3AED", accentBg: "#F5F3FF",
  },
  {
    phase: "Faz 03", num: "03", title: "İleri Düzey Modülü",
    desc: "Karmaşık problem çözme görevleri, zamanlı denemeler ve rekabetçi modüller ile ustalık kazanılır.",
    tags: ["Zamanlı Denemeler", "Rekabetçi Mod", "Olimpiyat"],
    accent: "#059669", accentBg: "#ECFDF5",
  },
];

const weeklyTasks = [
  { title: "Rasyonel Sayılar: Modül 1'i tamamla",   status: "Bekliyor",     points: "50"  },
  { title: "Grup Çalışması: Karma test çözümü",       status: "Devam Ediyor", points: "100" },
  { title: "Haftalık Kazanım Değerlendirme Sınavı",  status: "Kilitli",      points: "75"  },
  { title: "Hız Testi: Denklemler",                  status: "Kilitli",      points: "120" },
  { title: "Problem Çözümü: Yüzdeler tekrar seti",   status: "Kilitli",      points: "90"  },
  { title: "Mini Deneme: Temel Geometri",            status: "Kilitli",      points: "110" },
];

const progressItems = [
  { label: "Cebir",        value: 72, color: "#2563EB" },
  { label: "Geometri",     value: 48, color: "#7C3AED" },
  { label: "Sayı Teorisi", value: 91, color: "#059669" },
];

const miniStats = [
  { val: "345", unit: "pt",  label: "Toplam Puan" },
  { val: "12",  unit: "gün", label: "Seri"         },
  { val: "84",  unit: "%",   label: "Başarı Oranı" },
  { val: "3",   unit: "/4",  label: "Görev"        },
];

function StatusBadge({ status }) {
  const styles = {
    "Bekliyor":     "text-amber-700 bg-amber-50 border border-amber-200",
    "Devam Ediyor": "text-blue-700  bg-blue-50  border border-blue-200",
    "Kilitli":      "text-slate-400 bg-slate-50 border border-slate-200",
  };
  return (
    <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.75 rounded-sm ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function MathLearningPlatform() {
  const [currentCenterIndex, setCurrentCenterIndex] = useState(0);
  const [imgOpacity, setImgOpacity] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setImgOpacity(0);
      setTimeout(() => {
        setCurrentCenterIndex((prev) => (prev + 1) % centerImages.length);
        setImgOpacity(1);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111827] overflow-x-hidden">

      <style>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 72px;
        }
        * { font-family: 'IBM Plex Mono', monospace; }

        @keyframes spin-ring {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes spin-ring-ccw {
          from { transform: translate(-50%,-50%) rotate(360deg); }
          to   { transform: translate(-50%,-50%) rotate(0deg); }
        }
        @keyframes spin-item-reverse {
          from { transform: translate(-50%,-50%) rotate(360deg) rotateX(-72deg) translateZ(20px); }
          to   { transform: translate(-50%,-50%) rotate(0deg)   rotateX(-72deg) translateZ(20px); }
        }
        @keyframes spin-item-ccw-reverse {
          from { transform: translate(-50%,-50%) rotate(0deg)   rotateX(-72deg) translateZ(20px); }
          to   { transform: translate(-50%,-50%) rotate(360deg) rotateX(-72deg) translateZ(20px); }
        }
        .orbit-container  { perspective:1200px; transform-style:preserve-3d; }
        .orbit-tilt-plane {
          position:absolute; top:50%; left:50%; width:100%; height:100%;
          transform:translate(-50%,-50%) rotateX(72deg) rotateY(-5deg);
          transform-style:preserve-3d;
        }
        .orbit-ring {
          position:absolute; top:50%; left:50%;
          border-radius:50%;
          border:1.5px solid rgba(37,99,235,0.15);
          transform-style:preserve-3d;
        }
        .orbit-item-wrapper {
          position:absolute; border-radius:50%; overflow:hidden;
          border:1.5px solid #e2e8f0;
          background:#fff;
          box-shadow:0 4px 16px rgba(0,0,0,0.08);
          transform-style:preserve-3d;
          display:flex; align-items:center; justify-content:center;
          font-family:'Cambria Math',serif;
          color:#2563EB;
        }
        .ring-1 { width:320px;height:320px; animation:spin-ring 30s linear infinite; }
        .ring-1 .orbit-item-wrapper { animation:spin-item-reverse 30s linear infinite; }
        .ring-2 { width:520px;height:520px; animation:spin-ring-ccw 50s linear infinite; }
        .ring-2 .orbit-item-wrapper { animation:spin-item-ccw-reverse 50s linear infinite; }
        .ring-3 { width:820px;height:820px; animation:spin-ring-ccw 70s linear infinite; }
        .ring-3 .orbit-item-wrapper { animation:spin-item-ccw-reverse 70s linear infinite; }

        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }
        .pulse-dot { animation:pulse-dot 2s ease-in-out infinite; }

        @keyframes fadein {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .hero-animate > * { animation:fadein 0.65s ease both; }
        .hero-animate > *:nth-child(1){ animation-delay:0.05s; }
        .hero-animate > *:nth-child(2){ animation-delay:0.15s; }
        .hero-animate > *:nth-child(3){ animation-delay:0.25s; }
        .hero-animate > *:nth-child(4){ animation-delay:0.35s; }
        .hero-animate > *:nth-child(5){ animation-delay:0.45s; }

        .nav-link { position:relative; }
        .nav-link::after {
          content:''; position:absolute; bottom:-3px; left:0; right:0;
          height:1.5px; background:#2563EB;
          transform:scaleX(0); transition:transform 0.2s; transform-origin:left;
        }
        .nav-link:hover::after { transform:scaleX(1); }

        .feature-card { transition:box-shadow 0.2s, transform 0.2s; }
        .feature-card:hover { border: 1px solid #b3c1e0; box-shadow:0 8px 32px rgba(37,99,235,0.10); transform:translateY(-2px); }

        .module-card { transition:box-shadow 0.25s, transform 0.2s; }
        .module-card:hover { box-shadow:0 12px 40px rgba(0,0,0,0.10); transform:translateY(-4px); }

        .logo-hex { clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); }

        .prog-fill::after {
          content:''; position:absolute; right:-4px; top:50%;
          transform:translateY(-50%);
          width:8px; height:8px; border-radius:50%;
          background:currentColor; border:2px solid #F8F9FB;
        }
      `}</style>

      <Navbar />

      <main>
        {/* HERO */}
        <section id="anasayfa" className="relative grid grid-cols-1 md:grid-cols-2 items-center min-h-[calc(100vh-64px)] px-25 bg-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage:"radial-gradient(circle, #cbd5e1 1px, transparent 1px)", backgroundSize:"28px 28px", opacity:0.5 }} />
          <div className="absolute top-0 right-0 w-150 h-150 pointer-events-none"
            style={{ background:"radial-gradient(circle at 80% 20%, rgba(37,99,235,0.07) 0%, transparent 65%)" }} />

          <div className="relative z-10 pr-8 py-16 hero-animate">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-[5px] rounded-full mb-7">
              <div className="pulse-dot w-[5px] h-[5px] rounded-full bg-blue-500" />
              <span className="text-[10px] font-semibold tracking-[2px] uppercase text-blue-600">Akademik Gelişim Programı</span>
            </div>

            <h2 className="font-bold text-[clamp(30px,3.2vw,44px)] leading-[1.15] tracking-[-0.5px] text-[#111827] mb-5">
              Hedefe Yönelik<br />
              <span className="text-[#2563EB]">Matematik</span><br />
              Eğitimi
            </h2>

            <p className="text-[14px] leading-[1.8] font-light text-slate-500 max-w-110 mb-9">
              Öğrencinin anlık durumunu analiz eden, eksik kazanımları tespit ederek kişiselleştirilmiş çalışma programları sunan yeni nesil eğitim yönetim sistemi.
            </p>

            <div className="flex flex-wrap gap-3 items-center mb-12">
              <Link to="/dashboard"className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium px-7 py-3 rounded-md border-none cursor-pointer transition-all hover:-translate-y-px flex items-center gap-2 shadow-md shadow-blue-200 no-underline">Sisteme Giriş Yap <span>→</span></Link>
              <button className="text-[13px] font-medium text-slate-600 hover:text-[#111827] border border-slate-200 hover:border-slate-300 bg-white px-6 py-3 rounded-md cursor-pointer transition-all">
                Platformu İncele
              </button>
            </div>

            <div className="flex gap-8 items-center">
              {[{num:"2.4K",label:"Aktif Öğrenci"},{num:"98%",label:"Başarı Oranı"},{num:"340+",label:"Modül İçeriği"}].map((s,i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="w-px h-8 bg-slate-200" />}
                  <div>
                    <div className="font-bold text-[22px] tracking-tight text-[#111827]">{s.num}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{s.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ORBIT — UNCHANGED */}
          <div className="orbit-container relative flex h-150 w-full items-center justify-center">
            <div className="orbit-tilt-plane">
              <div className="orbit-ring ring-3">
                <div className="orbit-item-wrapper" style={{top:"50%",left:"100%",width:60,height:60,fontSize:26}}>{orbitMathIcons[4]}</div>
                <div className="orbit-item-wrapper" style={{top:"5%",left:"65%",width:50,height:50,fontSize:22}}>{orbitMathIcons[5]}</div>
                <div className="orbit-item-wrapper" style={{top:"20%",left:"10%",width:50,height:50,fontSize:22}}>{orbitMathIcons[6]}</div>
                <div className="orbit-item-wrapper" style={{top:"80%",left:"10%",width:68,height:68,fontSize:30}}>{orbitMathIcons[7]}</div>
                <div className="orbit-item-wrapper" style={{top:"95%",left:"65%",width:68,height:68,fontSize:30}}>{orbitMathIcons[8]}</div>
              </div>
              <div className="orbit-ring ring-2">
                <div className="orbit-item-wrapper" style={{top:"50%",left:"100%",width:64,height:64,fontSize:28}}>{orbitMathIcons[0]}</div>
                <div className="orbit-item-wrapper" style={{top:"0%",left:"50%",width:72,height:72,fontSize:32}}>{orbitMathIcons[1]}</div>
                <div className="orbit-item-wrapper" style={{top:"50%",left:"0%",width:64,height:64,fontSize:28}}>{orbitMathIcons[2]}</div>
                <div className="orbit-item-wrapper" style={{top:"100%",left:"50%",width:56,height:56,fontSize:24}}>{orbitMathIcons[3]}</div>
              </div>
              <div className="orbit-ring ring-1">
                <div className="orbit-item-wrapper" style={{top:"14.6%",left:"85.4%",width:56,height:56,fontSize:24}}>{orbitMathIcons[4]}</div>
                <div className="orbit-item-wrapper" style={{top:"85.4%",left:"14.6%",width:48,height:48,fontSize:20}}>{orbitMathIcons[5]}</div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full overflow-hidden border-4 border-white bg-slate-100 shadow-xl shadow-blue-100/60">
              <img src={centerImages[currentCenterIndex]} alt="Merkez" className="w-full h-full object-cover"
                style={{ opacity:imgOpacity, transition:"opacity 0.4s ease" }} />
            </div>
          </div>
        </section>

        {/* SİSTEM */}
        <section id="sistem" className="px-25 py-20 bg-[#F8F9FB] border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-px bg-blue-400" />
            <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-blue-500">Sistem Mimarisi</span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-3">
            <h3 className="font-bold text-[26px] tracking-[-0.3px] text-[#111827] leading-[1.2] max-w-sm">Veriye Dayalı Öğrenme Modeli</h3>
            <p className="text-[13px] text-slate-400 max-w-xs md:text-right leading-[1.7]">Aşamalı ve kişiselleştirilmiş eğitim mimarisinin temel bileşenleri.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.num} className="feature-card bg-white border border-slate-100 rounded-xl p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-base">{f.icon}</div>
                  <span className="text-[11px] font-semibold text-slate-300 tracking-[1.5px]">{f.num}</span>
                </div>
                <h4 className="font-semibold text-[13px] text-[#111827] mb-2 leading-snug">{f.title}</h4>
                <p className="text-[12px] text-slate-400 leading-[1.7]">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MODÜLLER */}
        <section id="moduller" className="px-25 py-20 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-px bg-blue-400" />
            <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-blue-500">Öğrenim Modülleri</span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-3">
            <h3 className="font-bold text-[26px] tracking-[-0.3px] text-[#111827] leading-[1.2] max-w-sm">Hazırbulunuşluğa Göre İçerikler</h3>
            <p className="text-[13px] text-slate-400 max-w-xs md:text-right leading-[1.7]">Üç kademeli yapılandırılmış akademik içerik sistemi.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {modules.map((m) => (
              <div key={m.num} className="module-card relative bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <div className="h-1.5 w-full" style={{background:m.accent}} />
                <div className="p-8">
                  <div className="absolute top-6 right-6 font-bold text-[56px] leading-none select-none pointer-events-none"
                    style={{color:m.accent, opacity:0.06}}>{m.num}</div>
                  <div className="inline-block text-[10px] font-semibold tracking-[2px] uppercase px-2 py-1 rounded mb-5"
                    style={{color:m.accent, background:m.accentBg}}>{m.phase}</div>
                  <h4 className="font-bold text-[17px] tracking-[-0.2px] text-[#111827] mb-3">{m.title}</h4>
                  <p className="text-[13px] text-slate-400 leading-[1.75] mb-6">{m.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {m.tags.map((t) => (
                      <span key={t} className="text-[10px] font-medium tracking-[0.5px] px-2 py-0.75 rounded-full border"
                        style={{color:m.accent, borderColor:m.accentBg, background:m.accentBg}}>{t}</span>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 text-[12px] font-semibold pt-5 w-full bg-transparent border-t border-slate-100 border-b-0 border-l-0 border-r-0 cursor-pointer transition-all"
                    style={{color:m.accent}}>İçerikleri Görüntüle <span>→</span></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GÖREVLER */}
        <section id="gorevler" className="px-25 py-20 bg-[#F8F9FB] border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-px bg-blue-400" />
            <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-blue-500">Görev Takibi</span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-3">
            <h3 className="font-bold text-[26px] tracking-[-0.3px] text-[#111827] leading-[1.2] max-w-sm">Haftalık Çalışma Programı</h3>
            <p className="text-[13px] text-slate-400 max-w-xs md:text-right leading-[1.7]">Sistem tarafından atanan kişiselleştirilmiş zorunlu görevler.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-[44px_1fr_130px_90px] px-6 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold tracking-[1.8px] uppercase text-slate-400">
                <span>No</span><span>Görev Tanımı</span><span>Durum</span><span className="text-right">Puan</span>
              </div>
              {weeklyTasks.map((task, i) => (
                <div key={i} className="grid grid-cols-[44px_1fr_130px_90px] px-6 py-4 border-b border-slate-50 last:border-b-0 items-center hover:bg-slate-50/70 transition-colors">
                  <span className="text-[12px] font-semibold text-slate-300">0{i+1}</span>
                  <span className="text-[13px] text-[#111827] font-light">{task.title}</span>
                  <StatusBadge status={task.status} />
                  <span className="text-right text-[13px] font-semibold text-[#111827]">
                    {task.points}<span className="text-[10px] font-normal text-slate-400 ml-0.5">pts</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-[14px] text-[#111827] mb-1">Haftalık İlerleme</h4>
              <p className="text-[11px] text-slate-400 mb-6">Bu haftaki kazanım hedefleri</p>
              {progressItems.map((p) => (
                <div key={p.label} className="mb-4">
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-slate-500 font-medium">{p.label}</span>
                    <span className="font-semibold" style={{color:p.color}}>{p.value}%</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full relative">
                    <div className="prog-fill h-full rounded-full relative"
                      style={{width:`${p.value}%`, background:p.color, color:p.color}} />
                  </div>
                </div>
              ))}
              <div className="h-px bg-slate-100 my-5" />
              <div className="grid grid-cols-2 gap-2">
                {miniStats.map((s) => (
                  <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                    <div className="font-bold text-[16px] tracking-tight text-[#111827]">
                      {s.val}<span className="text-[11px] font-normal text-blue-500 ml-0.5">{s.unit}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}