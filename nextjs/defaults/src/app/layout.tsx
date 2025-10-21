import type { Metadata } from "next";
import "./globals.css";
import NavLinks from "./components/navbar/navbar";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";

export const metadata: Metadata = {
  title: "X",
  description: "Xscriptor template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <NavLinks />
        <main>
        {children}
        </main>
      </body>
      <Footer />
    </html>
  );
}
