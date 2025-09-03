"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "@/styles/nprogress.css";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
