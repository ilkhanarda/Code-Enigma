import { Link } from 'react-router-dom';
import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";

const suggestedTopics = [
  { title: 'Temel Kavramlar', progress: '12 video · %84 tamamlama', badge: 'Önerilen', color: '#2563EB', bg: '#EFF6FF', icon: '◈' },
  { title: 'Sayı Basamakları', progress: '8 test · %72 başarı', badge: 'Devam Et', color: '#7C3AED', bg: '#F5F3FF', icon: '⌖' },
  { title: 'Rasyonel Sayılar', progress: '14 soru seti · %91 doğruluk', badge: 'Güçlü Alan', color: '#059669', bg: '#ECFDF5', icon: '◎' },
  { title: 'Denklemler', progress: '6 kazanım · 2 eksik', badge: 'Eksik Var', color: '#D97706', bg: '#FFFBEB', icon: '◫' },
  { title: 'Eşitsizlikler', progress: 'Canlı ders · Bugün 19:00', badge: 'Takvimde', color: '#DC2626', bg: '#FEF2F2', icon: '⬡' },
  { title: 'Fonksiyonlar', progress: '11 içerik · %66 ilerleme', badge: 'Planlı', color: '#2563EB', bg: '#EFF6FF', icon: '◉' },
  { title: 'Problemler', progress: '5 görev · 1 bekliyor', badge: 'Görevli', color: '#7C3AED', bg: '#F5F3FF', icon: '◈' },
  { title: 'Geometri', progress: '7 modül · %58 ilerleme', badge: 'Yükseliyor', color: '#059669', bg: '#ECFDF5', icon: '⌘' },
];

const dailyTasks = [
  { title: '1 video dersi tamamla', xp: '+50 XP', done: true },
  { title: '10 soru çöz', xp: '+80 XP', done: true },
  { title: 'Eksik kazanım testini aç', xp: '+40 XP', done: false },
  { title: '20 dakika tekrar yap', xp: '+60 XP', done: false },
];

const goals = [
  { label: 'Günlük Hedef', value: '3 / 4 tamamlandı', progress: 75, color: '#2563EB' },
  { label: 'Haftalık Hedef', value: '5 / 7 görev', progress: 71, color: '#7C3AED' },
  { label: 'Aylık Hedef', value: '2 / 3 modül', progress: 66, color: '#059669' },
];

const seasonalEvents = [
  { title: 'Bahar Sprinti', meta: '7 gün kaldı · +500 XP ödül', tone: '#D97706', bg: '#FFFBEB' },
  { title: 'Haftalık Lig', meta: 'Şu an #4 sıralamadasın', tone: '#2563EB', bg: '#EFF6FF' },
  { title: 'Rozet Avı', meta: '2 rozet daha kazanırsan açılır', tone: '#7C3AED', bg: '#F5F3FF' },
];

const notifications = [
  { title: 'Yeni test yüklendi', desc: 'Denklemler konusunda yeni mini test hazır.' },
  { title: 'Canlı ders yaklaşmış', desc: 'Eşitsizlikler canlı dersi bugün saat 19:00.' },
  { title: 'Haftalık rapor hazır', desc: 'Bu haftaki performans özetin görüntülenebilir.' },
];

