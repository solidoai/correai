"use client";

import { AuthProvider } from "@/context/AuthContext";
import React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

// Este componente é um Client Component que agrupa todos os provedores de contexto
export function Providers({ children }: ProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
