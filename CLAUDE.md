# Code-Enigma

Matematik odaklı, kişiselleştirilmiş akademik gelişim platformu. Arayüz dili Türkçe.

## Teknoloji

- React 19 + React Router v7 (`createBrowserRouter`, `lazy` + `<Suspense>` ile route-level code splitting)
- Vite 8 (`base: '/Code-Enigma/'` — GitHub Pages deploy)
- Tailwind CSS 4 (`@tailwindcss/vite` eklentisi, ayrı config yok)
- Font: IBM Plex Mono — **`index.html`'de tek `<link>` ile yüklenir**, bileşenlerde re-import etme.

## Komutlar

```bash
npm run dev      # Vite dev server
npm run build    # prod build
npm run preview  # build önizleme
npm run lint     # eslint (not: @eslint/js kurulumu bozuk olabilir)
```

## Klasör Yapısı

```
src/
├── App.jsx                    # ana sayfa (home) — hero + sistem + modüller + görevler
├── main.jsx                   # UserProvider + RouterProvider bağlanır
├── index.css                  # @import "tailwindcss";
├── routes/index.jsx           # tüm rotalar + code splitting
├── context/UserContext.jsx    # global kullanıcı state (mock)
├── data/questions/            # test soruları (güvenirlik.js vs.)
├── pages/
│   ├── absent.jsx
│   ├── dashboard/             # dashboard, profile, video, test, stub
│   └── public/home.jsx        # alternatif home (rotası yok)
└── components/
    ├── public/                # navbar.jsx, footer.jsx
    └── dashboard/             # dashboard-navbar.jsx
```

## Rotalar

Hepsi `src/routes/index.jsx`'te `lazy` + `<Suspense>` ile:
`/`, `/absent`, `/profile`, `/video`, `/dashboard`, `/test`, `/topics`, `/gaps`, `/settings`.

`/topics`, `/gaps`, `/settings` `StubPage` kullanıyor — placeholder.

## Dosya Özetleri

### `src/App.jsx`
Ana sayfa. Public `Navbar` + `Footer`. Hero + sistem kartları + modüller + görev listesi. Orbit animasyonu inline `<style>` keyframes.

### `src/pages/dashboard/dashboard.jsx`
Dashboard ana panel. `DashboardNavbar` + `flex-1` içerik. Statik `suggestedTopics`. Tailwind.

### `src/pages/dashboard/profile.jsx` (~890 satır)
Profil. **Tailwind değil, inline `style={}` + inline `<style>` CSS** karışımı — tarihsel sebep, dönüşüm henüz yapılmadı. Statik veri: `initialTasks`, `stats`, `badges`, `weeklyRanking`, `classRanking`. İç header/footer. `DashboardNavbar` flex layout.

### `src/pages/dashboard/video.jsx`
Video izleme. `styles` objesi (inline) kullanır, Tailwind değil — profile.jsx ile aynı istisna. `DashboardNavbar` + `ChapterSidebar`.

### `src/pages/dashboard/test.jsx` (~700 satır)
Test/quiz — "Psikolojik Ölçme — Güvenirlik Testi".
- Sorular `src/data/questions/guvenirlik.js`'den import edilir.
- İç bileşenler: `ProgressBar`, `SectionLabel`, `IconBtn`, `useTimer`, `QuestionPalette`, `HintPanel`, `ExplanationPanel`, `InteractionBar`.
- State: `currentId`, `answers`, `flagged`, `favorites`, `showFinish`, `testFinished`.
- **Reveal deseni**: Doğru/yanlış renkler ve `ExplanationPanel` yalnızca `testFinished=true` olunca görünür.
- `useTimer(TOTAL_SECONDS, onExpire)` — süre bitince otomatik `testFinished=true`.
- Palette: active=`bg-blue-600`, answered=`bg-blue-400`, flagged=`bg-amber-400`, empty=slate.

### `src/pages/dashboard/stub.jsx`
`StubPage` — /topics, /gaps, /settings için placeholder. Title/icon/description prop alır.

### `src/pages/absent.jsx`
Devamsızlık sayfası. Public `Navbar` kullanır (dashboard değil).

### `src/components/public/navbar.jsx` / `footer.jsx`
Public sayfalar için. Dashboard sayfalarında **kullanılmaz**.

### `src/components/dashboard/dashboard-navbar.jsx` (~120 satır)
Sol sticky sidebar (88px). `NAV_ITEMS`: Panel→`/dashboard`, Konular→`/topics`, Testler→`/test`, Eksiklerim→`/gaps`, Ayarlar→`/settings`. Altta Profil + Video link. Kullanıcı bilgileri `useUser()` ile `UserContext`'ten gelir.

### `src/context/UserContext.jsx`
Global kullanıcı state. `MOCK_USER = { name: "İlkhan", avatar: "🦊", level: 12, coins: 1240, streak: 7 }`. `useUser()` hook'u ile her yerden erişilir. Backend gelince buradan değiştirilir.

### `src/routes/index.jsx`
`createBrowserRouter` + `lazy` import'lar + `<Suspense fallback={<Fallback/>}>`. `basename: import.meta.env.BASE_URL`.

## Kural: Dashboard sayfalarında layout

```jsx
<div className="flex min-h-screen ...">
  <DashboardNavbar />
  <div className="flex-1 min-w-0">{/* içerik */}</div>
</div>
```

## Stil Kuralları

- **Tailwind utility sınıfları** varsayılan. Ayrı CSS dosyası yazma; animasyon/keyframes için inline `<style>` bloğu kullan (bkz. App.jsx orbit).
- **İstisna**: `profile.jsx` ve `video.jsx` inline `style={}` + CSS kullanıyor (ileride Tailwind'e dönüştürülecek).
- Renk paleti: `#2563EB` (mavi), `#7C3AED` (mor), `#059669` (yeşil), `#111827` (metin), `#F8F9FB` (arka plan).
- Türkçe metin, Türkçe başlıklar.
- Bileşenler `.jsx`, dosya adları **lowercase** (`test.jsx`, `profile.jsx`), default export.

## Dikkat

- `src/pages/public/home.jsx` rotasız duran alternatif tasarım — silme.
- `public/` klasörü statik varlıklar için.
- Deploy base path `/Code-Enigma/` — asset linklerinde `import.meta.env.BASE_URL` kullan.
- `index.html` `lang="tr"`.
