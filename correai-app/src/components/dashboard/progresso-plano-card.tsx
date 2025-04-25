"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, CalendarClock, CheckCircle, Activity } from 'lucide-react';

// Tipagem para os dados resumidos do plano
export type PlanoResumo = {
  titulo: string;
  progresso_percentual: number | null;
  dias_restantes: number;
  treinos_concluidos: number | null;
  total_treinos: number | null;
  data_inicio?: string | null; // Adicionado - pode ser null se não existir
  data_fim?: string | null; // Adicionado - pode ser null se não existir
};

export interface ProgressoPlanoCardProps {
  plano: PlanoResumo | null | undefined;
}

export function ProgressoPlanoCard({ plano }: ProgressoPlanoCardProps) {
  if (!plano) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-primary">SEU PLANO ATUAL</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Nenhum plano de treino ativo.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <CardHeader className="p-4 bg-muted/30 border-b">
            <CardTitle className="text-sm font-semibold text-primary tracking-wide flex items-center">
                 <Target className="h-4 w-4 mr-1.5" /> SEU PLANO ATUAL
            </CardTitle>
             <CardDescription className="text-xs pt-1">{plano.titulo}</CardDescription> 
        </CardHeader>
        <CardContent className="p-4 space-y-3">
            <div>
                <div className="flex justify-between items-center mb-1">
                     <span className="text-sm font-medium text-muted-foreground">Progresso Geral</span>
                     <span className="text-sm font-semibold text-primary">{plano.progresso_percentual}%</span>
                </div>
                <Progress value={plano.progresso_percentual} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground pt-2">
                <div className="flex items-center">
                    <CalendarClock size={14} className="mr-1.5 text-primary/70" />
                    <span>{plano.dias_restantes} dias restantes</span>
                </div>
                 <div className="flex items-center">
                    <CheckCircle size={14} className="mr-1.5 text-primary/70" />
                    <span>{plano.treinos_concluidos} / {plano.total_treinos} treinos</span>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
