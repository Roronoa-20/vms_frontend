"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { ApiModule } from "@/src/types/sidebar";

interface AuthContextType {
  role: string | null | undefined;
  name: string | null | undefined;
  userid: string | null | undefined;
  designation?: string | null | undefined;
  vendorRef?: string | null | undefined;
  user_email?: string | null | undefined;
  asaReqd?: number | null;
  modules: ApiModule[];

  setAuthData: (
    role: string | null | undefined,
    name: string | null | undefined,
    userid: string | null | undefined,
    designation?: string | null | undefined,
    VendorRefNo?: string | null | undefined,
    user_email?: string | null | undefined,
    asaReqd?: number | null
  ) => void;

  setModules: (modules: ApiModule[]) => void;
  clearAuthData: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null | undefined>(null);
  const [name, setName] = useState<string | null | undefined>(null);
  const [userid, setUserId] = useState<string | null | undefined>(null);
  const [designation, setDesignation] = useState<string | null | undefined>(null);
  const [user_email, setUser_Email] = useState<string | null | undefined>(null);
  const [vendorRef, setvendorRef] = useState<string | null | undefined>(null);
  const [asaReqd, setAsaReqd] = useState<number | null>(null);
  const [modules, setModulesState] = useState<ApiModule[]>([]);

  useEffect(() => {
    setcontextfunction();
  }, []);

  const setcontextfunction = async () => {
    const savedRole = Cookies.get("role");
    const savedName = Cookies.get("full_name");
    const savedid = Cookies.get("user_id");
    const savedDesignation = Cookies.get("designation");
    const user_email = Cookies.get("user_id");
    const vendorRef = Cookies.get("VendorRef") ?? null;
    const savedAsaReqd = Cookies.get("VendorASA");

    if (savedRole) setRole(savedRole);
    if (savedName) setName(savedName);
    if (savedid) setUserId(savedid);
    if (savedDesignation) setDesignation(savedDesignation);
    if (user_email) setUser_Email(user_email);
    if (vendorRef) setvendorRef(vendorRef);
    if (savedAsaReqd) setAsaReqd(Number(savedAsaReqd));

    const savedModules = localStorage.getItem("sidebar_modules");
    if (savedModules) {
      try {
        setModulesState(JSON.parse(savedModules));
      } catch (e) {
        console.error("Failed to parse sidebar modules:", e);
      }
    }
  }

  const setAuthData = (newRole: string | null | undefined, newName: string | null | undefined, userid: string | null | undefined, designation?: string | null | undefined, VendorRefNo?: string | null | undefined,  user_email?: string | null | undefined, asaReqd?: number | null) => {
    setRole(newRole);
    setName(newName);
    setUserId(userid);
    if (designation) setDesignation(designation);
    if (VendorRefNo) setvendorRef(VendorRefNo);
    if (user_email) setUser_Email(user_email);
    if (asaReqd !== undefined) setAsaReqd(asaReqd);
  };

  const setModules = (newModules: ApiModule[]) => {
    setModulesState(newModules);
    localStorage.setItem("sidebar_modules", JSON.stringify(newModules));
  };

  const clearAuthData = () => {
    setRole(null);
    setName(null);
    setUserId(null);
    setDesignation(null);
    setvendorRef(null);
    setUser_Email(null);
    setAsaReqd(null);
    setModulesState([]);
    localStorage.removeItem("sidebar_modules");
  };

  return (
    <AuthContext.Provider value={{ role, name, userid, designation, vendorRef, user_email, asaReqd, modules, setAuthData, setModules, clearAuthData }}>
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
