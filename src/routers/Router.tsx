import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import HomeLayout from "../components/layouts/HomeLayout"

const Home = lazy(() => import("../pages/home/Home"));
const Login = lazy(() => import("../pages/home/Login"));
const Register = lazy(() => import("../pages/home/Register"));

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
  }
];
export default router
