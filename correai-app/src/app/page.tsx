"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleComecarAgoraClick = () => {
    router.push("/quiz");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      {/* Botão de Login no canto superior direito */}
      <div className="absolute top-4 right-4">
        <Link href="/auth">
          <Button variant="outline">Login</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-8 items-center text-center">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Seu plano de treino de corrida personalizado
          </h1>
          <p className="text-xl text-muted-foreground">
            O CorreAí cria planos de treino adaptados ao seu nível e objetivos para ajudar você a alcançar seu melhor desempenho nas corridas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/quiz">Começar agora</Link>
            </Button>
            {/* Botão "Ver dashboard" removido */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-12">
          <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalizado</h3>
            <p className="text-muted-foreground text-center">
              Planos adaptados ao seu nível de experiência e disponibilidade de tempo.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M2 12h20"></path>
                <path d="M16 6 22 12 16 18"></path>
                <path d="m8 6-6 6 6 6"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Progressivo</h3>
            <p className="text-muted-foreground text-center">
              Evolução gradual para evitar lesões e garantir melhoria contínua.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M12 2v20"></path>
                <path d="m17 5-5-3-5 3"></path>
                <path d="m17 19-5 3-5-3"></path>
                <path d="M2 12h20"></path>
                <path d="m5 7-3 5 3 5"></path>
                <path d="m19 7 3 5-3 5"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Completo</h3>
            <p className="text-muted-foreground text-center">
              Inclui treinos de corrida, força e recuperação para um desenvolvimento equilibrado.
            </p>
          </div>
        </div>

        <div className="w-full max-w-5xl mt-16 p-8 bg-card rounded-lg border shadow-sm">
          <h2 className="text-3xl font-bold mb-6 text-center">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Responda ao quiz</h3>
              <p className="text-muted-foreground text-center">
                Informe seu nível, objetivos e disponibilidade para treinos.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Receba seu plano</h3>
              <p className="text-muted-foreground text-center">
                Um plano personalizado será criado com base nas suas respostas.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Acompanhe seu progresso</h3>
              <p className="text-muted-foreground text-center">
                Registre seus treinos e visualize seu progresso no dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
