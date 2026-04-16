import { createContext, useContext, useState } from "react";

const MOCK_USER = {
  name: "İlkhan",
  avatar: "🦊",
  level: 12,
  coins: 1240,
  streak: 7,
};

const UserContext = createContext(MOCK_USER);

export function UserProvider({ children, initial = MOCK_USER }) {
  const [user, setUser] = useState(initial);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) return { user: MOCK_USER, setUser: () => {} };
  return ctx;
}
