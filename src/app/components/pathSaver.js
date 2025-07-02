
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PathSaver() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname !== "/login") {
      localStorage.setItem("lastPath", pathname);
    }
  }, [pathname]);

  return null;
}
