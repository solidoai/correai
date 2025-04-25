"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Route, Zap } from 'lucide-react';
import { TipoTreino } from '@/types';
import { format, isToday, isTomorrow, formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TreinoResumo {
  id: string;
  tipo: TipoTreino;
  resumo: string;
  data_planejada: Date;
  distancia_km?: number;
  duracao_min?: number;
}

interface ProximoTreinoCardProps {
  treino: TreinoResumo | null | undefined;
}

// Função auxiliar para ícones (pode ser movida para utils)
const getIconForTraining = (tipo: TipoTreino, className = "h-4 w-4") => {
  switch (tipo) {
    case 'longo': return <Route className={`${className} text-blue-500`} />; // Cor tema: info?
    case 'intervalado': return <Zap className={`${className} text-destructive`} />; // Cor tema: destructive
    case 'leve': return <Dumbbell className={`${className} text-green-500`} />; // Cor tema: success?
    case 'regenerativo': return <Clock className={`${className} text-yellow-500`} />; // Cor tema: warning?
    default: return <Dumbbell className={`${className} text-muted-foreground`} />;
  }
};

// Função para formatar a data de forma relativa
const formatRelativeDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Hoje';
  }
  if (isTomorrow(date)) {
    return 'Amanhã';
  }
  // Ex: 'em 3 dias', 'em 1 semana'
  const distance = formatDistanceToNowStrict(date, { locale: ptBR, addSuffix: true });
  // Ex: 'próxima segunda-feira', 'próximo dia 5'
  const specificDate = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });

  // Retorna o mais curto se for em menos de 7 dias, senão a data específica
  // (A lógica de 'distance' pode precisar de ajuste para ficar mais natural)
  if (date.getTime() < new Date().getTime() + 7 * 24 * 60 * 60 * 1000) {
      return distance; // ex: 'em 2 dias'
  }
  
  return ` ${format(date, "eee, dd/MM", { locale: ptBR })}`; // Ex: 'qua, 24/04'
};

export function ProximoTreinoCard({ treino }: ProximoTreinoCardProps) {
  if (!treino) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-primary">PRÓXIMO TREINO</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Nenhum treino agendado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <CardHeader className="p-4 bg-muted/30 border-b">
         <CardTitle className="text-sm font-semibold text-primary tracking-wide">PRÓXIMO TREINO</CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-[auto_1fr] gap-3 items-center">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 h-12 w-12">
            {getIconForTraining(treino.tipo, "h-6 w-6 text-primary")}
          </div>
          <div className="flex flex-col">
            <p className="text-base font-semibold leading-tight mb-0.5">{treino.resumo}</p>
            <p className="text-sm text-muted-foreground font-medium">
               {formatRelativeDate(treino.data_planejada)}
               <span className='mx-1'>•</span> 
               {format(treino.data_planejada, "HH:mm", { locale: ptBR })}h
            </p>
            {/* Opcional: mostrar distância/duração se relevante */}
             {/* <p className="text-xs text-muted-foreground mt-1">
              {treino.distancia_km ? `${treino.distancia_km} km` : treino.duracao_min ? `${treino.duracao_min} min` : ''}
            </p> */} 
          </div>
      </CardContent>
    </Card>
  );
}
