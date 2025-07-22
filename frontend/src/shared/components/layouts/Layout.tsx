import { Outlet } from "react-router-dom";

const Layout = () => (
    <div className="flex flex-col h-screen">
      <nav className="bg-white shadow px-6 py-4">QnA Title</nav>
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
)

export default Layout;
