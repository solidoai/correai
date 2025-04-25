# Guia de Integração do Dashboard com Supabase - CorreAí

Este guia detalha os passos necessários para integrar os componentes do dashboard da aplicação CorreAí com o backend Supabase, substituindo os dados simulados por dados reais do banco de dados.

## Pré-requisitos

1.  **Cliente Supabase Configurado:** Certifique-se de que o cliente Supabase (`@supabase/supabase-js`) está instalado e configurado corretamente no seu projeto. Você precisará das suas variáveis de ambiente `SUPABASE_URL` e `SUPABASE_ANON_KEY`.
2.  **Autenticação:** O usuário deve estar autenticado para acessar o dashboard. A integração assumirá que você tem acesso ao `id` do usuário logado.
3.  **Estrutura do Banco de Dados:** Este guia assume que a estrutura do banco de dados no Supabase corresponde às interfaces definidas em `src/types/index.ts` e às tabelas listadas na memória do projeto (usuários, objetivos, planos_treino, treinos, etc.).

## Abordagem Geral

1.  **Remover Dados Simulados:** Em cada componente do dashboard (`page.tsx`, `resumo.tsx`, `treinos.tsx`, `progresso.tsx`), remova as variáveis que contêm dados simulados (ex: `treinosSimulados`, `dadosPlano`, `estatisticas`, `conquistas`).
2.  **Criar Funções de API:** Crie funções assíncronas (preferencialmente em um diretório `src/lib/api` ou `src/services`) para buscar os dados necessários do Supabase. Essas funções usarão o cliente Supabase para fazer as queries.
3.  **Utilizar `useEffect` e `useState`:** Nos componentes React, use `useState` para gerenciar o estado dos dados (ex: `const [plano, setPlano] = useState<PlanoTreino | null>(null);`) e `useEffect` para chamar as funções de API quando o componente montar ou quando necessário.
4.  **Gerenciamento de Estado:** Considere usar um gerenciador de estado global (como Zustand, Context API) se os mesmos dados forem necessários em múltiplos componentes para evitar buscas repetidas.

## Integração por Componente/Funcionalidade

### 1. Dados do Usuário (Header e Nível)

*   **Componente:** `src/app/dashboard/page.tsx`
*   **Dados Necessários:** Nome do usuário, Nível (calculado).
*   **Tabelas Supabase:** `usuarios`.
*   **Passos:**
    1.  Crie uma função API `fetchUserData(userId)` que busca o nome do usuário na tabela `usuarios` pelo `userId`.
    2.  **Cálculo do Nível:** Defina a lógica para calcular o nível do usuário. Isso pode envolver buscar o XP total (ver seção Treinos), número de objetivos concluídos (`objetivos`), ou outros critérios.
    3.  No `DashboardPage`, use `useEffect` para chamar `fetchUserData` e calcular o nível. Atualize os estados `usuario.nome` e `usuario.nivel`.

### 2. Card do Plano Atual

*   **Componente:** `src/app/dashboard/page.tsx`
*   **Dados Necessários:** Título, resumo, progresso percentual, datas, contagem de treinos, km percorridos/planejados, média km/semana.
*   **Tabelas Supabase:** `planos_treino`, `objetivos` (para datas e contagem de dias), `treinos` (para calcular realizados e km percorridos).
*   **Passos:**
    1.  Identifique o `objetivo_id` ativo do usuário.
    2.  Crie uma função API `fetchCurrentPlanData(objetivoId)`.
    3.  Dentro da função:
        *   Busque o plano correspondente em `planos_treino` usando `objetivoId`.
        *   Busque o objetivo em `objetivos` para obter `data_objetivo` e calcular dias restantes.
        *   Faça queries agregadas na tabela `treinos` (filtrando pelo `plano_id` e `concluido = true`) para calcular `quantidade_realizados` e `quilometros_percorridos`.
        *   Calcule `progresso_percentual` e `media_km_por_semana` com base nos dados obtidos.
    4.  No `DashboardPage`, use `useEffect` para chamar `fetchCurrentPlanData` e atualizar o estado `dadosPlano` e `estatisticas`.

### 3. Card do Próximo Objetivo

*   **Componente:** `src/app/dashboard/page.tsx`
*   **Dados Necessários:** Descrição do objetivo (ex: nome da prova), data do objetivo.
*   **Tabelas Supabase:** `objetivos`.
*   **Passos:**
    1.  Identifique o `objetivo_id` ativo do usuário (pode reutilizar do passo anterior).
    2.  Crie uma função API `fetchNextGoal(objetivoId)` que busca os detalhes relevantes (ex: `meta_performance`, `data_objetivo`) na tabela `objetivos`.
    3.  No `DashboardPage`, use `useEffect` para chamar `fetchNextGoal` e atualizar o estado `usuario.proxima_corrida` e `usuario.data_proxima_corrida`.

### 4. Tab "Treinos"

