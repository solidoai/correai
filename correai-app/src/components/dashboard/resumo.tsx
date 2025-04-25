"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Footprints, Route } from 'lucide-react';

// Tipos reutilizados ou adaptados de page.tsx (idealmente viriam de um local central)
interface EstatisticasPlano {
  total_treinos: number;
  treinos_realizados: number;
  quilometros_planejados: number;
  quilometros_percorridos: number;
  dias_ate_objetivo: number; // Adicionado para o resumo
  media_km_por_semana: number; // Adicionado para o resumo
}

interface DadosPlano {
  titulo: string;
  resumo: string;
  progresso_percentual: number;
  quantidade_total_treinos: number; // Adicionado para o resumo
  quantidade_realizados: number; // Adicionado para o resumo
  quilometros_planejados: number; // Adicionado para o resumo
  quilometros_percorridos: number; // Adicionado para o resumo
}

const ritmoMedio = "6:10 min/km"; // Manter dado simulado por enquanto

interface DashboardResumoProps {
  dadosPlano: DadosPlano;
  estatisticas: EstatisticasPlano;
}

export function DashboardResumo({ dadosPlano, estatisticas }: DashboardResumoProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Card: Desempenho Geral */}
      <Card className="md:col-span-1"> 
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            Desempenho Geral
          </CardTitle>
          <CardDescription>Progresso atual do seu plano.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progresso Total</span>
            <span className="font-semibold">{dadosPlano.progresso_percentual}%</span>
          </div>
          <Progress value={dadosPlano.progresso_percentual} className="h-2" />
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">KM Percorridos</p>
              <p className="font-semibold">{dadosPlano.quilometros_percorridos} / {dadosPlano.quilometros_planejados}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Treinos Concluídos</p>
              <p className="font-semibold">{dadosPlano.quantidade_realizados} / {dadosPlano.quantidade_total_treinos}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Dias Restantes</p>
              <p className="font-semibold">{estatisticas.dias_ate_objetivo}</p>
            </div>
             <div>
              <p className="text-muted-foreground">Média Semanal</p>
              <p className="font-semibold">{estatisticas.media_km_por_semana.toFixed(1)} km</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card: Ritmo Médio Geral */}
      <Card className="md:col-span-1"> 
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Footprints className="h-5 w-5 mr-2 text-primary" />
            Ritmo Médio Geral
          </CardTitle>
          <CardDescription>Seu pace médio nos treinos concluídos.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full pb-10">
            <p className="text-3xl md:text-4xl font-bold text-center">{ritmoMedio}</p>
        </CardContent>
      </Card>
    </div>
  );
}
