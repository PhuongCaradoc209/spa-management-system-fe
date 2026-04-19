import { createBrowserRouter, type RouteObject } from "react-router-dom";
import AdminLayout from "@/layout/AdminLayout";
import MainLayout from "@/layout/MainLayout";
import AdminPage from "@/page/admin";
import HomePage from "@/page/home";
import LoginPage from "@/page/auth/login";
import { NAV_PATH } from "./paths";

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: NAV_PATH.HOME,
        element: <HomePage />,
        index: true,
      },
      {
        path: NAV_PATH.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: NAV_PATH.ADMIN,
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <AdminPage />,
        index: true,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
