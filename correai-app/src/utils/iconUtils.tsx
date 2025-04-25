import { TipoTreino } from "@/types";
import { CheckCircle2, Clock, Dumbbell, Footprints, BarChart } from "lucide-react";
import React from 'react'; // Importar React para JSX

/**
 * Retorna o ícone correspondente ao tipo de treino.
 * @param tipo - O tipo de treino (longo, intervalado, leve, regenerativo).
 * @param concluido - Opcional. Se true, retorna o ícone de concluído.
 * @returns Um elemento React representando o ícone.
 */
export const getTipoIcon = (tipo: TipoTreino, concluido?: boolean): React.ReactElement => {
  if (concluido) {
    return <CheckCircle2 className="h-4 w-4 text-primary" />;
  }
  switch (tipo) {
    case 'longo':
      return <Footprints className="h-4 w-4 text-blue-500" />;
    case 'intervalado':
      return <BarChart className="h-4 w-4 text-red-500" />;
    case 'leve':
      return <Dumbbell className="h-4 w-4 text-green-500" />;
    case 'regenerativo':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return <Footprints className="h-4 w-4 text-gray-500" />; // Ícone padrão
  }
};
