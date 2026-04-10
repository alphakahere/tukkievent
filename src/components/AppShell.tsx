"use client";

import { usePathname } from "next/navigation";
import DesktopNavbar from "./DesktopNavbar";

const HIDE_NAVBAR_PREFIXES = ["/organizer", "/checkout"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = HIDE_NAVBAR_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <>
      {!hideNavbar && <DesktopNavbar />}
      {children}
    </>
  );
}
