import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const trustMetrics = [
  { label: 'Aktif Öğrenci', value: '1.2K' },
  { label: 'Haftalık Oturum', value: '8.4K' },
  { label: 'Başarı Artışı', value: '+27%' },
]

const highlights = [
  'Kişiselleştirilmiş çalışma akışları',
  'Seviye bazlı görev eşleştirme',
  'Anlık performans görünürlüğü',
]

const initialForms = {
  login: {
    email: '',
    password: '',
    remember: true,
  },
  register: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accept: true,
  },
}

function validate(mode, values) {
  const errors = {}

  if (!values.email.trim()) {
    errors.email = 'E-posta gerekli.'
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Geçerli bir e-posta gir.'
  }

  if (!values.password.trim()) {
    errors.password = 'Şifre gerekli.'
  } else if (values.password.length < 6) {
    errors.password = 'En az 6 karakter kullan.'
  }

  if (mode === 'register') {
    if (!values.name.trim()) {
      errors.name = 'Ad soyad gerekli.'
    }

    if (!values.confirmPassword.trim()) {
      errors.confirmPassword = 'Şifre tekrarı gerekli.'
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Şifreler eşleşmiyor.'
    }

    if (!values.accept) {
      errors.accept = 'Devam etmek için onay vermelisin.'
    }
  }

  return errors
}

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const mode = location.pathname === '/register' ? 'register' : 'login'
  const [forms, setForms] = useState(initialForms)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState('')

  const activeForm = forms[mode]
  const completion = useMemo(() => {
    const fields =
      mode === 'register'
        ? ['name', 'email', 'password', 'confirmPassword']
        : ['email', 'password']

    const filled = fields.filter((field) => activeForm[field]?.trim()).length
    return Math.round((filled / fields.length) * 100)
  }, [activeForm, mode])

  const fieldStatus = (name) => {
    if (!submitted && focusedField !== name) return 'idle'
    if (errors[name]) return 'error'
    if (activeForm[name] && !errors[name]) return 'success'
    return 'idle'
  }

  const handleModeChange = (nextMode) => {
    setErrors({})
    setSubmitted(false)
    setFocusedField('')
    setShowPassword(false)
    navigate(nextMode === 'register' ? '/register' : '/login')
  }

  const handleChange = (name, value) => {
    const nextForms = {
      ...forms,
      [mode]: {
        ...activeForm,
        [name]: value,
      },
    }

    setForms(nextForms)

    if (submitted) {
      setErrors(validate(mode, nextForms[mode]))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)

    const nextErrors = validate(mode, activeForm)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      navigate('/dashboard')
    }
  }

  const inputClassName = (name) => {
    const status = fieldStatus(name)
    if (status === 'error') {
      return 'border-rose-300 bg-rose-50/80 text-rose-950 focus:border-rose-400'
    }
    if (status === 'success') {
      return 'border-emerald-300 bg-emerald-50/70 text-slate-950 focus:border-emerald-400'
    }
    return 'border-slate-200 bg-white/85 text-slate-950 focus:border-[#2563EB]'
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#F8F9FB] font-['IBM_Plex_Mono',monospace] text-[#111827]">
      <div className="absolute inset-0 pointer-events-none opacity-70" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.18) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute left-[-10%] top-[-12%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(37,99,235,0.16)_0%,_rgba(37,99,235,0.04)_38%,_transparent_70%)] blur-2xl" />
      <div className="absolute bottom-[-18%] right-[-8%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(15,23,42,0.08)_0%,_transparent_65%)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-5 py-5 md:px-10 lg:px-14">
        <header className="mb-6 flex items-center justify-between rounded-[28px] border border-white/70 bg-white/75 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="logo-hex flex h-11 w-11 items-center justify-center bg-[#2563EB] text-[12px] font-bold tracking-tight text-white">
              C:E
            </div>
            <div>
              <p className="text-[15px] font-bold tracking-tight text-[#111827]">Code:Enigma</p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[2px] text-slate-400">Akıllı Öğrenme Sistemi</p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[2px] text-slate-500">
              Güvenli Erişim
            </span>
            <Link to="/" className="text-[12px] font-medium text-slate-500 no-underline transition-colors hover:text-[#111827]">
              Ana Sayfa
            </Link>
          </div>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-[#0F172A] px-6 py-8 text-white shadow-[0_30px_70px_rgba(15,23,42,0.16)] md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_34%),linear-gradient(135deg,_rgba(15,23,42,0.92),_rgba(15,23,42,0.86))]" />
            <div className="absolute right-[-8%] top-[18%] h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute right-[12%] top-[26%] h-40 w-40 rounded-full border border-white/6" />

            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="space-y-6">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[2px] text-blue-100">
                  <span className="h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_16px_rgba(147,197,253,0.9)]" />
                  Öğrenme Alanına Giriş
                </span>

                <div className="max-w-[34rem] space-y-4">
                  <h1 className="text-[clamp(30px,5vw,56px)] font-bold leading-[1.02] tracking-[-1.8px]">
                    Analitik akışa bağlan,
                    <span className="block text-blue-300">öğrenme panelini aç.</span>
                  </h1>
                  <p className="max-w-[32rem] text-[13px] leading-7 text-slate-300 md:text-[14px]">
                    Platformun mevcut tipografisi, katmanlı yüzeyleri ve mavi vurgu diline uyumlu bir erişim alanı. Giriş ve kayıt süreçleri tek akış içinde, sakin ama canlı geçişlerle tasarlandı.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {trustMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-[24px] border border-white/10 bg-white/7 px-4 py-4 backdrop-blur-sm">
                      <div className="text-[24px] font-bold tracking-[-1px] text-white">{metric.value}</div>
                      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[2px] text-slate-400">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <div className="rounded-[26px] border border-white/10 bg-white/7 p-5 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate-400">Erişim Hazırlığı</p>
                      <p className="mt-1 text-[13px] text-slate-200">Form ilerleme durumun canlı olarak hesaplanır.</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[28px] font-bold tracking-[-1px] text-white">{completion}%</div>
                      <div className="text-[10px] uppercase tracking-[2px] text-slate-500">Tamamlandı</div>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-200 transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/7 p-5 backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate-400">Akış</p>
                  <div className="mt-4 space-y-3">
                    {highlights.map((item, index) => (
                      <div key={item} className="flex items-center gap-3 text-[12px] text-slate-200">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/8 text-[10px] font-semibold text-blue-200">
                          0{index + 1}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative flex items-center">
            <div className="w-full rounded-[32px] border border-white/80 bg-white/82 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
              <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.85),rgba(255,255,255,0.94))] p-5 md:p-7">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate-400">
                      {mode === 'login' ? 'Hesabına dön' : 'Yeni profil oluştur'}
                    </p>
                    <h2 className="mt-2 text-[28px] font-bold tracking-[-1.2px] text-[#111827]">
                      {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                    </h2>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleModeChange('login')}
                      className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[1.8px] transition-all ${
                        mode === 'login' ? 'bg-[#2563EB] text-white shadow-[0_10px_20px_rgba(37,99,235,0.25)]' : 'text-slate-500 hover:text-[#111827]'
                      }`}
                    >
                      Giriş
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange('register')}
                      className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[1.8px] transition-all ${
                        mode === 'register' ? 'bg-[#2563EB] text-white shadow-[0_10px_20px_rgba(37,99,235,0.25)]' : 'text-slate-500 hover:text-[#111827]'
                      }`}
                    >
                      Kayıt
                    </button>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {mode === 'register' && (
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[2px] text-slate-400">Ad Soyad</span>
                      <input
                        type="text"
                        value={activeForm.name}
                        onChange={(event) => handleChange('name', event.target.value)}
                        onFocus={() => setFocusedField('name')}
                        className={`w-full rounded-[20px] border px-4 py-3 text-[14px] outline-none transition-all duration-200 ${inputClassName('name')}`}
                        placeholder="Ada Lovelace"
                      />
                      {errors.name && <span className="mt-2 block text-[11px] text-rose-500">{errors.name}</span>}
                    </label>
                  )}

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[2px] text-slate-400">E-posta</span>
                    <input
                      type="email"
                      value={activeForm.email}
                      onChange={(event) => handleChange('email', event.target.value)}
                      onFocus={() => setFocusedField('email')}
                      className={`w-full rounded-[20px] border px-4 py-3 text-[14px] outline-none transition-all duration-200 ${inputClassName('email')}`}
                      placeholder="ornek@codeenigma.com"
                    />
                    {errors.email && <span className="mt-2 block text-[11px] text-rose-500">{errors.email}</span>}
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[2px] text-slate-400">Şifre</span>
                    <div className={`flex items-center rounded-[20px] border transition-all duration-200 ${inputClassName('password')}`}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={activeForm.password}
                        onChange={(event) => handleChange('password', event.target.value)}
                        onFocus={() => setFocusedField('password')}
                        className="w-full bg-transparent px-4 py-3 text-[14px] outline-none"
                        placeholder="En az 6 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="mr-2 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[1.6px] text-slate-500 transition-colors hover:text-[#111827]"
                      >
                        {showPassword ? 'Gizle' : 'Göster'}
                      </button>
                    </div>
                    {errors.password && <span className="mt-2 block text-[11px] text-rose-500">{errors.password}</span>}
                  </label>

                  {mode === 'register' && (
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[2px] text-slate-400">Şifre Tekrar</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={activeForm.confirmPassword}
                        onChange={(event) => handleChange('confirmPassword', event.target.value)}
                        onFocus={() => setFocusedField('confirmPassword')}
                        className={`w-full rounded-[20px] border px-4 py-3 text-[14px] outline-none transition-all duration-200 ${inputClassName('confirmPassword')}`}
                        placeholder="Şifreni tekrar yaz"
                      />
                      {errors.confirmPassword && <span className="mt-2 block text-[11px] text-rose-500">{errors.confirmPassword}</span>}
                    </label>
                  )}

                  <div className="flex items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-white/90 px-4 py-3">
                    <label className="flex items-center gap-3 text-[12px] text-slate-500">
                      <input
                        type="checkbox"
                        checked={mode === 'login' ? activeForm.remember : activeForm.accept}
                        onChange={(event) => handleChange(mode === 'login' ? 'remember' : 'accept', event.target.checked)}
                        className="h-4 w-4 accent-[#2563EB]"
                      />
                      <span>
                        {mode === 'login' ? 'Oturumumu hatırla' : 'Kullanım koşullarını kabul ediyorum'}
                      </span>
                    </label>
                    {mode === 'login' ? (
                      <button type="button" className="text-[11px] font-semibold uppercase tracking-[1.8px] text-[#2563EB] transition-colors hover:text-[#1D4ED8]">
                        Şifremi Unuttum
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold uppercase tracking-[1.8px] text-slate-400">Güvenli kayıt</span>
                    )}
                  </div>
                  {errors.accept && <span className="block text-[11px] text-rose-500">{errors.accept}</span>}

                  <button
                    type="submit"
                    className="group mt-2 flex w-full items-center justify-center gap-3 rounded-[22px] bg-[#2563EB] px-5 py-4 text-[12px] font-semibold uppercase tracking-[2px] text-white shadow-[0_18px_30px_rgba(37,99,235,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
                  >
                    <span>{mode === 'login' ? 'Panele Giriş Yap' : 'Hesabı Oluştur'}</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </button>
                </form>

                <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate-400">Geçiş</p>
                      <p className="mt-1 text-[13px] text-slate-500">
                        {mode === 'login' ? 'Henüz hesabın yok mu?' : 'Zaten bir hesabın var mı?'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[1.8px] text-[#111827] transition-all hover:border-[#2563EB] hover:text-[#2563EB]"
                    >
                      {mode === 'login' ? 'Kayıt Ol' : 'Giriş Yap'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
