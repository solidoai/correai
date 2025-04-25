export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assinaturas: {
        Row: {
          atualizado_em: string
          criado_em: string
          data_fim: string
          data_inicio: string
          id: string
          status: Database["public"]["Enums"]["status_assinatura"]
          tipo_assinatura: Database["public"]["Enums"]["tipo_assinatura"]
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          data_fim: string
          data_inicio: string
          id?: string
          status: Database["public"]["Enums"]["status_assinatura"]
          tipo_assinatura: Database["public"]["Enums"]["tipo_assinatura"]
          usuario_id: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          status?: Database["public"]["Enums"]["status_assinatura"]
          tipo_assinatura?: Database["public"]["Enums"]["tipo_assinatura"]
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          criado_em: string
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          criado_em?: string
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          criado_em?: string
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      objetivos: {
        Row: {
          atualizado_em: string | null
          criado_em: string
          data_alvo: string | null
          descricao: string | null
          id: string
          nome_prova: string | null
          tipo: Database["public"]["Enums"]["tipo_objetivo"]
          usuario_id: string
          volume_semanal: number | null
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string
          data_alvo?: string | null
          descricao?: string | null
          id?: string
          nome_prova?: string | null
          tipo: Database["public"]["Enums"]["tipo_objetivo"]
          usuario_id: string
          volume_semanal?: number | null
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string
          data_alvo?: string | null
          descricao?: string | null
          id?: string
          nome_prova?: string | null
          tipo?: Database["public"]["Enums"]["tipo_objetivo"]
          usuario_id?: string
          volume_semanal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "objetivos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          assinatura_id: string
          atualizado_em: string
          criado_em: string
          id: string
          id_transacao_gateway: string
          status: Database["public"]["Enums"]["status_pagamento"]
          usuario_id: string
          valor: number
        }
        Insert: {
          assinatura_id: string
          atualizado_em?: string
          criado_em?: string
          id?: string
          id_transacao_gateway: string
          status: Database["public"]["Enums"]["status_pagamento"]
          usuario_id: string
          valor: number
        }
        Update: {
          assinatura_id?: string
          atualizado_em?: string
          criado_em?: string
          id?: string
          id_transacao_gateway?: string
          status?: Database["public"]["Enums"]["status_pagamento"]
          usuario_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_assinatura_id_fkey"
            columns: ["assinatura_id"]
            isOneToOne: false
            referencedRelation: "assinaturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      planos_treino: {
        Row: {
          atualizado_em: string | null
          criado_em: string
          data_fim: string | null
          data_inicio: string | null
          id: string
          objetivo_id: string
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          objetivo_id: string
          usuario_id: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          objetivo_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planos_treino_objetivo_id_fkey"
            columns: ["objetivo_id"]
            isOneToOne: false
            referencedRelation: "objetivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planos_treino_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          disponibilidade: Json | null
          email: string
          full_name: string | null
          id: string
          nivel_experiencia: Database["public"]["Enums"]["nivel_experiencia"]
          objetivo: string | null
          telefone: string | null
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          disponibilidade?: Json | null
          email: string
          full_name?: string | null
          id: string
          nivel_experiencia?: Database["public"]["Enums"]["nivel_experiencia"]
          objetivo?: string | null
          telefone?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          disponibilidade?: Json | null
          email?: string
          full_name?: string | null
          id?: string
          nivel_experiencia?: Database["public"]["Enums"]["nivel_experiencia"]
          objetivo?: string | null
          telefone?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessoes_treino: {
        Row: {
          atualizado_em: string | null
          concluido: boolean | null
          criado_em: string
          data: string
          descricao: string | null
          distancia: number | null
          duracao: number | null
          feedback: string | null
          id: string
          observacoes: string | null
          pace_medio: string | null
          plano_treino_id: string
          tipo: Database["public"]["Enums"]["tipo_treino"]
          titulo: string
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string | null
          concluido?: boolean | null
          criado_em?: string
          data: string
          descricao?: string | null
          distancia?: number | null
          duracao?: number | null
          feedback?: string | null
          id?: string
          observacoes?: string | null
          pace_medio?: string | null
          plano_treino_id: string
          tipo: Database["public"]["Enums"]["tipo_treino"]
          titulo: string
          usuario_id: string
        }
        Update: {
          atualizado_em?: string | null
          concluido?: boolean | null
          criado_em?: string
          data?: string
          descricao?: string | null
          distancia?: number | null
          duracao?: number | null
          feedback?: string | null
          id?: string
          observacoes?: string | null
          pace_medio?: string | null
          plano_treino_id?: string
          tipo?: Database["public"]["Enums"]["tipo_treino"]
          titulo?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessoes_treino_plano_treino_id_fkey"
            columns: ["plano_treino_id"]
            isOneToOne: false
            referencedRelation: "planos_treino"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessoes_treino_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          criado_em: string
          email: string
          id: string
          last_sign_in_at: string | null
          nome: string | null
          telefone: string | null
        }
        Insert: {
          criado_em?: string
          email: string
          id: string
          last_sign_in_at?: string | null
          nome?: string | null
          telefone?: string | null
        }
        Update: {
          criado_em?: string
          email?: string
          id?: string
          last_sign_in_at?: string | null
          nome?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_treinos_da_semana: {
        Args: {
          data_inicio: string
          data_fim: string
          id_usuario: string
        }
        Returns: {
          dia_semana: string
          data_treino: string
          tipo: Database["public"]["Enums"]["tipo_treino"]
          titulo: string
          distancia: number
          duracao: number
          descricao: string
          concluido: boolean
        }[]
      }
    }
    Enums: {
      nivel_experiencia: "iniciante" | "intermediario" | "avancado"
      status_assinatura: "ativa" | "expirada" | "cancelada"
      status_pagamento: "pendente" | "sucesso" | "falha"
      tipo_assinatura: "mensal" | "semestral" | "anual"
      tipo_objetivo: "prova" | "pessoal"
      tipo_treino: "longo" | "intervalado" | "leve" | "regenerativo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row']
export type Views<T extends keyof PublicSchema['Views']> = PublicSchema['Views'][T]['Row']
export type Functions<T extends keyof PublicSchema['Functions']> = PublicSchema['Functions'][T]['Returns']
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T]
export type CompositeTypes<T extends keyof PublicSchema['CompositeTypes']> = PublicSchema['CompositeTypes'][T]

export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update']

// Helper type extraction for Database type based on schema name
export type DatabaseSchema<SchemaName extends keyof Database = 'public'> = Database[SchemaName];

// General type helpers mirroring Supabase definitions but usable without generic parameters
// Useful for situations where the schema/table/etc. is known statically.

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;

export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;

export type DbResultErr = PostgrestError;

export type DbResultSuccess<T> = PostgrestSingleResponse<T>;

/**
 * FROM: https://github.com/supabase/supabase-js/blob/v2.43.4/src/lib/types.ts#L125C1-L129C2
 */
export interface PostgrestError {
  message: string
  details: string
  hint: string
  code: string
}

export interface PostgrestResponseBase {
  error: PostgrestError | null
  status: number
  statusText: string
  count: number | null
}

export interface PostgrestSingleResponse<T> extends PostgrestResponseBase {
  data: T | null
}

export interface PostgrestMaybeSingleResponse<T> extends PostgrestResponseBase {
  data: T | null
}

export interface PostgrestResponse<T> extends PostgrestResponseBase {
  data: T[]
}

// Implicit JSON type from JSONB
export type ImplicitJson = Json;

// Explicit JSON type
export type ExplicitJson = Json;

// Implicit Time type from TIME, TIMETZ
export type ImplicitTime = string;

// Explicit Time type
export type ExplicitTime = string;

// Implicit Timestamp type from TIMESTAMP, TIMESTAMPTZ
export type ImplicitTimestamp = string;

// Explicit Timestamp type
export type ExplicitTimestamp = string;

// Implicit Date type from DATE
export type ImplicitDate = string;

// Explicit Date type
export type ExplicitDate = string;

// Implicit UUID type from UUID
export type ImplicitUuid = string;

// Explicit UUID type
export type ExplicitUuid = string;

// Implicit Vector type from VECTOR
export type ImplicitVector = string;

// Explicit Vector type
export type ExplicitVector = number[];

// Implicit Int type from INT2, INT4, INT8
export type ImplicitInt = number;

// Explicit Int type
export type ExplicitInt = number;

// Implicit Float type from FLOAT4, FLOAT8, NUMERIC
export type ImplicitFloat = number;

// Explicit Float type
export type ExplicitFloat = number;

// Type refinements for specific tables
export type UsuariosRow = Tables<'usuarios'>;
export type UsuariosInsert = TablesInsert<'usuarios'>;
export type UsuariosUpdate = TablesUpdate<'usuarios'>;

export type ProfilesRow = Tables<'profiles'>;
export type ProfilesInsert = TablesInsert<'profiles'>;
export type ProfilesUpdate = TablesUpdate<'profiles'>;

export type ObjetivosRow = Tables<'objetivos'>;
export type ObjetivosInsert = TablesInsert<'objetivos'>;
export type ObjetivosUpdate = TablesUpdate<'objetivos'>;

export type PlanosTreinoRow = Tables<'planos_treino'>;
export type PlanosTreinoInsert = TablesInsert<'planos_treino'>;
export type PlanosTreinoUpdate = TablesUpdate<'planos_treino'>;

export type SessoesTreinoRow = Tables<'sessoes_treino'>;
export type SessoesTreinoInsert = TablesInsert<'sessoes_treino'>;
export type SessoesTreinoUpdate = TablesUpdate<'sessoes_treino'>;

export type AssinaturasRow = Tables<'assinaturas'>;
export type AssinaturasInsert = TablesInsert<'assinaturas'>;
export type AssinaturasUpdate = TablesUpdate<'assinaturas'>;

export type PagamentosRow = Tables<'pagamentos'>;
export type PagamentosInsert = TablesInsert<'pagamentos'>;
export type PagamentosUpdate = TablesUpdate<'pagamentos'>;

export type N8nChatHistoriesRow = Tables<'n8n_chat_histories'>;
export type N8nChatHistoriesInsert = TablesInsert<'n8n_chat_histories'>;
export type N8nChatHistoriesUpdate = TablesUpdate<'n8n_chat_histories'>;

// Exporting Enums directly for convenience
export type NivelExperiencia = Enums<'nivel_experiencia'>;
export type StatusAssinatura = Enums<'status_assinatura'>;
export type StatusPagamento = Enums<'status_pagamento'>;
export type TipoAssinatura = Enums<'tipo_assinatura'>;
export type TipoObjetivo = Enums<'tipo_objetivo'>;
export type TipoTreino = Enums<'tipo_treino'>;
