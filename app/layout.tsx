import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

import LayoutClient from "./LayoutClient";
import Loader from "./components/Loader";

export const metadata: Metadata = {
  title: "Suemi Online Shop Official",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100">
        {/* <Loader /> */}
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
