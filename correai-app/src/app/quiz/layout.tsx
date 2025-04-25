"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/context/AuthContext';

// Reutilizamos as mesmas fontes do layout principal
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Não incluímos Navbar nem Footer aqui, apenas o conteúdo
    <AuthProvider>
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </div>
    </AuthProvider>
  );
}
