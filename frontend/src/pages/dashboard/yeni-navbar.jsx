import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
import Logo from "../../assets/logo.jsx";
import Icon from "../ui/icons8-icon.jsx";

const STORAGE_KEY = "code-enigma:sidebar-collapsed";

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

function DesktopNavItem({ item, active, collapsed }) {
  return (
    <Link
      to={item.to}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex items-center overflow-hidden rounded-2xl border px-3 py-3 text-left no-underline transition-all duration-200",
        collapsed ? "justify-center" : "justify-start gap-3.5",
        active
          ? "border-blue-200 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_12px_28px_rgba(37,99,235,0.32)]"
          : "border-transparent text-slate-500 hover:border-blue-100 hover:bg-blue-50/70 hover:text-blue-700",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
          active
            ? "bg-white/16 ring-1 ring-white/30"
            : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700",
        ].join(" ")}
      >
        <Icon name={item.icon} size={18} color={active ? "#ffffff" : "#475569"} />
      </span>

      {!collapsed && (
        <div className="min-w-0">
          <p className={active ? "text-[13px] font-semibold text-white" : "text-[13px] font-semibold"}>{item.label}</p>
          <p className={active ? "text-[11px] text-blue-100" : "text-[11px] text-slate-400"}>Öğrenme alanı</p>
        </div>
      )}

      {active && !collapsed && <span className="absolute inset-y-2 right-2 w-1 rounded-full bg-white/80" />}
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
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "false");
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
    } catch {
      /* ignore storage errors */
    }
  }, [collapsed]);

  return (
    <>
      <aside
        className={[
          "hidden h-screen flex-shrink-0 border-r border-slate-200/75 bg-white/88 px-3 py-4 shadow-[8px_0_32px_rgba(15,23,42,0.08)] backdrop-blur-xl md:sticky md:top-0 md:flex md:flex-col",
          collapsed ? "md:w-[98px]" : "md:w-[252px]",
        ].join(" ")}
      >
        <div className="flex flex-1 flex-col">
          <div className={collapsed ? "flex justify-center" : "flex items-center justify-between gap-3"}>
            <Logo size="mg" />
            {!collapsed && (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Sidebar'ı daralt"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <Icon name="back" size={14} color="#475569" />
              </button>
            )}
          </div>

          {collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label="Sidebar'ı genişlet"
              className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Icon name="next" size={14} color="#475569" />
            </button>
          )}

          <div
            className={[
              "mt-5 flex items-center rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-blue-50/40 p-2.5",
              collapsed ? "justify-center" : "gap-2.5",
            ].join(" ")}
          >
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_10px_20px_rgba(37,99,235,0.35)]">
                <Icon name={user.avatar} size={20} />
              </div>
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500">Seviye {user.level} • {user.streak} gün seri</p>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                  <Icon name="coin" size={12} color="#D97706" /> {user.coins.toLocaleString("tr-TR")} coin
                </div>
              </div>
            )}
          </div>

          <nav className="mt-5 flex flex-1 flex-col gap-2" aria-label="Ana navigasyon">
            {NAV_ITEMS.map((item) => (
              <DesktopNavItem
                key={item.to}
                item={item}
                active={isRouteActive(location.pathname, item.match)}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>

        <div className={collapsed ? "grid gap-2" : "grid gap-2.5"}>
          <Link
            to="/video"
            title={collapsed ? "Hızlı Video" : undefined}
            className={[
              "inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-600 text-center text-[12px] font-semibold text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_12px_24px_rgba(37,99,235,0.25)]",
              collapsed ? "h-11 w-full" : "gap-2 px-3 py-3",
            ].join(" ")}
          >
            <Icon name="video" size={16} color="#ffffff" />
            {!collapsed && "Video Dersi"}
          </Link>
          <Link
            to="/profile"
            title={collapsed ? "Profil" : undefined}
            className={[
              "inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-center text-[12px] font-semibold text-slate-600 no-underline transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
              collapsed ? "h-11 w-full" : "gap-2 px-3 py-3",
            ].join(" ")}
          >
            <Icon name="profile" size={16} color="#64748B" />
            {!collapsed && "Profil"}
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
