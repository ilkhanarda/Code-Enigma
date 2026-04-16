import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const App        = lazy(() => import('../App.jsx'))
const Absent     = lazy(() => import('../pages/absent.jsx'))
const Profile    = lazy(() => import('../pages/dashboard/profile.jsx'))
const Video      = lazy(() => import('../pages/dashboard/video.jsx'))
const Dashboard  = lazy(() => import('../pages/dashboard/dashboard.jsx'))
const Test       = lazy(() => import('../pages/dashboard/test.jsx'))
const StubPage   = lazy(() => import('../pages/dashboard/stub.jsx'))

function Fallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] font-['IBM_Plex_Mono',monospace]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#2563EB]" />
        <span className="text-[10px] font-semibold uppercase tracking-[2px] text-slate-400">Yükleniyor</span>
      </div>
    </div>
  )
}

const wrap = (el) => <Suspense fallback={<Fallback />}>{el}</Suspense>

const router = createBrowserRouter(
  [
    { path: '/',          element: wrap(<App />) },
    { path: '/absent',    element: wrap(<Absent />) },
    { path: '/profile',   element: wrap(<Profile />) },
    { path: '/video',     element: wrap(<Video />) },
    { path: '/dashboard', element: wrap(<Dashboard />) },
    { path: '/test',      element: wrap(<Test />) },
    { path: '/topics',    element: wrap(<StubPage title="Konular"    icon="📘" description="Konu kütüphanesi yakında burada olacak." />) },
    { path: '/gaps',      element: wrap(<StubPage title="Eksiklerim" icon="⚠️" description="Zayıf olduğun konular ve önerilen çalışma planı yakında burada." />) },
    { path: '/settings',  element: wrap(<StubPage title="Ayarlar"    icon="⚙️" description="Hesap ve bildirim ayarları yakında burada." />) },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
)

export default router
