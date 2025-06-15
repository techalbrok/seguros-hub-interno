
import React, { createContext, useContext, useState, useEffect } from "react";

interface DemoUser {
  email: string;
  name: string;
}

interface DemoAuthContextType {
  user: DemoUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

export const DemoAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("demo_user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email: string, password: string) => {
    // Para la demo, un login fijo
    if (email === "demo@correo.com" && password === "demo123") {
      const demoUser = { email, name: "Usuario Demo" };
      setUser(demoUser);
      localStorage.setItem("demo_user", JSON.stringify(demoUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("demo_user");
  };

  return (
    <DemoAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </DemoAuthContext.Provider>
  );
};

export const useDemoAuth = () => {
  const ctx = useContext(DemoAuthContext);
  if (!ctx) throw new Error("useDemoAuth debe usarse dentro de DemoAuthProvider");
  return ctx;
};
