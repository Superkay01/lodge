import type { Metadata } from "next";

import "./globals.css";


export const metadata: Metadata = {
  title: "Lodgelink",
  description: "Find student lodges with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className='min-h-screen flex flex-col bg-white text-blue-950'
      >
        {children}
      </body>
    </html>
  );
}
