import Layout from "@/shared/components/layouts/Layout";
import RoomChatPage from "@/features/room/pages/RoomChatPage";

export const routes = [
  {
    path: "/",
    element: <Layout />, // 이 안에 Outlet이 있어야 함
    children: [
      {
        path: "",
        element: <RoomChatPage />,
      },
    ],
  },
];