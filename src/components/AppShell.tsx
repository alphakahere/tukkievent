"use client";

import { usePathname } from "next/navigation";
import DesktopNavbar from "./DesktopNavbar";
import Footer from "./Footer";

const HIDE_PREFIXES = ["/organizer", "/checkout", "/admin"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = HIDE_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <>
      {!hideChrome && <DesktopNavbar />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}
