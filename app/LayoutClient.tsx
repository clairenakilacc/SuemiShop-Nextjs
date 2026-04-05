"use client";

import { usePathname } from "next/navigation";
import Footer from "./components/Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeader =
    pathname === "/auth/login" || pathname === "/auth/register";

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        {/* {!hideHeader && <Header />} */}
        <main className="grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
