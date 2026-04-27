"use client";

import { usePathname } from "next/navigation";
import Footer from "./components/Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // existing hidden routes
  const hideHeader =
    pathname === "/auth/login" || pathname === "/auth/register";

  // (print page)
  const isPrintPage = pathname.startsWith("/payslips/print");

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* HEADER (if you use it later) */}
      {/* {!hideHeader && !isPrintPage && <Header />} */}

      <main className="grow">{children}</main>

      {/*FOOTER CONDITION */}
      {!isPrintPage && <Footer />}
    </div>
  );
}
