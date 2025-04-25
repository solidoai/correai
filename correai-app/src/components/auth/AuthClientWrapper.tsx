'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from './AuthForm';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/common/LoadingScreen';

// Este componente cliente agora usa o mesmo contexto Auth que o ProtectedRoute
const AuthClientWrapper: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth(); // Usa o mesmo contexto Auth

  useEffect(() => {
    // Só redireciona para o dashboard se tiver usuário E não estiver carregando
    if (user && !loading) {
      console.log('[AuthClientWrapper] Usuário logado encontrado, redirecionando para /dashboard');
      router.replace('/dashboard');
    } else if (!loading) {
      // Se não está carregando e não tem usuário, mostra o formulário
      console.log('[AuthClientWrapper] Nenhum usuário logado encontrado, mostrando AuthForm.');
    }
  }, [user, loading, router]);

  // Mostra um loader enquanto o contexto de auth está carregando
  if (loading) {
    return <LoadingScreen />;
  }

  // Renderiza o AuthForm somente se o usuário não estiver logado
  return <AuthForm />;
};

export default AuthClientWrapper;
