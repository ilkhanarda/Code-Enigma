import DashboardNavbar from "./dashboard-navbar.jsx";
import Icon from "../ui/icons8-icon.jsx";

const DASHBOARD_COLORS = {
  blue: "#2563EB",
  blueStrong: "#1D4ED8",
  violet: "#7C3AED",
  green: "#059669",
  amber: "#D97706",
  red: "#DC2626",
  ink: "#111827",
  muted: "#475569",
  subtle: "#94A3B8",
  border: "#DBE5F3",
  surface: "#FFFFFF",
};

export function DashboardDesignStyles() {
  return (
    <style>{`
      .ce-dashboard-bg {
        background:
          radial-gradient(circle at 12% 8%, rgba(99,102,241,0.16), transparent 30%),
          radial-gradient(circle at 85% 12%, rgba(56,189,248,0.14), transparent 28%),
          radial-gradient(circle at 90% 82%, rgba(251,191,36,0.10), transparent 26%),
          linear-gradient(180deg, #f8fbff 0%, #eef5ff 48%, #f7fbff 100%);
      }
      .ce-dashboard-grid {
        background-image:
          linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px),
          linear-gradient(rgba(37,99,235,0.07) 1px, transparent 1px);
        background-size: 28px 28px;
        mask-image: linear-gradient(180deg, rgba(0,0,0,.72), rgba(0,0,0,.08));
      }
      .ce-glass-header {
        border-bottom: 1px solid rgba(226,232,240,0.78);
        background: rgba(255,255,255,0.72);
        box-shadow: 0 18px 48px rgba(37,99,235,0.08);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .ce-surface {
        border: 1px solid rgba(255,255,255,0.72);
        background: rgba(255,255,255,0.78);
        box-shadow: 0 18px 50px rgba(37,99,235,0.08), 0 2px 8px rgba(15,23,42,0.04);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .surface-wrap {
        border: 1px solid rgba(255,255,255,0.72);
        background: rgba(255,255,255,0.78);
        box-shadow: 0 18px 50px rgba(37,99,235,0.08), 0 2px 8px rgba(15,23,42,0.04);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .ce-pill {
        border: 1px solid rgba(255,255,255,0.72);
        background: rgba(255,255,255,0.72);
        box-shadow: 0 10px 24px rgba(15,23,42,0.06);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }
      .surface-pill {
        border: 1px solid rgba(255,255,255,0.72);
        background: rgba(255,255,255,0.72);
        box-shadow: 0 10px 24px rgba(15,23,42,0.06);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      }
      .glass-header {
        border-bottom: 1px solid rgba(226,232,240,0.78);
        background: rgba(255,255,255,0.72);
        box-shadow: 0 18px 48px rgba(37,99,235,0.08);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .ce-card-hover {
        transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s, border-color .22s, background .22s;
      }
      .ce-card-hover:hover {
        transform: translateY(-3px);
        border-color: rgba(147,197,253,0.92);
        box-shadow: 0 22px 46px rgba(37,99,235,0.14), 0 4px 14px rgba(15,23,42,0.05);
      }
      .topic-grid-card {
        transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s, border-color .25s;
      }
      .topic-grid-card:hover {
        transform: translateY(-4px);
        border-color: #bfdbfe;
        box-shadow: 0 20px 44px rgba(37,99,235,.14);
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @media (prefers-reduced-motion: reduce) {
        .ce-card-hover,
        .ce-card-hover:hover {
          transition: none;
          transform: none;
        }
      }
    `}</style>
  );
}

export function DashboardShell({ children, className = "" }) {
  return (
    <div className="ce-dashboard-bg relative min-h-screen overflow-x-clip text-slate-900">
      <DashboardDesignStyles />
      <div className="ce-dashboard-grid pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex min-h-screen">
        <DashboardNavbar />
        <div className={`flex min-h-screen flex-1 flex-col overflow-x-hidden pb-24 md:pb-0 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function SectionLabel({ children, text, color = DASHBOARD_COLORS.blue, lineColor = color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-px w-5 rounded-full" style={{ background: lineColor }} />
      <span className="text-[11px] font-bold uppercase tracking-[1.8px]" style={{ color }}>
        {children || text}
      </span>
    </div>
  );
}

export function Surface({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`ce-surface rounded-[24px] ${hover ? "ce-card-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatPill({ value, label, color = DASHBOARD_COLORS.blue, icon }) {
  return (
    <div className="ce-pill flex min-w-[82px] flex-col items-center justify-center rounded-2xl px-4 py-3 text-center">
      <div className="inline-flex items-center gap-1.5 text-[18px] font-bold leading-none tracking-tight" style={{ color }}>
        {icon ? <Icon name={icon} size={14} color={color} /> : null}
        {value}
      </div>
      <div className="mt-1 text-[9px] font-semibold uppercase tracking-[1.4px] text-slate-400">{label}</div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  iconColor = DASHBOARD_COLORS.blue,
  stats = [],
  actions,
  children,
}) {
  return (
    <header className="ce-glass-header sticky top-0 z-40 px-4 py-4 sm:px-6 sm:py-5 xl:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <div className="mb-2">
              <SectionLabel color={iconColor}>{eyebrow}</SectionLabel>
            </div>
          ) : null}
          <h1 className="inline-flex items-center gap-2 text-[26px] font-bold leading-tight tracking-[-0.02em] text-slate-950 sm:text-[30px]">
            {title}
            {icon ? <Icon name={icon} size={22} color={iconColor} /> : null}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-[12px] leading-5 text-slate-500">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {stats.map((stat) => (
            <StatPill key={stat.label} {...stat} />
          ))}
          {actions}
        </div>
      </div>
      {children}
    </header>
  );
}

export function ProgressBar({ value, color = DASHBOARD_COLORS.blue, className = "", trackClassName = "bg-slate-100" }) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full ${trackClassName} ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, Number(value) || 0))}%`, background: color }}
      />
    </div>
  );
}

export function StatusBadge({ children, color = DASHBOARD_COLORS.blue, bg = "#EFF6FF", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[1.2px] ${className}`}
      style={{ color, background: bg }}
    >
      {children}
    </span>
  );
}

export function EmptyState({ icon = "search", title, description, className = "" }) {
  return (
    <Surface className={`flex flex-col items-center justify-center border-dashed px-6 py-14 text-center ${className}`}>
      <Icon name={icon} size={34} color="#94A3B8" />
      <p className="mt-3 text-[13px] font-bold text-slate-600">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-[11px] leading-5 text-slate-400">{description}</p> : null}
    </Surface>
  );
}
