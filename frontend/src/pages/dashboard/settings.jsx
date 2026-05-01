import { useState } from "react";
import { useUser } from "../../context/UserContext.jsx";
import Icon from "../../components/ui/icons8-icon.jsx";
import {
  DashboardShell,
  PageHeader,
  ProgressBar,
  SectionLabel,
  Surface,
  StatusBadge,
} from "../../components/dashboard/dashboard-design.jsx";

const AVATARS = [
  "avatar_fox",
  "avatar_mouse",
  "avatar_penguin",
  "avatar_dog",
  "avatar_hamster",
  "avatar_chameleon",
  "avatar_prawn",
  "avatar_duck",
  "avatar_doge",
  "avatar_maneki",
  "avatar_dragon",
  "avatar_teddy_bear",
];

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

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 flex-shrink-0 rounded-full border transition-colors duration-200 ${
        checked ? "border-blue-500 bg-blue-600" : "border-slate-200 bg-slate-100"
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-200 ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function SettingRow({ label, description, icon, color = "#2563EB", children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/70 py-4 last:border-b-0">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}14` }}>
          <Icon name={icon} size={15} color={color} />
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-bold leading-5 text-slate-900">{label}</div>
          {description ? <div className="mt-0.5 text-[11px] leading-5 text-slate-500">{description}</div> : null}
        </div>
      </div>
      {children}
    </div>
  );
}

function SettingsCard({ label, color = "#2563EB", icon, children, className = "" }) {
  return (
    <Surface className={`p-5 sm:p-6 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <SectionLabel color={color}>{label}</SectionLabel>
        {icon ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}14` }}>
            <Icon name={icon} size={15} color={color} />
          </span>
        ) : null}
      </div>
      {children}
    </Surface>
  );
}

