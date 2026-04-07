import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Absent from '../pages/absent.jsx'
import Profile from '../pages/dashboard/profile.jsx'
import Video2 from '../pages/dashboard/video.jsx'
import Dashboard from '../pages/dashboard/dashboard.jsx'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/absent',
      element: <Absent />,
    },
    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '/video2',
      element: <Video2 />,
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
)

export default router