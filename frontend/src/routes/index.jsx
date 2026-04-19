import { createBrowserRouter, Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import CommandPalette from '../components/command-palette.jsx'

const App        = lazy(() => import('../App.jsx'))
const Absent     = lazy(() => import('../pages/absent.jsx'))
const Auth       = lazy(() => import('../pages/public/auth.jsx'))
const Profile    = lazy(() => import('../pages/dashboard/profile.jsx'))
const Video      = lazy(() => import('../pages/dashboard/video.jsx'))
const Dashboard  = lazy(() => import('../pages/dashboard/dashboard.jsx'))
const Test       = lazy(() => import('../pages/dashboard/test.jsx'))
const Topics     = lazy(() => import('../pages/dashboard/topics.jsx'))
const Gaps       = lazy(() => import('../pages/dashboard/gaps.jsx'))
const Settings   = lazy(() => import('../pages/dashboard/settings.jsx'))

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

function RootLayout() {
  return (
    <>
      <CommandPalette />
      <Suspense fallback={<Fallback />}>
        <Outlet />
      </Suspense>
    </>
  )
}

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { path: '/',          element: <App /> },
        { path: '/login',     element: <Auth /> },
        { path: '/register',  element: <Auth /> },
        { path: '/absent',    element: <Absent /> },
        { path: '/profile',   element: <Profile /> },
        { path: '/video',     element: <Video /> },
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/test',      element: <Test /> },
        { path: '/topics',    element: <Topics /> },
        { path: '/gaps',      element: <Gaps /> },
        { path: '/settings',  element: <Settings /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
)

export default router
