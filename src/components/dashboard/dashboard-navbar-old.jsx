import { Link } from "react-router-dom";

function NavItem({ icon, label, active = false }) {
  return (
    <button
      type="button"
      className={`flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center transition ${
        active
          ? "bg-[#2563EB] text-white shadow-md"
          : "text-slate-500 hover:bg-slate-100 hover:text-[#2563EB]"
      }`}
    >
      <span className="text-[18px] leading-none">{icon}</span>
      <span className="text-[9px] font-semibold uppercase tracking-[1.2px]">{label}</span>
    </button>
  );
}

export default function DashboardNavbar() {
  return (
    <aside className="side-nav-shadow sticky top-0 flex h-screen w-[100px] flex-col items-center justify-between border-r border-slate-200 bg-white px-2.5 py-5">
      <div className="flex w-full flex-col items-center gap-4">
        <Link to="/" className="flex flex-col items-center gap-2 no-underline">
          <div className="logo-hex flex h-9 w-9 items-center justify-center bg-[#2563EB] text-[10px] font-bold tracking-tight text-white">
            C:E
          </div>
          <span className="text-center text-[9px] font-semibold uppercase tracking-[2px] text-slate-400">
            Code:Enigma
          </span>
        </Link>

        <div className="flex w-full flex-col items-center gap-2.5 rounded-[24px] border border-slate-100 bg-slate-50 px-2.5 py-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-[linear-gradient(135deg,#2563EB,#7C3AED)] text-[22px] shadow-md">
            🦊
          </div>
          <div className="text-center">
            <div className="mt-0.5 text-[10px] font-semibold text-[#111827]">İlkhan Arda</div>
          </div>
        </div>

        <div className="w-full rounded-[24px] border border-amber-200 bg-[linear-gradient(135deg,#FFFBEB,#FEF3C7)] px-2.5 py-3 text-center shadow-sm">
          <div className="text-[18px]">🪙</div>
          <div className="mt-0.5 text-[13px] font-bold tracking-tight text-amber-900">1.240</div>
        </div>

        <div className="my-2 h-px w-10 bg-slate-200" />

        <nav className="flex w-full flex-col gap-2">
          <NavItem icon="⌂" label="Kontrol Paneli" active />
          <NavItem icon="📘" label="Konular" />
          <NavItem icon="📝" label="Testler" />
          <NavItem icon="⚠️" label="Eksiklerim" />
          <NavItem icon="⚙️" label="Ayarlar" />
          <NavItem icon="💬" label="Bildirimler" />
          <NavItem icon="❓" label="Yardım" />
        </nav>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Link
          to="/profile"
          className="rounded-2xl border border-slate-200 bg-white px-2.5 py-2 text-center text-[9px] font-semibold uppercase tracking-[1.2px] text-slate-500 no-underline transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
        >
          Profile Git
        </Link>
        <Link
          to="/video2"
          className="rounded-2xl bg-[#2563EB] px-2.5 py-2 text-center text-[9px] font-semibold uppercase tracking-[1.2px] text-white no-underline transition hover:bg-[#1D4ED8]"
        >
          Video Aç
        </Link>
      </div>
    </aside>
  );
}