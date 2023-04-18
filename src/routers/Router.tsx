import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
const HomeLayout = lazy(() => import("../components/layouts/HomeLayout"))
const BackofficeLayout = lazy(() => import('@/components/layouts/BackofficeLayout'))

const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/home/Login"));
const Register = lazy(() => import("../pages/home/Register"));

const BackofficeHome = lazy(() => import("@/pages/backoffice/Home"))

const router: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      }
    ]
  },
  {
    path: '/backoffice',
    element: <ProtectedRoute><BackofficeLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <BackofficeHome />
      }
    ]
  }
];
export default router
