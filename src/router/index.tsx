import { createBrowserRouter, type RouteObject } from "react-router-dom";
import AdminLayout from "@/layout/AdminLayout";
import MainLayout from "@/layout/MainLayout";
import AdminPage from "@/page/admin";
import HomePage from "@/page/home";
import LoginPage from "@/page/auth/login";
import { NAV_PATH } from "./paths";
import BookingPage from "@/page/customer/booking";
import TherapistPage from "@/page/customer/therapist";
import AdminOperationManagementPage from "@/page/admin/operation-mng";
import RegisterPage from "@/page/auth/register";

const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: NAV_PATH.HOME,
        element: <HomePage />,
      },
      {
        path: NAV_PATH.LOGIN,
        element: <LoginPage />,
      },
      {
        path: NAV_PATH.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: NAV_PATH.BOOKING,
        element: <BookingPage />,
      },
      {
        path: NAV_PATH.THERAPIST,
        element: <TherapistPage />,
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
      },
      {
        path: "operations",
        element: <AdminOperationManagementPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
