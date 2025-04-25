import { Treino, TipoTreino } from "@/types";
import { CalendarDays, CheckCircle2, Clock, Dumbbell, Footprints, MapPin, BarChart } from "lucide-react"; // Icons
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils"; // Utility for conditional classes

// Helper para ícones de tipo de treino (pode ser expandido)
const getTipoIcon = (tipo: TipoTreino) => {
  switch (tipo) {
    case 'longo': return <Footprints className="h-4 w-4 text-blue-500" />;
    case 'intervalado': return <BarChart className="h-4 w-4 text-red-500" />;
    case 'leve': return <Dumbbell className="h-4 w-4 text-green-500" />;
    case 'regenerativo': return <Clock className="h-4 w-4 text-yellow-500" />;
    default: return <Footprints className="h-4 w-4 text-gray-500" />;
  }
};

interface TreinoListItemProps {
  treino: Treino;
}

export function TreinoListItem({ treino }: TreinoListItemProps) {
  return (
    <div className={cn(
      "flex items-start gap-4 p-3 rounded-lg border bg-card text-card-foreground transition-colors",
      treino.concluido ? "border-green-500/30 bg-green-500/5" : "hover:bg-muted/50"
    )}>
      {/* Ícone de Status/Tipo */}
      <div className="mt-1">
        {treino.concluido
          ? <CheckCircle2 className="h-5 w-5 text-green-600" />
          : getTipoIcon(treino.tipo)
        }
      </div>

      {/* Detalhes do Treino */}
      <div className="flex-1 text-sm">
        <p className="font-semibold capitalize">
          {treino.tipo} {treino.concluido ? '(Concluído)' : ''}
        </p>
        <p className="text-xs text-muted-foreground mb-1">
          {format(treino.data_planejada, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
        <p className="text-sm mb-1">{treino.resumo}</p>
        {treino.distancia_km && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {treino.distancia_km} km
            {treino.concluido && treino.distancia_realizada_km && treino.distancia_realizada_km !== treino.distancia_km && (
              <span className="ml-1 text-green-700 dark:text-green-400">(Realizado: {treino.distancia_realizada_km} km)</span>
            )}
          </p>
        )}
        {/* Adicionar mais detalhes se necessário (duração, pace, etc.) */} 
      </div>

      {/* Ações (Opcional) - Ex: botão de detalhes */} 
      {/* <Button variant="ghost" size="sm">Detalhes</Button> */} 
    </div>
  );
}
