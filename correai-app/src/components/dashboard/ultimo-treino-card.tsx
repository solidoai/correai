"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Dumbbell, Route, Zap } from 'lucide-react';
import { TipoTreino } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TreinoConcluido {
  id: string;
  tipo: TipoTreino;
  resumo?: string; // Resumo pode ser opcional aqui
  data_realizada: Date;
  distancia_km?: number;
  duracao_min?: number;
}

interface UltimoTreinoCardProps {
  treino: TreinoConcluido | null | undefined;
}

// Reutilizar ou mover para utils
const getIconForTraining = (tipo: TipoTreino, className = "h-4 w-4") => {
  switch (tipo) {
    case 'longo': return <Route className={`${className} text-blue-500`} />;
    case 'intervalado': return <Zap className={`${className} text-destructive`} />;
    case 'leve': return <Dumbbell className={`${className} text-green-500`} />;
    case 'regenerativo': return <Clock className={`${className} text-yellow-500`} />;
    default: return <Dumbbell className={`${className} text-muted-foreground`} />;
  }
};

export function UltimoTreinoCard({ treino }: UltimoTreinoCardProps) {
  if (!treino) {
    // Pode optar por não renderizar nada se não houver treino anterior
    return null; 
  }

  const tempoAtras = formatDistanceToNow(treino.data_realizada, { locale: ptBR, addSuffix: true });

  return (
    <Card className="shadow-sm border-border/50 bg-background">
      <CardHeader className="p-3 border-b border-border/50">
         <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide flex items-center">
              <CheckCircle size={14} className="mr-1.5 text-green-600" /> ÚLTIMO TREINO CONCLUÍDO
         </CardTitle>
      </CardHeader>
      <CardContent className="p-3 grid grid-cols-[auto_1fr] gap-2.5 items-center">
          <div className="flex items-center justify-center rounded-md bg-muted h-8 w-8">
            {getIconForTraining(treino.tipo, "h-4 w-4")}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
                <Badge variant="secondary" className="capitalize text-xs py-0 px-1 h-5">{treino.tipo}</Badge>
                <p className="text-xs text-muted-foreground">{tempoAtras}</p>
            </div>
            <div className="text-xs text-foreground mt-1">
                {treino.distancia_km && <span>{treino.distancia_km} km</span>}
                {treino.distancia_km && treino.duracao_min && <span className="mx-1">•</span>}
                {treino.duracao_min && <span>{treino.duracao_min} min</span>}
                {!treino.distancia_km && !treino.duracao_min && treino.resumo && <span>{treino.resumo}</span>} 
            </div>
          </div>
      </CardContent>
    </Card>
  );
}
