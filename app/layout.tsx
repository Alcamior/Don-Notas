import { Toaster } from 'sonner'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from '@/components/providers/modal-provider';

import { EdgeStoreProvider } from '../lib/edgestore';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Don Notas",
  description: "Don Notas es tu herramienta todo en uno para crear, organizar y gestionar notas, tareas y recordatorios de manera fácil y eficiente.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <ConvexClientProvider>
          <EdgeStoreProvider>
            <Toaster position="bottom-center" />
            <ModalProvider /> 
            {children}
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
