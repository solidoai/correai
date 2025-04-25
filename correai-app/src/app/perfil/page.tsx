'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { LogOut, User } from 'lucide-react'; // Importar ícones

export default function PerfilPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao fazer logout:', error);
      // Adicionar feedback para o usuário aqui (ex: toast)
    } else {
      router.push('/'); // Redirecionar para a página inicial/login após logout
    }
  };

  // Extrair iniciais para o AvatarFallback
  const getInitials = (name: string | undefined) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-b from-background to-muted/40">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="items-center">
            <Avatar className="h-20 w-20 mb-4">
              {/* Idealmente, a URL da imagem viria do perfil do usuário no Supabase */}
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar do usuário" />
              <AvatarFallback>{getInitials(user?.user_metadata?.nome_completo || user?.email)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">Perfil do Usuário</CardTitle>
            <CardDescription>Gerencie suas informações e preferências.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
              <p>{user?.user_metadata?.nome_completo || 'Nome não informado'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{user?.email || 'Email não encontrado'}</p>
            </div>
            {/* Adicionar mais campos do perfil aqui, se necessário */}
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={handleLogout} className="w-full">
              <LogOut className="mr-2 h-4 w-4" /> Sair (Logout)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
