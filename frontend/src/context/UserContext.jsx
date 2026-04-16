import { createContext, useContext, useState, useEffect, useCallback } from "react";

const MOCK_USER = {
  name: "İlkhan",
  avatar: "🦊",
  level: 12,
  coins: 1240,
  streak: 7,
  xp: 0,
};

const STORAGE_KEY = "code-enigma:user";
const XP_PER_LEVEL = 1000;

const UserContext = createContext(null);

function loadUser(fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export function UserProvider({ children, initial = MOCK_USER }) {
  const [user, setUser] = useState(() => loadUser(initial));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      /* storage blocked */
    }
  }, [user]);

  const addCoins = useCallback((amount) => {
    setUser((u) => ({ ...u, coins: Math.max(0, u.coins + amount) }));
  }, []);

  const addXp = useCallback((amount) => {
    setUser((u) => {
      const total = (u.xp || 0) + amount;
      const levelUps = Math.floor(total / XP_PER_LEVEL);
      return {
        ...u,
        xp: total % XP_PER_LEVEL,
        level: u.level + levelUps,
      };
    });
  }, []);

  const resetUser = useCallback(() => setUser(MOCK_USER), []);

  return (
    <UserContext.Provider value={{ user, setUser, addCoins, addXp, resetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    return {
      user: MOCK_USER,
      setUser: () => {},
      addCoins: () => {},
      addXp: () => {},
      resetUser: () => {},
    };
  }
  return ctx;
}
