// app/dashboard/layout.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="radial-glow-bg min-h-screen w-full">
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <main className="radial-glow-bg relative z-10 flex flex-col min-h-screen p-4 md:p-6 ">
            <div className="glass rounded-2xl flex-1 p-6 border border-[rgba(0,255,170,0.15)]">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