function loadPrefs() {
  try {
    const raw = window.localStorage.getItem("code-enigma:prefs");
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function Settings() {
  const { user, setUser, resetUser } = useUser();
  const [prefs, setPrefs] = useState(loadPrefs);
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);

  const updatePref = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      window.localStorage.setItem("code-enigma:prefs", JSON.stringify(next));
    } catch {
      // Local storage is optional in embedded previews.
    }
  };

  const saveProfile = () => {
    setUser((u) => ({ ...u, name: name.trim() || u.name }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const confirmReset = () => {
    if (window.confirm("Tüm ilerleme sıfırlanacak (coin, level, XP). Devam edilsin mi?")) {
      resetUser();
      setName("İlkhan");
    }
  };

  const levelProgress = Math.round(Math.min(100, ((user.xp || 0) / 1000) * 100));

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Hesap Yönetimi"
        title="Ayarlar"
        description="Profil, bildirim, gizlilik ve öğrenme tercihlerini tek panelden yönet."
        icon="settings"
        iconColor="#7C3AED"
        stats={[
          { value: `Sv. ${user.level}`, label: "Seviye", color: "#2563EB", icon: "goals" },
          { value: user.streak, label: "Gün Seri", color: "#D97706", icon: "streak" },
          { value: user.coins.toLocaleString("tr-TR"), label: "Coin", color: "#D97706", icon: "coin" },
        ]}
        actions={
          saved ? (
            <StatusBadge color="#059669" bg="#ECFDF5">
              Kaydedildi
            </StatusBadge>
          ) : null
        }
      />

      <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex min-w-0 flex-col gap-5">
            <SettingsCard label="Profil" color="#2563EB" icon="profile">
              <div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/70 bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_18px_34px_rgba(37,99,235,0.24)]">
                    <Icon name={user.avatar} size={40} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">Aktif profil</p>
                    <p className="mt-1 text-[15px] font-bold text-slate-900">{user.name}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">İsim</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/80 bg-white/78 px-4 py-3 text-[13px] font-bold text-slate-800 outline-none transition-all focus:border-blue-300 focus:ring-4 focus:ring-blue-100/80"
                  />
                </div>
              </div>

              <div className="mt-6">
                <SectionLabel color="#7C3AED">Avatar</SectionLabel>
                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                  {AVATARS.map((avatar) => {
                    const active = user.avatar === avatar;
                    return (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setUser((u) => ({ ...u, avatar }))}
                        className={`flex h-12 w-full items-center justify-center rounded-2xl border transition-all ${
                          active
                            ? "border-blue-300 bg-blue-50 shadow-[0_12px_24px_rgba(37,99,235,0.14)]"
                            : "border-white/80 bg-white/62 hover:border-blue-200"
                        }`}
                      >
                        <Icon name={avatar} size={24} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={saveProfile}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-[12px] font-bold text-white shadow-[0_16px_30px_rgba(37,99,235,0.22)] transition-all hover:bg-blue-700"
              >
                <Icon name="check" size={13} color="#ffffff" />
                Profili Kaydet
              </button>
            </SettingsCard>

            <SettingsCard label="Bildirimler" color="#D97706" icon="notifications">
              <SettingRow label="Yeni ödev / test" description="Yeni görev açıldığında bildirim al" icon="test" color="#D97706">
                <Toggle checked={prefs.notifTasks} onChange={(v) => updatePref("notifTasks", v)} />
              </SettingRow>
              <SettingRow label="Canlı ders hatırlatıcısı" description="Ders başlamadan 15 dk önce" icon="live" color="#D97706">
                <Toggle checked={prefs.notifLive} onChange={(v) => updatePref("notifLive", v)} />
              </SettingRow>
              <SettingRow label="Haftalık rapor" description="Pazartesi sabahı özet" icon="chart" color="#D97706">
                <Toggle checked={prefs.notifReport} onChange={(v) => updatePref("notifReport", v)} />
              </SettingRow>
              <SettingRow label="Sistem duyuruları" description="Platform güncellemeleri" icon="announcement" color="#D97706">
                <Toggle checked={prefs.notifAnnounce} onChange={(v) => updatePref("notifAnnounce", v)} />
              </SettingRow>
            </SettingsCard>

            <div className="grid gap-5 lg:grid-cols-2">
              <SettingsCard label="Gizlilik" color="#059669" icon="shield">
                <SettingRow label="Liderlik tablosunda görün" description="Diğer öğrenciler sıralamada seni görebilsin" icon="trophy" color="#059669">
                  <Toggle checked={prefs.privacyLeaderboard} onChange={(v) => updatePref("privacyLeaderboard", v)} />
                </SettingRow>
                <SettingRow label="Avatarımı paylaş" description="Topluluk alanlarında avatarın görünsün" icon="profile" color="#059669">
                  <Toggle checked={prefs.privacyAvatar} onChange={(v) => updatePref("privacyAvatar", v)} />
                </SettingRow>
              </SettingsCard>

              <SettingsCard label="Görünüm" color="#7C3AED" icon="settings">
                <SettingRow label="Ses efektleri" description="Doğru/yanlış cevap bildirimleri" icon="sound" color="#7C3AED">
                  <Toggle checked={prefs.soundEffects} onChange={(v) => updatePref("soundEffects", v)} />
                </SettingRow>
                <SettingRow label="Azaltılmış hareket" description="Animasyonları minimuma indir" icon="timer" color="#7C3AED">
                  <Toggle checked={prefs.reducedMotion} onChange={(v) => updatePref("reducedMotion", v)} />
                </SettingRow>
                <SettingRow label="Arayüz dili" description="Platform metin dili" icon="translation" color="#7C3AED">
                  <select
                    value={prefs.language}
                    onChange={(e) => updatePref("language", e.target.value)}
                    className="rounded-xl border border-white/80 bg-white/82 px-3 py-2 text-[11px] font-bold text-slate-600 outline-none focus:border-violet-300"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </SettingRow>
              </SettingsCard>
            </div>

            <SettingsCard label="Tehlikeli Bölge" color="#DC2626" icon="warning">
              <SettingRow label="İlerlemeyi sıfırla" description="Coin, level, XP değerlerini varsayılana döndürür" icon="refresh" color="#DC2626">
                <button
                  type="button"
                  onClick={confirmReset}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-[10px] font-bold text-red-600 transition-all hover:bg-red-100"
                >
                  Sıfırla
                </button>
              </SettingRow>
            </SettingsCard>
          </section>

          <aside className="flex flex-col gap-5">
            <Surface className="p-5">
              <div className="mb-4">
                <SectionLabel>Hesap Özeti</SectionLabel>
              </div>
              <div className="flex flex-col gap-3 text-[12px]">
                {[
                  ["Kullanıcı", user.name, "#111827"],
                  ["Seviye", `Sv. ${user.level}`, "#2563EB"],
                  ["Coin", user.coins.toLocaleString("tr-TR"), "#D97706"],
                  ["Seri", `${user.streak} gün`, "#DC2626"],
                  ["XP", `${user.xp || 0} / 1000`, "#7C3AED"],
                ].map(([label, value, color]) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-white/70 bg-white/52 px-3 py-2.5">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-bold" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">Sonraki seviye</span>
                  <span className="text-[10px] font-bold text-violet-600">%{levelProgress}</span>
                </div>
                <ProgressBar value={levelProgress} color="linear-gradient(90deg,#2563EB,#7C3AED)" />
              </div>
            </Surface>

            <Surface className="p-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1.4px] text-blue-600">
                <Icon name="idea" size={12} color="#2563EB" />
                İpucu
              </div>
              <p className="mt-3 text-[12px] leading-6 text-slate-600">
                Tercihler tarayıcında yerel olarak tutuluyor. Backend entegrasyonu sonrası aynı panel hesap ayarlarına bağlanacak.
              </p>
            </Surface>

            <Surface className="p-5">
              <div className="mb-4">
                <SectionLabel color="#059669">Günlük hedef</SectionLabel>
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => updatePref("dailyGoal", Math.max(1, prefs.dailyGoal - 1))}
                  disabled={prefs.dailyGoal <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/80 bg-white/72 disabled:opacity-40"
                >
                  <Icon name="minus" size={13} color="#64748B" />
                </button>
                <div className="text-center">
                  <div className="text-[32px] font-bold leading-none text-slate-950">{prefs.dailyGoal}</div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[1.4px] text-slate-400">Görev / gün</div>
                </div>
                <button
                  type="button"
                  onClick={() => updatePref("dailyGoal", Math.min(12, prefs.dailyGoal + 1))}
                  disabled={prefs.dailyGoal >= 12}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/80 bg-white/72 disabled:opacity-40"
                >
                  <Icon name="plus" size={13} color="#64748B" />
                </button>
              </div>
            </Surface>
          </aside>
        </div>
      </main>
    </DashboardShell>
  );
}
