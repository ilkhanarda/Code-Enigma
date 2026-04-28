import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
import Logo from "../../assets/logo.jsx";
import Icon from "../ui/icons8-icon.jsx";

const NAV_ITEMS = [
  { icon: "home", label: "Panel", to: "/dashboard", match: ["/dashboard"] },
  { icon: "topics", label: "Konular", to: "/topics", match: ["/topics", "/topic"] },
  { icon: "test", label: "Testler", to: "/test", match: ["/test"] },
  { icon: "warning", label: "Eksikler", to: "/gaps", match: ["/gaps"] },
  { icon: "settings", label: "Ayarlar", to: "/settings", match: ["/settings"] },
];

const MOBILE_DOCK_ITEMS = [
  ...NAV_ITEMS,
  { icon: "profile", label: "Profil", to: "/profile", match: ["/profile"] },
];

function isRouteActive(pathname, matchList = []) {
  return matchList.some((segment) => pathname === segment || pathname.startsWith(`${segment}/`));
}

function NavItem({ item, active }) {
  return (
    <Link
      to={item.to}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex w-full flex-col items-center gap-1.5 rounded-2xl border px-2 py-2.5 text-center no-underline transition-all duration-200",
        active
          ? "border-white/65 bg-gradient-to-br from-blue-600/95 via-blue-500/95 to-cyan-500/95 text-white shadow-[0_18px_34px_rgba(37,99,235,0.32)]"
          : "border-white/50 bg-white/55 text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-blue-200/80 hover:bg-white/75 hover:text-blue-700 hover:shadow-[0_16px_30px_rgba(37,99,235,0.12)]",
      ].join(" ")}
    >
      <Icon name={item.icon} size={18} color={active ? "#ffffff" : "#475569"} />
      <span className={active ? "text-[10px] font-semibold uppercase tracking-[1.2px] text-white/95" : "text-[10px] font-semibold uppercase tracking-[1.2px]"}>
        {item.label}
      </span>
    </Link>
  );
}

function MobileDockItem({ item, active }) {
  return (
    <Link
      to={item.to}
      aria-current={active ? "page" : undefined}
      className={[
        "flex flex-col items-center justify-center rounded-2xl px-1 py-2.5 text-center no-underline transition-all duration-200",
        active
          ? "border border-white/65 bg-gradient-to-br from-blue-600/95 via-blue-500/95 to-cyan-500/95 text-white shadow-[0_14px_28px_rgba(37,99,235,0.28)]"
          : "border border-transparent text-slate-500 hover:border-blue-100/80 hover:bg-white/80 hover:text-blue-700",
      ].join(" ")}
    >
      <Icon name={item.icon} size={17} color={active ? "#ffffff" : "#64748B"} />
      <span className={active ? "mt-1 text-[10px] font-semibold text-white/95" : "mt-1 text-[10px] font-semibold"}>{item.label}</span>
    </Link>
  );
}

export default function DashboardNavbar() {
  const location = useLocation();
  const { user } = useUser();

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[100px] sm:w-[108px] lg:w-[120px] flex-col items-center justify-between overflow-y-auto overscroll-y-contain border-r border-white/55 bg-white/56 px-3 py-5 shadow-[0_24px_70px_rgba(15,23,42,0.1)] backdrop-blur-2xl md:flex">
        <div className="flex w-full shrink-0 flex-col items-center gap-5">
          <Logo size="mg" />

          <div className="h-px w-10 bg-white/80" />

          <div className="flex w-full flex-col items-center gap-2.5 rounded-2xl border border-white/70 bg-white/62 px-3 py-3 text-center shadow-[0_16px_34px_rgba(37,99,235,0.1)] backdrop-blur-xl">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_14px_28px_rgba(37,99,235,0.35)]">
                <Icon name={user.avatar} size={20} />
              </div>
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            <div className="w-full">
              <p className="truncate text-[11px] font-semibold text-slate-900">{user.name}</p>
              <p className="text-[10px] text-slate-500">Sv. {user.level} • {user.streak}g</p>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full border border-amber-100/80 bg-amber-50/80 px-2.5 py-1 text-[10px] font-semibold text-amber-700 backdrop-blur-sm">
              <Icon name="coin" size={11} color="#D97706" />
              <span>{user.coins.toLocaleString("tr-TR")}</span>
            </div>
          </div>

          <div className="h-px w-10 bg-white/80" />

          <nav className="flex w-full flex-col gap-1.5" aria-label="Ana navigasyon">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                active={isRouteActive(location.pathname, item.match)}
              />
            ))}
          </nav>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2">
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/60 bg-white/62 px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[1.1px] text-slate-600 no-underline shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200/80 hover:bg-white/80 hover:text-blue-700 hover:shadow-[0_16px_30px_rgba(37,99,235,0.12)]"
          >
            <Icon name="profile" size={15} color="#64748B" />
            Profil
          </Link>
          <Link
            to="/video"
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/65 bg-gradient-to-br from-blue-600/95 via-blue-500/95 to-cyan-500/95 px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[1.1px] text-white no-underline shadow-[0_18px_34px_rgba(37,99,235,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_20px_36px_rgba(37,99,235,0.32)]"
          >
            <Icon name="video" size={15} color="#ffffff" />
            Video
          </Link>
          <Link
            to="/concept"
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-indigo-100/90 bg-white/62 px-2 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[1.1px] text-indigo-700 no-underline shadow-[0_10px_24px_rgba(79,70,229,0.09)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white/82"
          >
            <Icon name="idea" size={15} color="#4338CA" />
            Concept
          </Link>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-[100] rounded-[28px] border border-white/65 bg-white/70 p-1.5 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-2xl md:hidden">
        <div className="grid grid-cols-6 gap-1">
          {MOBILE_DOCK_ITEMS.map((item) => (
            <MobileDockItem
              key={`mobile-${item.to}`}
              item={item}
              active={isRouteActive(location.pathname, item.match)}
            />
          ))}
        </div>
      </nav>
    </>
  );
}
