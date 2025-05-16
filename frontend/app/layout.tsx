import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from '@/components/ui/Navbar';
import { ClientRootProvider } from '@/components/providers/ClientRootProvider';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Shepherd",
  description: "Cyber Guardian Platform",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-950 text-white`}>
        <ClientRootProvider>
          <Navbar />
          <div className="pt-16">{children}</div>
        </ClientRootProvider>
      </body>
    </html>
  );
} 