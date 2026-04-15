import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Absent from '../pages/absent.jsx'
import Profile from '../pages/dashboard/profile.jsx'
import Video from '../pages/dashboard/video.jsx'
import Dashboard from '../pages/dashboard/dashboard.jsx'
import Test from '../pages/dashboard/Test.jsx'

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
      path: '/video',
      element: <Video />,
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/test',
      element: <Test />,
    },

  ],
  {
    basename: import.meta.env.BASE_URL,
  }
)

export default router