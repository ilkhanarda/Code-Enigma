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
        "group relative flex w-full flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center no-underline transition-all duration-200",
        active
          ? "border-blue-200 bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_12px_26px_rgba(37,99,235,0.34)]"
          : "border-transparent text-slate-500 hover:border-blue-100 hover:bg-blue-50/75 hover:text-blue-700",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
          active
            ? "bg-white/15 ring-1 ring-white/30"
            : "bg-slate-100 group-hover:bg-blue-100",
        ].join(" ")}
      >
        <Icon name={item.icon} size={18} color={active ? "#ffffff" : "#475569"} />
      </span>
      <span className={active ? "text-[9px] font-semibold uppercase tracking-[1.2px] text-white/95" : "text-[9px] font-semibold uppercase tracking-[1.2px]"}>
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
          ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_8px_20px_rgba(37,99,235,0.34)]"
          : "text-slate-500 hover:bg-blue-50 hover:text-blue-700",
      ].join(" ")}
    >
      <Icon name={item.icon} size={17} color={active ? "#ffffff" : "#64748B"} />
      <span className={active ? "mt-1 text-[9px] font-semibold text-white/95" : "mt-1 text-[9px] font-semibold"}>{item.label}</span>
    </Link>
  );
}

export default function DashboardNavbar() {
  const location = useLocation();
  const { user } = useUser();

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[88px] sm:w-[94px] lg:w-[104px] flex-col items-center justify-between border-r border-slate-200/75 bg-white/88 px-2 py-4 shadow-[8px_0_32px_rgba(15,23,42,0.08)] backdrop-blur-xl md:flex">
        <div className="flex w-full flex-col items-center gap-4">
          <Logo size="mg" />

          <div className="h-px w-10 bg-slate-200/90" />

          <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-blue-50/40 px-2 py-2.5 text-center shadow-sm">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_10px_20px_rgba(37,99,235,0.35)]">
                <Icon name={user.avatar} size={20} />
              </div>
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            <div className="w-full">
              <p className="truncate text-[10px] font-semibold text-slate-900">{user.name}</p>
              <p className="text-[9px] text-slate-500">Sv. {user.level} • {user.streak}g</p>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700">
              <Icon name="coin" size={11} color="#D97706" />
              <span>{user.coins.toLocaleString("tr-TR")}</span>
            </div>
          </div>

          <div className="h-px w-10 bg-slate-200/90" />

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

        <div className="flex w-full flex-col gap-2">
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-2 py-2.5 text-center text-[9px] font-semibold uppercase tracking-[1.1px] text-slate-500 no-underline transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <Icon name="profile" size={15} color="#64748B" />
            Profil
          </Link>
          <Link
            to="/video"
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-blue-200 bg-blue-600 px-2 py-2.5 text-center text-[9px] font-semibold uppercase tracking-[1.1px] text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_12px_24px_rgba(37,99,235,0.25)]"
          >
            <Icon name="video" size={15} color="#ffffff" />
            Video
          </Link>
          <Link
            to="/concept"
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-indigo-200 bg-indigo-50 px-2 py-2.5 text-center text-[9px] font-semibold uppercase tracking-[1.1px] text-indigo-700 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100"
          >
            <Icon name="idea" size={15} color="#4338CA" />
            Concept
          </Link>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-[100] rounded-[28px] border border-slate-200/80 bg-white/95 p-1.5 shadow-[0_14px_34px_rgba(15,23,42,0.16)] backdrop-blur-xl md:hidden">
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
