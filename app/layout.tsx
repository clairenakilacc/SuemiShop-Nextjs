import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import LayoutClient from "./LayoutClient"; //in same folder
import "./globals.css";
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
        <Loader />
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
