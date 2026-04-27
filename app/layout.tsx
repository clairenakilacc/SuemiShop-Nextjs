import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

import { Inter } from "next/font/google";
import LayoutClient from "./LayoutClient";
import Loader from "./components/Loader";

// Font setup (global UI font)
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Suemi Online Shop Official",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} d-flex flex-column min-vh-100`}>
        {/* Optional global loader */}
        {/* <Loader /> */}

        {/* Layout wrapper (handles header/footer logic) */}
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
