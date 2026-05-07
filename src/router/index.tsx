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
        index: true,
      },
      {
        path: "operations",
        element: <AdminOperationManagementPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
