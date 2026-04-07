import React from 'react';

export default function MathLearningPlatform() {
  const levels = [
    { title: "Başlangıç", desc: "Temel konu anlatımları, görselli örnekler ve kolay alıştırmalar.", icon: "🌱", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    { title: "Orta", desc: "Pekiştirme soruları, mini quizler ve ipuçlu problemler.", icon: "🚀", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    { title: "İleri", desc: "Zorlayıcı görevler, takım yarışmaları ve meydan okumalar.", icon: "🔥", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  ];

  const features = [
    { title: "Buz kırma etkinlikleri", icon: "🧊" },
    { title: "Seviye belirleme testi", icon: "🎯" },
    { title: "Oyunlaştırılmış görevler", icon: "🎮" },
    { title: "Ortak öğrenme", icon: "🤝" },
    { title: "Rozet ve seviye sistemi", icon: "🏅" },
    { title: "Eğlenceli quizler", icon: "✨" },
  ];

  const weeklyTasks = [
    { title: "Kesir eşleştirme oyununu tamamla", xp: "+50 XP" },
    { title: "Takımınla 10 soru çöz", xp: "+100 XP" },
    { title: "Haftanın problem görevini bitir", xp: "+75 XP" },
    { title: "Mini quizden en az 80 puan al", xp: "+120 XP" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-200">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-indigo-100 bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-2xl shadow-lg shadow-indigo-200">
              🧭
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-indigo-950">Matematik Macerası</h1>
              <p className="text-xs font-medium text-indigo-500">Oyunlaştırılmış Öğrenme</p>
            </div>
          </div>
          <nav className="hidden gap-8 md:flex text-sm font-bold text-slate-600">
            <a href="#anasayfa" className="hover:text-indigo-600 transition-colors">Ana Sayfa</a>
            <a href="#seviyeler" className="hover:text-indigo-600 transition-colors">Seviyeler</a>
            <a href="#gorevler" className="hover:text-indigo-600 transition-colors">Görevler</a>
            <a href="#takim" className="hover:text-indigo-600 transition-colors">Takım Alanı</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="anasayfa" className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center overflow-hidden">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              10–13 yaş için tasarlandı
            </span>
            <h2 className="mt-6 text-5xl font-extrabold leading-[1.15] text-slate-900 md:text-6xl">
              Matematiği <span className="bg-linear-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">oyunla</span>, ekiple ve görevlerle öğren!
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Buz kırma etkinlikleriyle maceraya başla, seviyeni belirle ve takımınla birlikte rozetler kazanarak zirveye tırman.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-indigo-200 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700">
                Maceraya Başla 🚀
              </button>
              <button className="rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:text-indigo-600">
                Seviye Testini Gör 🎯
              </button>
            </div>
          </div>

          {/* Hero Cards */}
          <div className="grid gap-6 relative">
            {/* Dekoratif arka plan çemberi */}
<div className="absolute -inset-4 z-0 rounded-full bg-linear-to-tr from-indigo-100 to-violet-50 opacity-50 blur-3xl"></div>
            
            <div className="relative z-10 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 transition-transform duration-300 hover:-translate-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">Bugünün Görevi</h3>
                  <p className="mt-2 text-sm font-medium text-slate-500">Kesir kartlarını eşleştir, takımını öne geçir.</p>
                </div>
                <span className="text-3xl">🧩</span>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-amber-50 p-4 border border-amber-100">
                <p className="text-sm font-bold text-amber-700">Kazanılacak Ödül</p>
                <p className="text-2xl font-black text-amber-500">+20 XP</p>
              </div>
            </div>

            <div className="relative z-10 grid gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 transition-transform duration-300 hover:-translate-y-2">
                <span className="text-4xl">🏅</span>
                <p className="mt-4 text-sm font-bold text-slate-500">Kazanılan Rozet</p>
                <p className="text-3xl font-black text-indigo-950">12</p>
              </div>
              <div className="flex flex-col items-center rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 transition-transform duration-300 hover:-translate-y-2">
                <span className="text-4xl">🏆</span>
                <p className="mt-4 text-sm font-bold text-slate-500">Takım Sırası</p>
                <p className="text-3xl font-black text-indigo-950">#3</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20 relative border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Platformda seni neler bekliyor?</h3>
              <p className="mt-4 text-slate-500 font-medium">Sıkıcı dersler yerine etkileşimli ve rekabet dolu bir ortam.</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <div key={idx} className="group flex items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 transition-all hover:bg-white hover:shadow-lg hover:shadow-indigo-100/50 cursor-default">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <p className="font-bold text-slate-700">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Levels Section */}
        <section id="seviyeler" className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Kendi hızında, kendi seviyende</h3>
            <p className="mt-4 text-slate-500 font-medium">Her öğrenci farklıdır. İçerikler tamamen senin seviyene göre şekillenir.</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {levels.map((level) => (
              <div key={level.title} className={`relative flex flex-col rounded-3xl border-2 bg-white p-8 shadow-xl shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${level.border}`}>
                <div className={`absolute -top-6 left-8 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg ${level.bg}`}>
                  {level.icon}
                </div>
                <h4 className={`mt-4 text-2xl font-black ${level.color}`}>{level.title}</h4>
                <p className="mt-4 flex-1 text-slate-600 font-medium leading-relaxed">{level.desc}</p>
                <button className={`mt-8 w-full rounded-2xl py-3 font-bold transition-colors hover:bg-slate-900 hover:text-white ${level.bg} ${level.color}`}>
                  İncele
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Quests Section */}
        <section id="gorevler" className="bg-indigo-950 py-24 text-white relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600 rounded-full blur-[120px] opacity-30"></div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="md:flex md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-3xl font-extrabold md:text-4xl">Haftalık Görev Panosu</h3>
                <p className="mt-4 text-indigo-200 text-lg">
                  Bireysel veya takımınla tamamlayabileceğin görevler. Daha çok görev, daha çok puan demek!
                </p>
              </div>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {weeklyTasks.map((task, i) => (
                <div key={i} className="group flex items-center justify-between rounded-3xl border border-indigo-800 bg-indigo-900/50 p-6 backdrop-blur-md transition-all hover:bg-indigo-800/50 hover:border-indigo-500 cursor-pointer">
                  <div>
                    <span className="inline-block rounded-lg bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-300 mb-3">
                      Görev {i + 1}
                    </span>
                    <p className="text-lg font-bold text-indigo-50 group-hover:text-white">{task.title}</p>
                  </div>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-sm font-black text-amber-950 shadow-lg shadow-amber-500/20 rotate-3 group-hover:rotate-6 transition-transform">
                    {task.xp.split(' ')[0]}<br/>XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Area */}
        <section id="takim" className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[2.5rem] bg-linear-to-br from-violet-50 to-indigo-50 p-10 border border-indigo-100">
              <div className="h-12 w-12 rounded-2xl bg-violet-200 flex items-center justify-center text-2xl mb-6">🤝</div>
              <h3 className="text-3xl font-extrabold text-slate-900">Buz Kırma Etkinliği</h3>
              <p className="mt-4 text-slate-600 font-medium leading-relaxed">
                Öğrenciler ilk girişte avatar seçer, takımını belirler ve kısa bir matematik bingo etkinliğiyle birbirini tanır.
              </p>
              <ul className="mt-8 space-y-4 font-bold text-slate-700">
                <li className="flex items-center gap-3"><span className="text-violet-500">●</span> Avatar seçimi ve özelleştirme</li>
                <li className="flex items-center gap-3"><span className="text-violet-500">●</span> Yaratıcı takım adı oluşturma</li>
                <li className="flex items-center gap-3"><span className="text-violet-500">●</span> Matematik bingo kartı</li>
                <li className="flex items-center gap-3"><span className="text-violet-500">●</span> Emojiyle tanışma duvarı</li>
              </ul>
            </div>

            <div className="rounded-[2.5rem] bg-linear-to-br from-emerald-50 to-teal-50 p-10 border border-emerald-100">
              <div className="h-12 w-12 rounded-2xl bg-emerald-200 flex items-center justify-center text-2xl mb-6">💡</div>
              <h3 className="text-3xl font-extrabold text-slate-900">Ortak Öğrenme Alanı</h3>
              <p className="mt-4 text-slate-600 font-medium leading-relaxed">
                Platform tek kişilik bir özel ders mantığında değil; öğrencilerin birlikte öğrendiği etkileşimli bir yapı sunar.
              </p>
              <ul className="mt-8 space-y-4 font-bold text-slate-700">
                <li className="flex items-center gap-3"><span className="text-emerald-500">●</span> Canlı takım puan tablosu</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500">●</span> Grup problem çözme arenası</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500">●</span> Haftanın zorlu ortak problemi</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500">●</span> Öğrenci tartışma ve yardımlaşma bölümü</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <span className="text-indigo-600">🧭</span> Matematik Macerası
          </div>
          <p className="text-sm font-medium text-slate-500">
            Açık ve Uzaktan Eğitim dönem sonu projesi
          </p>
        </div>
      </footer>
    </div>
  );
}