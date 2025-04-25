export type NivelExperiencia = 'iniciante' | 'intermediario' | 'avancado';
export type TipoObjetivo = 'prova' | 'pessoal';
export type TipoTreino = 'longo' | 'intervalado' | 'leve' | 'regenerativo';
export type DiaSemana = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';
export type TipoAssinatura = 'mensal' | 'semestral' | 'anual';
export type StatusAssinatura = 'ativa' | 'expirada' | 'cancelada';
export type StatusPagamento = 'pendente' | 'sucesso' | 'falha';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  peso_kg?: number;
  altura_cm?: number;
  criado_em: Date;
  atualizado_em: Date;
}

export interface Objetivo {
  id: string;
  usuario_id: string;
  tipo: TipoObjetivo;
  nivel_experiencia: NivelExperiencia;
  data_objetivo: Date;
  desempenho_atual?: string;
  distancia_objetivo_km: number;
  meta_performance: string;
  treinos_forca: boolean;
  dias_semana: DiaSemana[];
  dia_treino_longo: DiaSemana;
  data_inicio: Date;
  criado_em: Date;
  atualizado_em: Date;
}

export interface PlanoTreino {
  id: string;
  objetivo_id: string;
  titulo: string;
  resumo: string;
  quantidade_total_treinos: number;
  quilometros_planejados: number;
  quantidade_realizados: number;
  quilometros_percorridos: number;
  progresso_percentual: number;
  data_inicio: Date;
  data_fim: Date;
  criado_em: Date;
  atualizado_em: Date;
}

export interface Treino {
  id: string;
  plano_id: string;
  tipo: TipoTreino;
  distancia_km: number;
  resumo: string;
  data_planejada: Date;
  data_realizada?: Date;
  distancia_realizada_km?: number; // Distância real percorrida
  duracao_min?: number; // Adicionado para o Popover do calendário
  concluido: boolean;
  criado_em: Date;
  atualizado_em: Date;
}

export interface Pagamento {
  id: string;
  usuario_id: string;
  plano_id?: string;
  valor: number;
  moeda: string;
  status: StatusPagamento;
  provider_id: string;
  data_pagamento: Date;
  criado_em: Date;
  atualizado_em: Date;
}

export interface Assinatura {
  id: string;
  usuario_id: string;
  tipo_assinatura: TipoAssinatura;
  data_inicio: Date;
  data_fim: Date;
  status: StatusAssinatura;
  criado_em: Date;
  atualizado_em: Date;
}

// Tipos para o quiz
export interface QuizFormData {
  tipo: TipoObjetivo;
  nivel_experiencia: NivelExperiencia;
  distancia_confortavel_km?: number;
  data_objetivo: Date | string;
  desempenho_atual?: string;
  distancia_objetivo_km: number;
  meta_performance: string;
  treinos_forca: boolean;
  dias_semana: DiaSemana[];
  dia_treino_longo: DiaSemana;
  data_inicio: Date | string;
}

// Tipos para o dashboard
export interface ResumoTreino {
  semana: number;
  treinos_planejados: number;
  treinos_realizados: number;
  distancia_planejada: number;
  distancia_percorrida: number;
  progresso: number;
}

export interface EstatisticasGerais {
  total_km_percorridos: number;
  total_treinos_realizados: number;
  media_km_por_semana: number;
  progresso_geral: number;
  dias_ate_objetivo: number;
}
