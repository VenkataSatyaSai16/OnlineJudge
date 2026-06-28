import { createContext, useState, useEffect } from "react";
import { getDetails } from "../api/profileApi";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("auth_sync", Date.now().toString());
  };

  const logout = () => {
    setUser(null);
    localStorage.setItem("auth_sync", Date.now().toString());
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await getDetails();
        setUser(response.data.user);
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
          return;
        }
      }
    }

    const handleStorageEvent = (e) => {
      if (e.key === "auth_sync") {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    loadUser();

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
