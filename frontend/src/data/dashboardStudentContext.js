const DEFAULT_STUDENT = {
  name: "İlkhan",
  level: 3,
  streak: 7,
  coins: 1280,
};

const DEFAULT_PROGRESS = [
  {
    course: "Temel Kavramlar",
    category: "Cebir",
    progress: 84,
    lastAccess: "2 saat önce",
    nextContent: "Denklem Kurma Mantığı",
    estimatedMinutes: 18,
  },
  {
    course: "Sayı Basamakları",
    category: "Aritmetik",
    progress: 72,
    lastAccess: "Dün",
    nextContent: "Basamak Değeri",
    estimatedMinutes: 12,
  },
  {
    course: "Rasyonel Sayılar",
    category: "Sayı Teorisi",
    progress: 91,
    lastAccess: "3 gün önce",
    nextContent: "Rasyonel Sayılarla İşlemler",
    estimatedMinutes: 15,
  },
];

const DEFAULT_WEAKNESSES = [
  {
    topic: "Denklem Kurma Mantığı",
    course: "Temel Kavramlar",
    errorRate: 62,
    priority: "high",
  },
];

const DEFAULT_TASKS = [
  { title: "1 video dersi tamamla", done: true },
  { title: "10 soru çöz", done: true },
  { title: "Eksik kazanım testini aç", done: false },
  { title: "20 dakika tekrar yap", done: false },
];

const DEFAULT_RECENT_ACTIVITY = [
  "Temel Kavramlar videosunun %84'ü tamamlandı",
  "Son testte Denklem Kurma Mantığı sorularında zorlandı",
];

function asNumber(value, fallback) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeTasks(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) return DEFAULT_TASKS;

  return tasks.map((task) => ({
    title: task?.title || "Görev",
    done: task?.done === true,
  }));
}

export function buildDashboardStudentContext({ user, tasks } = {}) {
  return {
    student: {
      name: user?.name || DEFAULT_STUDENT.name,
      level: asNumber(user?.level, DEFAULT_STUDENT.level),
      streak: asNumber(user?.streak, DEFAULT_STUDENT.streak),
      coins: asNumber(user?.coins, DEFAULT_STUDENT.coins),
    },
    progress: DEFAULT_PROGRESS,
    weaknesses: DEFAULT_WEAKNESSES,
    todayTasks: normalizeTasks(tasks),
    recentActivity: DEFAULT_RECENT_ACTIVITY,
  };
}

export const dashboardStudentContext = buildDashboardStudentContext();
