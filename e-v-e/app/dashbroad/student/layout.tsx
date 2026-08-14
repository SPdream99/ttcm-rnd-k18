import Header from "@/components/student/Header";
import Sidebar from "@/components/student/Sidebar";
import { ToastProvider } from "@/components/student/Toast";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="w-64 shrink-0">
          <Sidebar />
        </aside>

        {/* RIGHT SIDE */}
        <main className="flex-1 p-4 md:p-4 z-10 space-y-8">

          {/* HEADER */}
          <Header />
          <div>
            {/* CONTENT */}
            {children}
          </div>
        </main>

      </div>
    </ToastProvider>
  );
}