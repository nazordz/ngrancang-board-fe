import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import HasLoggedRoute from "./HasLoggedRoute";
const HomeLayout = lazy(() => import("../components/layouts/HomeLayout"));
const BackofficeLayout = lazy(
  () => import("@/components/layouts/BackofficeLayout")
);

const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/home/Login"));
const Register = lazy(() => import("../pages/home/Register"));

const BackofficeHome = lazy(() => import("@/pages/backoffice/Home"));
const Setting = lazy(() => import("@/pages/backoffice/settings/Setting"));
const Projects = lazy(() => import("@/pages/Projects"));
const YourWork = lazy(() => import("@/pages/YourWork"));
const Backlogs = lazy(() => import("@/pages/backlogs/Backlogs"));
const Issue = lazy(() => import("@/pages/issues"));
const ActiveSprint = lazy(() => import("@/pages/activeSprint/ActiveSprint"));
const Users = lazy(() => import("@/pages/users/Users"));
const Profile = lazy(() => import("@/pages/Profile"));
const ReportSprint = lazy(() => import("@/pages/reportSprint/ReportSprint"));

const router: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: (
          <HasLoggedRoute>
            <Login />
          </HasLoggedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <HasLoggedRoute>
            <Register />
          </HasLoggedRoute>
        ),
      },
    ],
  },
  {
    path: "/your-work",
    element: (
      <ProtectedRoute>
        <BackofficeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <YourWork />,
      },
    ],
  },
  {
    path: "/backoffice",
    element: (
      <ProtectedRoute>
        <BackofficeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <BackofficeHome />,
      },
    ],
  },
  {
    path: "settings",
    element: (
      <ProtectedRoute>
        <BackofficeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Setting />,
      },
    ],
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <BackofficeLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <Profile /> }],
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/backlog",
    element: (
      <ProtectedRoute>
        <BackofficeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Backlogs />,
      },
    ],
  },
  {
    path: "/active-sprint",
    element: (
      <ProtectedRoute>
        <BackofficeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ActiveSprint />,
      },
    ],
  },
  {
    path: 'report',
    element: (
      <ProtectedRoute>
        <BackofficeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ReportSprint />
      }
    ]
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <BackofficeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Users />,
      },
    ],
  },
  {
    path: "/issues",
    element: (
      <ProtectedRoute>
        <BackofficeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Issue />,
      },
    ],
  },
];
export default router;
