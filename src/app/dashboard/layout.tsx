import Sidebar from "../components/Sidebar";
import ChatAssistant from "../components/ChatAssistant";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-sa-hero text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-8rem] h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute right-10 bottom-0 h-[420px] w-[420px] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute inset-x-0 top-1/3 h-60 overflow-hidden">
          <div className="absolute left-[-30%] h-full w-[160%] origin-left -rotate-12 scale-y-110 bg-gradient-to-r from-emerald-400/30 via-black/0 to-amber-400/30 opacity-70" />
        </div>
        <div className="sa-flag-banner" />
      </div>

      <Sidebar />
      <div className="relative md:ml-64 pt-14 md:pt-0">
        <div className="relative z-10 mx-auto max-w-[1680px] px-4 pb-12">
          <div className="sa-panel-3d rounded-[32px] border border-white/10 bg-sa-panel shadow-[0_24px_120px_rgba(0,0,0,0.28)] p-0">
            {children}
          </div>
        </div>
      </div>
      <ChatAssistant />
    </div>
  );
}