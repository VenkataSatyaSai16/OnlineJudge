import { createContext, useState, useEffect } from "react";
import { getDetails } from "../api/profileApi";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
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

        //console.error(error);
      }
    }

    loadUser();
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