function ProgressBar({ value, color }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <button
      className={`group flex flex-col items-center gap-1.5 rounded-2xl border px-2.5 py-2 transition-all ${
        active
          ? 'border-blue-200 bg-blue-50 text-[#2563EB] shadow-sm'
          : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-[#111827]'
      }`}
    >
      <span className="text-[16px] leading-none">{icon}</span>
      <span className="text-center text-[9px] font-semibold uppercase tracking-[1.2px] leading-3">
        {label}
      </span>
    </button>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111827]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');
        html { scroll-behavior: smooth; }
        * { font-family: 'IBM Plex Mono', monospace; }
        .logo-hex { clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); }
        .dashboard-card { transition: box-shadow .2s, transform .2s; }
        .dashboard-card:hover { box-shadow: 0 10px 30px rgba(37,99,235,.08); transform: translateY(-2px); }
        .topic-card { transition: box-shadow .2s, transform .2s; }
        .topic-card:hover { box-shadow: 0 14px 34px rgba(15,23,42,.08); transform: translateY(-3px); }
        .side-nav-shadow { box-shadow: 10px 0 30px rgba(15,23,42,.04); }
      `}</style>

      <div className="flex min-h-screen">
        <DashboardNavbar />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/95 px-8 py-5 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-px w-5 bg-blue-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-[2.5px] text-blue-500">
                    Code:Enigma Paneli
                  </span>
                </div>
                <h1 className="text-[28px] font-bold tracking-[-0.4px] text-[#111827]">
                  Hoşgeldin, İlkhan Arda,
                </h1>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '14', label: 'Aktif Ders' },
                  { value: '%84', label: 'Başarı' },
                  { value: '3/4', label: 'Görev' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center"
                  >
                    <div className="text-[18px] font-bold tracking-tight text-[#111827]">
                      {item.value}
                    </div>
                    <div className="mt-1 text-[9px] uppercase tracking-[1.7px] text-slate-400">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <main className="flex-1 px-8 py-8">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="min-w-0">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-px w-5 bg-blue-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-[2.5px] text-blue-500">
                    Önerilen Konular
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {suggestedTopics.map((topic) => (
                    <article
                      key={topic.title}
                      className="topic-card rounded-[24px] border border-slate-200 bg-white p-5"
                    >
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-2xl text-[18px]"
                          style={{ background: topic.bg, color: topic.color }}
                        >
                          {topic.icon}
                        </div>
                        <span
                          className="rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[1.6px]"
                          style={{ background: topic.bg, color: topic.color }}
                        >
                          {topic.badge}
                        </span>
                      </div>

                      <h2 className="text-[16px] font-bold tracking-[-0.2px] text-[#111827]">
                        {topic.title}
                      </h2>
                      <p className="mt-3 text-[11px] leading-6 text-slate-500">{topic.progress}</p>

                      <div className="mt-5 h-px bg-slate-100" />

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-[1.6px] text-slate-400">
                          LMS Modülü
                        </span>
                        <button className="text-[11px] font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]">
                          Aç →
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="flex flex-col gap-5">
                <section className="dashboard-card rounded-[24px] border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-px w-5 bg-blue-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-[2.5px] text-blue-500">
                      Günlük Görevler
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {dailyTasks.map((task) => (
                      <div
                        key={task.title}
                        className={`rounded-2xl border px-4 py-3 ${
                          task.done ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                              task.done ? 'bg-emerald-600 text-white' : 'border border-slate-300 text-slate-400'
                            }`}
                          >
                            {task.done ? '✓' : ''}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-[11px] leading-6 ${
                                task.done ? 'font-semibold text-emerald-800' : 'text-slate-600'
                              }`}
                            >
                              {task.title}
                            </div>
                            <div
                              className={`mt-1 text-[10px] font-semibold ${
                                task.done ? 'text-emerald-600' : 'text-slate-400'
                              }`}
                            >
                              {task.xp}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="dashboard-card rounded-[24px] border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-px w-5 bg-[#7C3AED]" />
                    <span className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#7C3AED]">
                      Hedefler
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {goals.map((goal) => (
                      <div key={goal.label}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-[11px] font-medium text-slate-600">{goal.label}</span>
                          <span className="text-[10px] font-semibold text-slate-400">{goal.value}</span>
                        </div>
                        <ProgressBar value={goal.progress} color={goal.color} />
                      </div>
                    ))}
                  </div>
                </section>

                <section className="dashboard-card rounded-[24px] border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-px w-5 bg-[#D97706]" />
                    <span className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#D97706]">
                      Sezonluk Etkinlik
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {seasonalEvents.map((event) => (
                      <div
                        key={event.title}
                        className="rounded-2xl border border-slate-200 p-4"
                        style={{ background: event.bg }}
                      >
                        <div className="text-[12px] font-semibold" style={{ color: event.tone }}>
                          {event.title}
                        </div>
                        <div className="mt-2 text-[11px] leading-6 text-slate-600">{event.meta}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="dashboard-card rounded-[24px] border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-px w-5 bg-[#059669]" />
                    <span className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#059669]">
                      Bildirimler
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {notifications.map((note) => (
                      <div
                        key={note.title}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="text-[11px] font-semibold text-[#111827]">{note.title}</div>
                        <div className="mt-1 text-[10px] leading-6 text-slate-500">{note.desc}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </main>

          <footer className="border-t border-slate-200 bg-white px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="logo-hex flex h-8 w-8 items-center justify-center bg-[#2563EB] text-[9px] font-bold tracking-tight text-white">
                  C:E
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#111827]">Code:Enigma Dashboard</div>
                  <div className="text-[9px] uppercase tracking-[1.8px] text-slate-400">
                    Canvas LMS Esintili Panel
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                © {new Date().getFullYear()} Açık ve Uzaktan Eğitim Projesi. Tüm hakları saklıdır.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}