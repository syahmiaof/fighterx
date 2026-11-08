import type { Metadata } from "next";
import "./admin.css";
import { AdminProvider } from "@/lib/admin/store";
import { AdminRouteGuard } from "@/lib/admin/guard";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/layout/admin-mobile-nav";

export const metadata: Metadata = {
  title: "FighterX Admin — Pengurusan Sistem & Prestasi Silat",
  description:
    "Portal pentadbir pusat FighterX untuk pengurusan kelab, atlet, jurulatih, program latihan, analitik dan pertandingan silat kebangsaan.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminProvider>
      <AdminRouteGuard>
        <div className="relative min-h-screen bg-[#08090B] text-[#E5E5E7] font-sans selection:bg-[#E10600] selection:text-white flex flex-col">
          {/* Atmospheric Fixed Wallpaper Backdrop */}
          <div className="admin-wallpaper" aria-hidden="true">
            <div className="admin-wallpaper-overlay" />
            <div className="admin-smoke-overlay" />
          </div>

          {/* Universal Desktop Top Header (>= 1024px) */}
          <div className="hidden lg:block relative z-30">
            <AdminHeader />
          </div>

          {/* Mobile Top Header & Drawer Navigation (< 1024px) */}
          <AdminMobileNav />

          {/* Main Layout Container */}
          <div className="relative z-10 flex-1 flex w-full">
            {/* Desktop Compact Grouped Sidebar (250px) */}
            <AdminSidebar />

            {/* Scrollable Content Viewport */}
            <main className="flex-1 min-w-0 flex flex-col">
              <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto admin-panel-enter">
                {children}
              </div>
            </main>
          </div>
        </div>
      </AdminRouteGuard>
    </AdminProvider>
  );
}
