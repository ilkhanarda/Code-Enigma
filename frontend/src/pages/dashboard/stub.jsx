import DashboardNavbar from "../../components/dashboard/dashboard-navbar.jsx";

export default function StubPage({ title = "Yapım aşamasında", icon = "🚧", description = "Bu bölüm yakında kullanıma açılacak." }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FB] font-['IBM_Plex_Mono',monospace] text-[#111827]">
      <DashboardNavbar />
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="mb-4 text-5xl">{icon}</div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800">{title}</h1>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-500">{description}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-[10px] font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Yapım Aşamasında
          </div>
        </div>
      </main>
    </div>
  );
}
