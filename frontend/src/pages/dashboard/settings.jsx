import { useState } from "react";
import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";
import { useUser } from "../../context/UserContext.jsx";
import Icon from "../../components/ui/icons8-icon.jsx";

const AVATARS = ["avatar_fox", "avatar_mouse", "avatar_penguin", "avatar_dog", "avatar_hamster", "avatar_chameleon", "avatar_prawn", "avatar_duck", "avatar_doge", "avatar_maneki", "avatar_dragon", "avatar_teddy_bear"];

const DEFAULT_PREFS = {
  notifTasks: true,
  notifLive: true,
  notifReport: true,
  notifAnnounce: false,
  soundEffects: true,
  reducedMotion: false,
  language: "tr",
  dailyGoal: 4,
  privacyLeaderboard: true,
  privacyAvatar: true,
};

function SectionLabel({ text, color = "#2563EB" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px w-5 rounded" style={{ background: color }} />
      <span className="text-[10px] font-bold uppercase tracking-[2.5px]" style={{ color }}>{text}</span>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-[#2563EB]" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Row({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3.5 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-semibold text-[#111827]">{label}</div>
        {description && <div className="mt-0.5 text-[10px] text-slate-400">{description}</div>}
      </div>
      {children}
    </div>
  );
}

function Card({ children, label, color }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6">
      <div className="mb-4">
        <SectionLabel text={label} color={color} />
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { user, setUser, resetUser } = useUser();
  const [prefs, setPrefs] = useState(() => {
    try {
      const raw = window.localStorage.getItem("code-enigma:prefs");
      return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);

  const updatePref = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try { window.localStorage.setItem("code-enigma:prefs", JSON.stringify(next)); } catch { /* noop */ }
  };

  const saveProfile = () => {
    setUser((u) => ({ ...u, name: name.trim() || u.name }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const confirmReset = () => {
    if (window.confirm("Tüm ilerleme sıfırlanacak (coin, level, XP). Devam edilsin mi?")) {
      resetUser();
      setName("İlkhan");
    }
  };

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
                  <div className="h-px w-5 bg-violet-400 rounded" />
                  <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-violet-500">Hesap Yönetimi</span>
                </div>
                <h1 className="inline-flex items-center gap-2 text-[26px] font-bold tracking-[-0.4px] leading-tight">Ayarlar <Icon name="settings" size={22} color="#7C3AED" /></h1>
                <p className="mt-1 text-[11px] text-slate-400">
                  Profil, bildirim, gizlilik ve görünüm tercihlerini buradan yönet
                </p>
              </div>

              {saved && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Değişiklikler kaydedildi
                </div>
              )}
            </div>
          </header>

          {/* MAIN */}
          <main className="flex-1 px-8 py-7">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">

              <div className="flex flex-col gap-5">
                {/* Profile card */}
                <Card label="Profil" color="#2563EB">
                  <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-[38px] shadow-md shadow-blue-100">
                      <Icon name={user.avatar} size={40} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="text-[9px] font-bold uppercase tracking-[1.5px] text-slate-400">İsim</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold outline-none transition-all focus:border-blue-300"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="text-[9px] font-bold uppercase tracking-[1.5px] text-slate-400">Avatar</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {AVATARS.map((a) => (
                        <button
                          key={a}
                          onClick={() => setUser((u) => ({ ...u, avatar: a }))}
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 text-[22px] transition-all ${
                            user.avatar === a
                              ? "border-[#2563EB] bg-blue-50 shadow-sm shadow-blue-200"
                              : "border-slate-100 bg-white hover:border-blue-200"
                          }`}
                        >
                          <Icon name={a} size={22} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={saveProfile}
                    className="mt-5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-[11px] font-bold text-white transition-all hover:bg-[#1D4ED8] hover:shadow-md hover:shadow-blue-200"
                  >
                    Profili Kaydet
                  </button>
                </Card>

                {/* Notifications */}
                <Card label="Bildirimler" color="#D97706">
                  <Row label="Yeni ödev / test" description="Yeni görev açıldığında bildirim al">
                    <Toggle checked={prefs.notifTasks} onChange={(v) => updatePref("notifTasks", v)} />
                  </Row>
                  <Row label="Canlı ders hatırlatıcısı" description="Ders başlamadan 15 dk önce">
                    <Toggle checked={prefs.notifLive} onChange={(v) => updatePref("notifLive", v)} />
                  </Row>
                  <Row label="Haftalık rapor" description="Pazartesi sabahı özet">
                    <Toggle checked={prefs.notifReport} onChange={(v) => updatePref("notifReport", v)} />
                  </Row>
                  <Row label="Sistem duyuruları" description="Platform güncellemeleri">
                    <Toggle checked={prefs.notifAnnounce} onChange={(v) => updatePref("notifAnnounce", v)} />
                  </Row>
                </Card>

                {/* Privacy */}
                <Card label="Gizlilik" color="#059669">
                  <Row label="Liderlik tablosunda görün" description="Diğer öğrenciler sıralamada seni görebilsin">
                    <Toggle checked={prefs.privacyLeaderboard} onChange={(v) => updatePref("privacyLeaderboard", v)} />
                  </Row>
                  <Row label="Avatarımı paylaş" description="Topluluk alanlarında avatarın görünsün">
                    <Toggle checked={prefs.privacyAvatar} onChange={(v) => updatePref("privacyAvatar", v)} />
                  </Row>
                </Card>

                {/* Appearance + accessibility */}
                <Card label="Görünüm & Erişilebilirlik" color="#7C3AED">
                  <Row label="Ses efektleri" description="Doğru/yanlış cevap ses bildirimleri">
                    <Toggle checked={prefs.soundEffects} onChange={(v) => updatePref("soundEffects", v)} />
                  </Row>
                  <Row label="Azaltılmış hareket" description="Animasyonları minimuma indir">
                    <Toggle checked={prefs.reducedMotion} onChange={(v) => updatePref("reducedMotion", v)} />
                  </Row>
                  <Row label="Arayüz dili" description="Platform metin dili">
                    <select
                      value={prefs.language}
                      onChange={(e) => updatePref("language", e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold outline-none transition-all focus:border-violet-300"
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                    </select>
                  </Row>
                  <Row label="Günlük hedef" description="Gün başına tamamlanacak görev sayısı">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updatePref("dailyGoal", Math.max(1, prefs.dailyGoal - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-[12px] font-bold text-slate-500 transition-all hover:border-violet-300 hover:text-[#7C3AED]"
                      ><Icon name="minus" size={12} color="#64748b" /></button>
                      <span className="min-w-[24px] text-center text-[12px] font-bold text-[#111827]">{prefs.dailyGoal}</span>
                      <button
                        onClick={() => updatePref("dailyGoal", Math.min(12, prefs.dailyGoal + 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-[12px] font-bold text-slate-500 transition-all hover:border-violet-300 hover:text-[#7C3AED]"
                      ><Icon name="plus" size={12} color="#64748b" /></button>
                    </div>
                  </Row>
                </Card>

                {/* Danger zone */}
                <Card label="Tehlikeli Bölge" color="#DC2626">
                  <Row label="İlerlemeyi sıfırla" description="Coin, level, XP değerlerini varsayılana döndürür">
                    <button
                      onClick={confirmReset}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-[10px] font-bold text-[#DC2626] transition-all hover:bg-red-100"
                    >
                      Sıfırla
                    </button>
                  </Row>
                </Card>
              </div>

              {/* Sidebar summary */}
              <aside className="flex flex-col gap-5">
                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="mb-4">
                    <SectionLabel text="Hesap Özeti" />
                  </div>
                  <div className="flex flex-col gap-3 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Kullanıcı</span>
                      <span className="font-bold text-[#111827]">{user.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Seviye</span>
                      <span className="font-bold text-[#2563EB]">Sv. {user.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Coin</span>
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600">{user.coins.toLocaleString("tr-TR")} <Icon name="coin" size={12} color="#D97706" /></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Seri</span>
                      <span className="inline-flex items-center gap-1 font-bold text-[#DC2626]">{user.streak} gün <Icon name="streak" size={12} color="#DC2626" /></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">XP</span>
                      <span className="font-bold text-[#7C3AED]">{user.xp || 0} / 1000</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-[1.5px] text-slate-400">Sonraki seviye</span>
                      <span className="text-[9px] font-bold text-[#7C3AED]">{Math.round(((user.xp || 0) / 1000) * 100)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] transition-all duration-700"
                        style={{ width: `${Math.min(100, ((user.xp || 0) / 1000) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[1.5px] text-[#2563EB]"><Icon name="idea" size={11} color="#2563EB" /> İpucu</div>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                    Tüm tercihler tarayıcında yerel olarak kaydediliyor. Backend entegrasyonu sonrası hesaba taşınacak.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="mb-3">
                    <SectionLabel text="Klavye" color="#059669" />
                  </div>
                  <div className="flex flex-col gap-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Komut paleti</span>
                      <div className="flex gap-1">
                        <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">Ctrl</kbd>
                        <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">K</kbd>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Kapat</span>
                      <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">ESC</kbd>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
