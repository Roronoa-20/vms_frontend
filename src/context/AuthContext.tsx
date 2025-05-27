"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  role: string | null|undefined;
  name: string | null|undefined;
  userid:string | null|undefined;
  setAuthData: (role: string|null|undefined, name: string|null|undefined, userid:string|null|undefined) => void;
  clearAuthData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null|undefined>(null);
  const [name, setName] = useState<string | null|undefined>(null);
  const [userid, setUserId] = useState<string | null|undefined>(null);
  useEffect(() => {
    setcontextfunction();
  }, []);

    const setcontextfunction = async ()=>{
        const savedRole = Cookies.get("role");
        const savedName = Cookies.get("full_name");
        const savedid = Cookies.get("user_id");
        if (savedRole) setRole(savedRole);
        if (savedName) setName(savedName);
        if (savedid) setUserId(savedid)
    }

  const setAuthData = (newRole: string|null|undefined , newName: string|null|undefined,userid:string|null|undefined) => {
    setRole(newRole);
    setName(newName);
    setUserId(userid)
  };

  const clearAuthData = () => {
    setRole(null);
    setName(null);
    setUserId(null)
  };

  return (
    <AuthContext.Provider value={{ role, name,userid, setAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
