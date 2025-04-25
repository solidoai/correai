// src/app/dashboard/menu/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Phone,
  LogOut, // Para o futuro logout
  ClipboardList, // Para Meu Plano
  LifeBuoy, // Para Suporte
  HelpCircle, // Para FAQs
  Settings, // Para Configurações
  Info, // Para Sobre
  ChevronLeft, // Para Voltar
  Edit // Para editar número (futuro)
} from 'lucide-react';
import { useState } from 'react'; // Para futuras interações

export default function MenuPage() {
  // Placeholders - Substituir por dados reais ou estado global
  const nomeUsuario = "Nome do Atleta";
  const numeroWhatsapp = "+55 (XX) XXXXX-XXXX";
  const versaoApp = "1.0.0"; // Exemplo

  // Estado para simular login (remover depois)
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16"> {/* Manter fundo padrão? Ou bg-primary/10? */ }

      {/* Cabeçalho Fixo */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
        <Link href="/dashboard" legacyBehavior>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Voltar para o Dashboard</span>
          </Button>
        </Link>
        <h1 className="flex-1 text-lg font-semibold text-foreground text-center mr-8">Menu</h1> {/* mr-8 para compensar botão voltar */}
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 space-y-6 overflow-y-auto">

        {/* Seção Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <User className="mr-2 h-5 w-5 text-primary" />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span>Nome:</span>
              <span className="font-medium">{nomeUsuario}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className='flex flex-col'>
                <span className='flex items-center'>
                    <Phone className="mr-2 h-4 w-4 text-primary" /> WhatsApp:
                </span>
                <span className="text-xs text-muted-foreground">Essencial para receber seus treinos!</span>
              </div>
              <div className='flex items-center'>
                <span className="font-medium mr-2">{numeroWhatsapp}</span>
                 {/* Botão Editar (funcionalidade futura) */}
                 {/* <Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-4 w-4" /></Button> */}
              </div>

            </div>
            <Separator />
             {/* Opção Login/Logout (Futuro) */}
            {isLoggedIn ? (
                 <Button variant="ghost" className="w-full justify-start px-0 text-destructive hover:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sair (Logout)
                 </Button>
             ) : (
                 <Button variant="ghost" className="w-full justify-start px-0">
                     {/* Icone Login? */} Entrar / Criar Conta
                 </Button>
             )}
          </CardContent>
        </Card>

        {/* Seção Meu Plano */}
        <Card>
           <CardHeader>
            <CardTitle className="flex items-center text-base">
                <ClipboardList className="mr-2 h-5 w-5 text-primary" />
                 Meu Plano
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-1">
              {/* Links futuros */} 
              <Button variant="ghost" className="w-full justify-start px-0" asChild>
                <Link href="#">Ver detalhes do plano</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start px-0" asChild>
                <Link href="#">Gerenciar Assinatura</Link>
              </Button>
           </CardContent>
        </Card>

        {/* Seção Ajuda e Suporte */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center text-base">
                 <LifeBuoy className="mr-2 h-5 w-5 text-primary" />
                 Ajuda e Suporte
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-1">
             <Button variant="ghost" className="w-full justify-start px-0" asChild>
               {/* Link direto para WhatsApp ou página de contato */}
               <Link href="#">Falar com Suporte</Link>
             </Button>
             <Button variant="ghost" className="w-full justify-start px-0" asChild>
               <Link href="#">Perguntas Frequentes (FAQ)</Link>
             </Button>
           </CardContent>
         </Card>

         {/* Seção Configurações e Sobre */}
         <Card>
             <CardHeader>
                 <CardTitle className="flex items-center text-base">
                     <Settings className="mr-2 h-5 w-5 text-primary" />
                     Configurações e Informações
                 </CardTitle>
             </CardHeader>
             <CardContent className="space-y-1">
                 <Button variant="ghost" className="w-full justify-start px-0" asChild>
                    <Link href="#">Notificações</Link>
                 </Button>
                 <Separator />
                 <div className="flex justify-between items-center pt-2 text-sm">
                     <span className='flex items-center'> <Info className='mr-2 h-4 w-4'/> Versão do App</span>
                     <span className="text-muted-foreground">{versaoApp}</span>
                 </div>
                 <Button variant="ghost" className="w-full justify-start px-0 text-xs text-muted-foreground" asChild>
                    <Link href="#">Termos de Serviço</Link>
                 </Button>
                  <Button variant="ghost" className="w-full justify-start px-0 text-xs text-muted-foreground" asChild>
                    <Link href="#">Política de Privacidade</Link>
                 </Button>
             </CardContent>
         </Card>

      </main>

        {/* TODO: Adicionar a NavBar inferior se não for gerenciada por um layout global */}

    </div>
  );
}
