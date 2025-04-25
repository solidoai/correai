'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import type { User } from '@supabase/supabase-js';

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Estado para indicar carregamento inicial
  const [supabase] = useState(() => createClientComponentClient<Database>());

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }

    fetchUser();

    // Escuta mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthStatus] Auth state changed:', event);
      setUser(session?.user ?? null);
      setLoading(false); // Garante que loading seja false após mudança
    });

    // Limpa o listener quando o componente desmonta
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Dependência do supabase para recriar se necessário

  // Não renderiza nada enquanto verifica o usuário pela primeira vez
  if (loading) {
    return null; // Ou um spinner/placeholder leve se preferir
  }

  return (
    <>
      {!user ? (
        <Link href="/auth">
          <Button>Login / Criar Conta</Button>
        </Link>
      ) : (
        // Usuário está logado - não mostra o botão
        // Pode adicionar um botão de logout ou ícone de perfil aqui no futuro
        null
      )}
    </>
  );
}
