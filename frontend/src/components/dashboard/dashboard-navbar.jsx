import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";

const NAV_ITEMS = [
  { icon: "⌂",  label: "Panel",        to: "/dashboard" },
  { icon: "📘", label: "Konular",       to: "/topics"    },
  { icon: "📝", label: "Testler",       to: "/test"     },
  { icon: "⚠️", label: "Eksiklerim",   to: "/gaps"      },
  { icon: "⚙️", label: "Ayarlar",      to: "/settings"  },
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

      <span className={`text-[17px] leading-none transition-transform duration-200 ${!active && "group-hover:scale-110"}`}>
        {icon}
      </span>
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
        <Link to="/" className="flex flex-col items-center gap-1.5 no-underline group" aria-label="Code:Enigma Ana Sayfa">
          <div
            className="flex h-9 w-9 items-center justify-center bg-[#2563EB] text-[10px] font-bold tracking-tighter text-white transition-transform duration-200 group-hover:scale-105"
            style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
          >
            C:E
          </div>
          <span className="text-center text-[7.5px] font-bold uppercase tracking-[2.5px] text-slate-300">
            Enigma
          </span>
        </Link>

        {/* Divider */}
        <div className="h-px w-10 bg-slate-100" />

        {/* User card */}
        <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 px-2 py-3">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-white bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-[21px] shadow-md shadow-blue-100">
              {user.avatar}
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="text-center">
            <div className="text-[10px] font-semibold leading-tight text-[#111827]">{user.name}</div>
            <div className="text-[8px] font-medium text-slate-400">Sv. {user.level}</div>
          </div>
        </div>

        {/* Coin chip */}
        <div className="flex w-full flex-col items-center gap-0.5 rounded-xl border border-amber-200/70 bg-gradient-to-b from-amber-50 to-yellow-50 px-2 py-2.5 shadow-sm">
          <span className="text-base leading-none">🪙</span>
          <span className="text-[12px] font-bold tracking-tight text-amber-900">{user.coins.toLocaleString("tr-TR")}</span>
          <span className="text-[7.5px] font-semibold uppercase tracking-[1px] text-amber-500">Coin</span>
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
