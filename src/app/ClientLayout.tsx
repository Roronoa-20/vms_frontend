"use client";

import React, { useEffect } from "react";
import { usePathname, useSearchParams  } from "next/navigation";
import NProgress from "nprogress";
import "@/styles/nprogress.css";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return <>{children}</>;
}
