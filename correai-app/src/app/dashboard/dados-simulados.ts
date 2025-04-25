// src/app/dashboard/dados-simulados.ts
import { Treino } from "@/types"; // Importa a definição de Treino do local correto
import { startOfWeek, endOfWeek } from 'date-fns';

export const treinosSimulados: Treino[] = [
  { id: 't1', plano_id: 'p1', data_planejada: new Date('2024-07-22'), tipo: 'leve', resumo: 'Corrida leve', distancia_km: 5, concluido: true, data_realizada: new Date('2024-07-22'), distancia_realizada_km: 5, criado_em: new Date(), atualizado_em: new Date() }, // Adicionado distancia_realizada_km
  { id: 't2', plano_id: 'p1', data_planejada: new Date('2024-07-24'), tipo: 'intervalado', resumo: 'Tiros curtos', distancia_km: 6, concluido: true, data_realizada: new Date('2024-07-24'), distancia_realizada_km: 6.1, criado_em: new Date(), atualizado_em: new Date() }, // Adicionado distancia_realizada_km
  { id: 't3', plano_id: 'p1', data_planejada: new Date('2024-07-26'), tipo: 'longo', resumo: 'Corrida longa', distancia_km: 12, concluido: true, data_realizada: new Date('2024-07-26'), distancia_realizada_km: 11.8, criado_em: new Date(), atualizado_em: new Date() }, // Adicionado distancia_realizada_km
  { id: 't4', plano_id: 'p1', data_planejada: new Date('2024-07-29'), tipo: 'leve', resumo: 'Recuperação', distancia_km: 3, concluido: false, criado_em: new Date(), atualizado_em: new Date() },
  { id: 't5', plano_id: 'p1', data_planejada: new Date('2024-08-01'), tipo: 'intervalado', resumo: 'Tiros em subida', distancia_km: 6, concluido: false, criado_em: new Date(), atualizado_em: new Date() },
  { id: 't6', plano_id: 'p1', data_planejada: new Date('2024-08-05'), tipo: 'longo', resumo: 'Longão pré-prova', distancia_km: 15, concluido: false, criado_em: new Date(), atualizado_em: new Date() },
  { id: 't7', plano_id: 'p1', data_planejada: new Date('2024-08-08'), tipo: 'leve', resumo: 'Manutenção', distancia_km: 5, concluido: false, criado_em: new Date(), atualizado_em: new Date() },
  { id: 't8', plano_id: 'p1', data_planejada: new Date('2024-08-12'), tipo: 'regenerativo', resumo: 'Giro leve', distancia_km: 4, concluido: false, criado_em: new Date(), atualizado_em: new Date() },
  { id: 't9', plano_id: 'p1', data_planejada: new Date('2024-08-15'), tipo: 'leve', resumo: 'Pré-prova', distancia_km: 4, concluido: false, criado_em: new Date(), atualizado_em: new Date() },
];

// Helper para filtrar treinos da semana atual (pode ser útil)
export function getTreinosDaSemanaAtual(treinos: Treino[]): Treino[] {
  const hoje = new Date();
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 });
  const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 });
  return treinos.filter(treino =>
    treino.data_planejada >= inicioSemana && treino.data_planejada <= fimSemana
  );
}
