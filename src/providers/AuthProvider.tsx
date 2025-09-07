import { getAuthToken } from "../services/auth";
import React, { createContext, useMemo, useState } from "react";

export type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      token: token,
      isAuthenticated: !!token,
      login: async () => {
        // const t = await getAuthToken();
        const t = await getAuthToken();
        setToken(t.access_token);
      },
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
