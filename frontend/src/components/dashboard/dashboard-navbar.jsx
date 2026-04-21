import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
import Logo from "../../assets/logo.jsx";
import Icon from "../ui/icons8-icon.jsx";

const NAV_ITEMS = [
  { icon: "home", label: "Panel", to: "/dashboard" },
  { icon: "topics", label: "Konular", to: "/topics" },
  { icon: "test", label: "Testler", to: "/test" },
  { icon: "warning", label: "Eksiklerim", to: "/gaps" },
  { icon: "settings", label: "Ayarlar", to: "/settings" },
];

function NavItem({ icon, label, to, active }) {
  return (
    <Link
      to={to}
      className={`
        group relative flex w-full flex-col items-center gap-1.5
        rounded-2xl px-2 py-3 text-center no-underline
        transition-all duration-200 ease-out
        ${active
          ? "bg-[#2563EB] text-white shadow-md shadow-blue-200"
          : "text-slate-400 hover:bg-slate-50 hover:text-[#2563EB]"
        }
      `}
    >
      {/* Active left-border indicator */}
      {active && (
        <span className="absolute -left-2.5 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#2563EB]" />
      )}

      <Icon
        name={icon}
        size={18}
        className={`transition-transform duration-200 ${!active ? "group-hover:scale-110" : ""}`}
      />
      <span className={`text-[8.5px] font-bold uppercase tracking-[1.4px] leading-tight ${active ? "text-white/90" : ""}`}>
        {label}
      </span>
    </Link>
  );
}

export default function DashboardNavbar() {
  const location = useLocation();
  const { user } = useUser();

  return (
    <aside className="sticky top-0 flex h-screen w-[88px] flex-col items-center justify-between border-r border-slate-100 bg-white px-2 py-4 shadow-[4px_0_24px_rgba(15,23,42,.05)]">

      {/* ── TOP ── */}
      <div className="flex w-full flex-col items-center gap-4">

        {/* Logo */}
       <Logo size="mg" />
        {/* Divider */}
        <div className="h-px w-10 bg-slate-100" />

        {/* User area */}
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-white/80 bg-white/80 px-1.5 py-2 bg-[linear-gradient(180deg,#f8fafc,#f1f5f9)] rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-white bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-[20px] shadow-md shadow-blue-100">
                <Icon name={user.avatar} size={20} />
              </div>
              <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <div className="text-center">
              <div className="text-[9px] font-semibold leading-tight text-[#111827]">{user.name}</div>
              <div className="text-[8px] font-medium text-slate-400">Sv. {user.level}</div>
            </div>
            <div className="mt-0.5 flex items-center gap-1 rounded-lg border border-amber-200/70 bg-gradient-to-r from-amber-50 to-yellow-50 px-2 py-1">
              <Icon name="coin" size={12} />
              <span className="text-[9px] font-bold tracking-tight text-amber-900">{user.coins.toLocaleString("tr-TR")}</span>
            </div>
          </div>

        {/* Divider */}
        <div className="h-px w-10 bg-slate-100" />

        {/* Navigation */}
        <nav className="flex w-full flex-col gap-1.5" aria-label="Ana Navigasyon">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              active={location.pathname === item.to}
            />
          ))}
        </nav>
      </div>

      {/* ── BOTTOM ── */}
      <div className="flex w-full flex-col gap-2">
        <Link
          to="/profile"
          className="rounded-xl border border-slate-100 bg-white py-2 text-center text-[8.5px] font-bold uppercase tracking-[1.3px] text-slate-400 no-underline transition-all duration-150 hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
        >
          Profil
        </Link>
        <Link
          to="/video"
          className="rounded-xl bg-[#2563EB] py-2 text-center text-[8.5px] font-bold uppercase tracking-[1.3px] text-white no-underline transition-all duration-150 hover:bg-[#1D4ED8] hover:shadow-md hover:shadow-blue-200"
        >
          Video
        </Link>
      </div>
    </aside>
  );
}
