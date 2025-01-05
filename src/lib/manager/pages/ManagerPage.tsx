import Sidebar from "@/lib/all-site/SideBar";
import { Briefcase, ClipboardList, FileText, Home, ClipboardCheck, Mail } from "lucide-react";
import * as React from "react";
import LogoSitePlus from "/icons/logo-SitePlus.svg";
import { useAuth } from "../../../services/AuthContext";
import Header from "../../all-site/HeaderOtherRole";
import StatsCards from "../components/home-manager/StatsCard";
import DashboardCharts from "../components/home-manager/DashboardCharts";
import UserManagement from "../components/home-manager/UserManagement";


export default function ManagerPage() {
  const managerItems = [
    {
      icon: <Home size={20} />,
      label: "HOME",
      href: "/manager-page",
      isActive: true,
    },
    {
      icon: <Mail size={20} />,
      label: "REQUEST",
      href: "/manager-request",
    },
    {
      icon: <Briefcase size={20} />,
      label: "ASSIGN TASK",
      href: "/manager-task",
    },
    {
      icon: <FileText size={20} />,
      label: "SURVEY",
      href: "/manager-survey",
    },
  ];

  const { handleLogout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden"> 
      
      <div className="flex-none"> 
        <Sidebar
          onLogout={handleLogout}
          logoHref={LogoSitePlus}
          title="Manager"
          mainNavItems={managerItems}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          defaultLocation="Quận 7 - TPHCM"
          onSearch={() => {
            // Xử lý tìm kiếm
          }}
          onNotificationClick={() => {
            // Xử lý khi click vào notification
          }}
        />

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-12 max-w-full">
            <h2 className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl">HOME</h2>
            <StatsCards />
            <DashboardCharts />
            <UserManagement />
          </div>
        </div>
      </div>
    </div>
  );
}
