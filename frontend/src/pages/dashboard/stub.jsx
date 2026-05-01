import Icon from "../../components/ui/icons8-icon.jsx";
import {
  DashboardShell,
  PageHeader,
  SectionLabel,
  Surface,
  StatusBadge,
} from "../../components/dashboard/dashboard-design.jsx";

export default function StubPage({
  title = "Yapım aşamasında",
  icon = "warning",
  description = "Bu bölüm yakında kullanıma açılacak.",
}) {
  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Hazırlık Alanı"
        title={title}
        description={description}
        icon={icon}
        iconColor="#D97706"
        stats={[
          { value: "Planlı", label: "Durum", color: "#D97706", icon: "tasks" },
          { value: "Yakında", label: "Yayın", color: "#2563EB", icon: "timer" },
        ]}
      />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 xl:px-8">
        <Surface className="w-full max-w-2xl overflow-hidden p-0 text-center">
          <div className="relative border-b border-white/70 bg-[linear-gradient(135deg,rgba(217,119,6,0.14),rgba(37,99,235,0.08),rgba(255,255,255,0.74))] px-6 py-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(37,99,235,0.10) 1px, transparent 1px), linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/70 bg-white/75 shadow-[0_18px_40px_rgba(217,119,6,0.16)] backdrop-blur-xl">
              <Icon name={icon} size={34} color="#D97706" />
            </div>
            <h1 className="relative mt-5 text-[24px] font-bold leading-tight tracking-[-0.02em] text-slate-950">
              {title}
            </h1>
            <p className="relative mx-auto mt-2 max-w-md text-[12px] leading-6 text-slate-500">
              {description}
            </p>
          </div>

          <div className="grid gap-4 px-6 py-6 text-left sm:grid-cols-3">
            {[
              { label: "Tasarım", value: "Dashboard sistemi", color: "#2563EB", icon: "topics" },
              { label: "İçerik", value: "Modül planı", color: "#7C3AED", icon: "module" },
              { label: "Test", value: "Kontrol listesi", color: "#059669", icon: "check" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/70 bg-white/62 p-4">
                <div className="mb-3">
                  <SectionLabel color={item.color}>{item.label}</SectionLabel>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${item.color}14` }}>
                    <Icon name={item.icon} size={16} color={item.color} />
                  </span>
                  <span className="text-[12px] font-bold leading-5 text-slate-700">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center border-t border-white/70 px-6 py-5">
            <StatusBadge color="#D97706" bg="#FFFBEB">
              Planlama devam ediyor
            </StatusBadge>
          </div>
        </Surface>
      </main>
    </DashboardShell>
  );
}