*   **Componente:** `src/components/dashboard/treinos.tsx`
*   **Dados Necessários:** Lista de treinos futuros e passados, incluindo tipo, distância, resumo, data, status (concluído), XP.
*   **Tabelas Supabase:** `treinos`.
*   **Consideração:** Coluna `pontos_xp`.
*   **Passos:**
    1.  Identifique o `plano_id` ativo do usuário (pode vir dos dados do plano atual).
    2.  **Coluna `pontos_xp`:**
        *   **Opção A (Coluna Existe):** Verifique se a coluna `pontos_xp` existe na tabela `treinos`. Se não, adicione-a via migração SQL.
        *   **Opção B (Cálculo Dinâmico):** Se não quiser adicionar a coluna, calcule o XP na função API ou no frontend com base no `tipo` e `distancia_km` do treino.
    3.  Crie uma função API `fetchTrainings(planoId)`.
    4.  Dentro da função:
        *   Busque todos os treinos associados ao `planoId` na tabela `treinos`.
        *   Separe os treinos em "próximos" (não concluídos, data futura/hoje) e "anteriores" (concluídos).
        *   Ordene as listas por data.
    5.  No `DashboardTreinos`, use `useEffect` para chamar `fetchTrainings`. Atualize os estados `treinosAtivos` (para próximos) e `treinosAnteriores`.
    6.  **Marcar como Concluído:** Implemente a lógica no `marcarConcluido`:
        *   Chame uma função API `updateTrainingStatus(treinoId, status)`.
        *   Essa função fará um `update` na tabela `treinos` para definir `concluido = true` e `data_realizada = new Date()` para o `treinoId` específico.
        *   Atualize o estado local para refletir a mudança na UI imediatamente.
        *   Recalcule o total de XP ganho/disponível.

### 5. Tab "Progresso"

*   **Componente:** `src/components/dashboard/progresso.tsx`
*   **Dados Necessários:** Dados agregados por semana (para gráficos), lista de conquistas (status e progresso).
*   **Tabelas Supabase:** `treinos`, `planos_treino` (para semanas), potencialmente novas tabelas para conquistas.
*   **Passos:**
    1.  **Gráficos (Dados Semanais):**
        *   Crie uma função API `fetchWeeklyProgress(planoId)`.
        *   Essa função precisará fazer queries SQL complexas (talvez usando Funções Supabase - Edge Functions ou Database Functions) para:
            *   Agrupar treinos por semana (`GROUP BY date_trunc('week', data_planejada)`).
            *   Calcular a soma de `distancia_planejada`, `distancia_percorrida`, `treinos_planejados`, `treinos_realizados` para cada semana.
        *   Retorne os dados no formato esperado por `ResumoTreino[]`.
        *   No `DashboardProgresso`, use `useEffect` para chamar `fetchWeeklyProgress` e popular os dados dos gráficos.
    2.  **Conquistas:**
        *   **Opção A (Tabelas Dedicadas - Recomendado):**
            *   Crie tabelas `conquistas` (id, titulo, descricao, icone, criterio_tipo, criterio_valor) e `usuario_conquistas` (usuario_id, conquista_id, progresso, concluida, data_conquista).
            *   Crie uma função API `fetchAchievements(userId)` que busca os dados de `usuario_conquistas` e junta com `conquistas`.
            *   **Lógica de Atualização:** Crie gatilhos (database triggers) ou funções que rodem periodicamente (pg_cron) ou após cada treino concluído para atualizar o progresso em `usuario_conquistas`.
        *   **Opção B (Cálculo via Queries):**
            *   Defina as conquistas no código frontend.
            *   Crie uma função API `calculateAchievementStatus(userId)` que faz múltiplas queries para verificar o status de cada conquista (ex: `SELECT SUM(distancia_percorrida) FROM treinos...`, `SELECT COUNT(*) FROM treinos WHERE concluido = true...`).
            *   Essa abordagem pode ser menos performática.
        *   No `DashboardProgresso`, use `useEffect` para buscar/calcular os dados das conquistas e atualizar o estado `conquistas`.
    3.  **Estatísticas Gerais:** Reutilize os dados já buscados para o plano atual ou faça queries específicas se necessário.

## Exemplo de Função API (Pseudocódigo)

```typescript
// src/lib/api/treinos.ts
import { supabase } from '@/lib/supabaseClient';
import { Treino } from '@/types';

export async function fetchTrainings(planoId: string): Promise<{ proximos: Treino[], anteriores: Treino[] }> {
  if (!planoId) return { proximos: [], anteriores: [] };

  const { data, error } = await supabase
    .from('treinos')
    .select('*') // Selecione as colunas necessárias, incluindo pontos_xp se existir
    .eq('plano_id', planoId)
    .order('data_planejada', { ascending: true });

  if (error) {
    console.error('Erro ao buscar treinos:', error);
    return { proximos: [], anteriores: [] };
  }

  const agora = new Date();
  const proximos: Treino[] = [];
  const anteriores: Treino[] = [];

  (data || []).forEach(treino => {
    // Adapte a estrutura do 'treino' vindo do Supabase para a interface 'Treino'
    const treinoAdaptado: Treino = {
      ...treino,
      data_planejada: new Date(treino.data_planejada),
      data_realizada: treino.data_realizada ? new Date(treino.data_realizada) : undefined,
      // Calcule pontos_xp aqui se não vier da tabela
      pontos_xp: treino.pontos_xp || calcularXp(treino.tipo, treino.distancia_km), 
    };

    if (treino.concluido) {
      anteriores.push(treinoAdaptado);
    } else {
      proximos.push(treinoAdaptado);
    }
  });

  return { proximos, anteriores };
}

// Função auxiliar para calcular XP (exemplo)
function calcularXp(tipo: TipoTreino, distancia: number): number {
  let base = 10;
  if (tipo === 'longo') base = 15;
  if (tipo === 'intervalado') base = 20;
  return Math.round(base * distancia);
}

// ... outras funções como updateTrainingStatus
```

Lembre-se de tratar erros, estados de carregamento (`loading`) e casos onde os dados podem não existir (ex: usuário sem plano ativo). Boa integração!
