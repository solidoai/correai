import { createClient } from '@supabase/supabase-js';

// Obtém a URL e a Chave Anônima das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Valida se as variáveis de ambiente foram carregadas corretamente
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in .env.local');
}

// Cria e exporta a instância do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Opcional: Exportar os tipos gerados se você os gerar mais tarde
// export type Database = import('../types/supabase').Database;
