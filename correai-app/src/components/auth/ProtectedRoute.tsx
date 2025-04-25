"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/common/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não estiver carregando e não tiver usuário, redirecionar para login
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Se estiver carregando ou não tiver usuário, mostrar tela de carregamento
  if (loading || !user) {
    return <LoadingScreen />;
  }

  // Se tiver usuário, renderizar o conteúdo da página
  return <>{children}</>;
}
