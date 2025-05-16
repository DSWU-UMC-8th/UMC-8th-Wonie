import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidbar";
import { useState } from "react";
import { ReactNode } from "react";

interface HomeLayoutProps {
  children?: ReactNode;
}

const HomePageLayout = ({ children }: HomeLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex flex-col flex-1 overflow-auto bg-black text-white">
          <main className="flex-1 overflow-auto">{children ?? <Outlet />}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePageLayout;
