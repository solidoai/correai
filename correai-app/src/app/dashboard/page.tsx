"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, CalendarDays, AlertCircle, CheckCircle, PlusCircle, Loader2, Bell, Trash2, Settings, ExternalLink, User, Menu } from 'lucide-react';
import { ProgressoPlanoCard, PlanoResumo } from '@/components/dashboard/progresso-plano-card';
import { DistanciaPrevistaChart } from '@/components/dashboard/distancia-prevista-chart';
import { CalendarioSemanalView } from '@/components/dashboard/calendario-semanal-view';
import { toast } from 'react-hot-toast';
import { differenceInDays, format, parseISO } from 'date-fns';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; 
import ProtectedRoute from '@/components/auth/ProtectedRoute'; // Reintroduzir importação

// Importar Avatar
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Importar tipos
import { Treino, TipoTreino } from '@/types';

// Componentes Shadcn/ui para Menu e Alerta
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
  const router = useRouter();

  // Estado para controlar a visibilidade do alerta Strava
  const [showStravaAlert, setShowStravaAlert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [temPlanoAtivo, setTemPlanoAtivo] = useState(false);
  const [loadingPlano, setLoadingPlano] = useState(true);
  const [planoAtivoData, setPlanoAtivoData] = useState<PlanoResumo | null>(null);
  const [planoIdAtivo, setPlanoIdAtivo] = useState<string | null>(null);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // Estado para exclusão

  const { user } = useAuth(); 

  // Dados simulados para o usuário (manter por enquanto, se necessário em outro lugar)
  const usuario = {
    nome: "Rafael Silva",
  };

  // Treinos simulados para o calendário - EXPANDIDO COM MAIS TREINOS
  const treinosSimulados: Treino[] = [
    {
      id: 't1',
      tipo: 'longo' as TipoTreino,
      resumo: '15km ritmo constante Z2',
      distancia_km: 15,
      duracao_min: 90,
      data_planejada: new Date(new Date().setDate(new Date().getDate() + 1)),
      concluido: false,
      plano_id: 'p1',
      criado_em: new Date(),
      atualizado_em: new Date(),
    },
    {
      id: 't2',
      tipo: 'intervalado' as TipoTreino,
      resumo: '6x800m com 200m recuperação',
      distancia_km: 8,
      duracao_min: 45,
      data_planejada: new Date(new Date().setDate(new Date().getDate() - 1)),
      concluido: true,
      plano_id: 'p1',
      criado_em: new Date(),
      atualizado_em: new Date(),
    },
    {
      id: 't3',
      tipo: 'leve' as TipoTreino,
      resumo: 'Trote de recuperação',
      distancia_km: 5,
      duracao_min: 30,
      data_planejada: new Date(new Date().setDate(new Date().getDate() - 3)),
      concluido: true,
      plano_id: 'p1',
      criado_em: new Date(),
      atualizado_em: new Date(),
    },
    {
      id: 't4',
      tipo: 'longo' as TipoTreino,
      resumo: '18km progressivo',
      distancia_km: 18,
      duracao_min: 105,
      data_planejada: new Date(new Date().setDate(new Date().getDate() + 3)),
      concluido: false,
      plano_id: 'p1',
      criado_em: new Date(),
      atualizado_em: new Date(),
    },
    {
      id: 't5',
      tipo: 'intervalado' as TipoTreino,
      resumo: '12x400m com 100m recuperação',
      distancia_km: 10,
      duracao_min: 60,
      data_planejada: new Date(),
      concluido: false,
      plano_id: 'p1',
      criado_em: new Date(),
      atualizado_em: new Date(),
    },
    {
      id: 't6',
      tipo: 'leve' as TipoTreino,
      resumo: 'Corrida leve com variações',
      distancia_km: 6,
      duracao_min: 35,
      data_planejada: new Date(new Date().setDate(new Date().getDate() + 2)),
      concluido: false,
      plano_id: 'p1',
      criado_em: new Date(),
      atualizado_em: new Date(),
    },
    {
      id: 't7',
      tipo: 'regenerativo' as TipoTreino,
      resumo: 'Trabalho de mobilidade e regeneração',
      distancia_km: 0,
      duracao_min: 40,
      data_planejada: new Date(new Date().setDate(new Date().getDate() - 2)),
      concluido: true,
      plano_id: 'p1',
      criado_em: new Date(),
      atualizado_em: new Date(),
    },
  ];

  // Buscamos o próximo treino a partir da lista de treinos simulados
  const proximoTreino = treinosSimulados
    .filter((treino: Treino) => !treino.concluido)
    .sort((a: Treino, b: Treino) => a.data_planejada.getTime() - b.data_planejada.getTime())[0];

  const ultimoTreinoConcluidoSimulado = {
    id: 't2',
    tipo: 'intervalado' as TipoTreino,
    distancia_km: 8,
    data_realizada: new Date(new Date().setDate(new Date().getDate() - 1))
  };

  const resumoSemanalSimulado = {
    treinosRealizados: 2,
    treinosPlanejados: 3,
    distanciaPercorrida: 13,
    distanciaPlanejada: 22,
  };

  const handleDismissStravaAlert = () => {
    setShowStravaAlert(false);
  };

  // Função para excluir o plano de treino
  const handleExcluirPlano = async () => {
    if (!planoIdAtivo) return;
    setIsDeleting(true);
    toast.loading('Excluindo plano...', { id: 'delete-toast' });

    try {
      // Tentar excluir treinos associados primeiro (opcional, depende do ON DELETE CASCADE)
      // const { error: treinosError } = await supabase
      //   .from('treinos')
      //   .delete()
      //   .match({ plano_id: planoIdAtivo });
      // if (treinosError) throw new Error(`Erro ao excluir treinos: ${treinosError.message}`);

      // Excluir o plano
      const { error: planoError } = await supabase
        .from('planos_treino')
        .delete()
        .match({ id: planoIdAtivo });

      if (planoError) throw planoError;

      toast.success('Plano excluído com sucesso!', { id: 'delete-toast' });
      // Resetar estado local para refletir a exclusão
      setPlanoIdAtivo(null);
      setPlanoAtivoData(null);
      setTemPlanoAtivo(false); // <<< ADICIONAR ESTA LINHA
      // Opcional: Recarregar dados ou redirecionar, se necessário
      // fetchUserObjetivo(); // Recarrega dados do dashboard
    } catch (error: any) {
      console.error("Erro ao excluir plano:", error);
      toast.error(`Falha ao excluir o plano: ${error.message}`, { id: 'delete-toast' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Função para verificar se o usuário tem plano ativo
  useEffect(() => {
    const verificarPlanoAtivo = async () => {
      if (!user) {
        setLoadingPlano(false);
        return;
      }

      setLoadingPlano(true);
      setPlanoAtivoData(null); // Resetar dados do plano ao verificar
      setPlanoIdAtivo(null); // Resetar ID do plano
      try {
        // 1. Buscar objetivo_id
        const { data: objetivoData, error: objetivoError } = await supabase
          .from('objetivos')
          .select('id')
          .eq('usuario_id', user.id)
          .maybeSingle(); // Usar maybeSingle para não dar erro se não houver objetivo

        if (objetivoError) throw objetivoError;

        if (objetivoData) {
          const objetivoId = objetivoData.id;
          // 2. Buscar dados do plano usando objetivo_id
          const { data: planoData, error: planoError } = await supabase
            .from('planos_treino')
            .select('id, titulo, progresso_percentual, data_inicio, data_fim, quantidade_realizados, quantidade_total_treinos')
            .eq('objetivo_id', objetivoId)
            .single(); // Assume um plano por objetivo

          if (planoError) {
            // Se der erro buscando plano, assume que não tem plano ativo
            console.error("Erro ao buscar plano de treino:", planoError.message);
            setTemPlanoAtivo(false);
            setPlanoAtivoData(null);
          } else if (planoData) {
            // Calcular dias restantes
            let diasRestantes = 0;
            if (planoData.data_fim) {
              try {
                const hoje = new Date();
                const dataFim = parseISO(planoData.data_fim);
                const diff = differenceInDays(dataFim, hoje);
                diasRestantes = diff >= 0 ? diff : 0;
              } catch (dateError) {
                console.error("Erro ao parsear ou calcular diferença de datas:", dateError);
                // Tratar erro de data inválida se necessário, por enquanto 0
                diasRestantes = 0;
              }
            }

            // Criar objeto PlanoResumo
            const resumo: PlanoResumo = {
              titulo: planoData.titulo,
              progresso_percentual: planoData.progresso_percentual,
              dias_restantes: diasRestantes,
              treinos_concluidos: planoData.quantidade_realizados,
              total_treinos: planoData.quantidade_total_treinos,
              data_inicio: planoData.data_inicio,
              data_fim: planoData.data_fim,
            };

            setPlanoAtivoData(resumo);
            setTemPlanoAtivo(true);
            // Setar o ID do plano ativo
            setPlanoIdAtivo(planoData.id);
          } else {
            // Não encontrou plano para o objetivo
            setTemPlanoAtivo(false);
            setPlanoAtivoData(null);
            setPlanoIdAtivo(null);
          }
        } else {
          // Não encontrou objetivo ativo
          setTemPlanoAtivo(false);
          setPlanoAtivoData(null);
          setPlanoIdAtivo(null);
        }

      } catch (error) {
        console.error('Erro ao verificar plano ativo:', error instanceof Error ? error.message : error);
        setTemPlanoAtivo(false);
        setPlanoAtivoData(null);
        setPlanoIdAtivo(null);
      } finally {
        setLoadingPlano(false);
      }
    };

    verificarPlanoAtivo();
  }, [user]); 

  // Função auxiliar para extrair o primeiro nome do usuário
  const getFirstName = (user: any): string => {
    // Verificar onde o nome do usuário pode estar armazenado
    // Log para debug - remover após confirmar funcionamento
    console.log('Dados do usuário:', user?.user_metadata);
    
    if (user?.user_metadata?.nome_completo) {
      return user.user_metadata.nome_completo.split(' ')[0];
    }
    
    if (user?.user_metadata?.nome) {
      return user.user_metadata.nome.split(' ')[0];
    }
    
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    
    if (user?.email) {
      return user.email.split('@')[0];
    }
    
    return 'Corredor';
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col bg-primary/10 pb-0">

        {/* Cabeçalho Fixo - CORRIGIDO */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4">
          {/* Esquerda: User Avatar & Greeting */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {/* Usar dados do usuário real */}
              <AvatarFallback>{user?.user_metadata?.nome_completo?.charAt(0) || user?.user_metadata?.nome?.charAt(0) || user?.email?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <h1 className="text-base font-semibold text-foreground">
              Olá, {getFirstName(user)}!
            </h1>
          </div>

          {/* Direita: Botão de Notificações */}
          <div className="ml-auto flex items-center gap-2">
            {/* Botão de Menu */}
            <AlertDialog> {/* AlertDialog envolve o Dropdown para a confirmação */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Menu</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Item Gerenciar Conta com Link */}
                  <Link href="/perfil" passHref legacyBehavior>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Gerenciar Conta</span>
                    </DropdownMenuItem>
                  </Link>
                  {/* Item Integração Strava (ainda com toast) */}
                  <DropdownMenuItem onSelect={() => toast('Funcionalidade de integração Strava ainda não implementada.')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <span>Integração Strava</span>
                  </DropdownMenuItem>
                  {/* Mostrar opção de exclusão apenas se houver plano ativo */}
                  {planoIdAtivo && (
                    <>
                      <DropdownMenuSeparator />
                      <AlertDialogTrigger asChild>
                        {/* Desabilita o item se já estiver excluindo */}
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          disabled={isDeleting}
                          onSelect={(e) => e.preventDefault()} // Previne fechar o menu ao clicar
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir Plano de Treino</span>
                          {/* Mostra spinner durante a exclusão */}
                          {isDeleting && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Conteúdo do Modal de Confirmação de Exclusão */}
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir seu plano de treino atual?
                    Todos os treinos associados também serão removidos.
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleExcluirPlano}
                    disabled={isDeleting}
                    className={buttonVariants({ variant: "destructive" })} // Usa variants
                  >
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Excluir Permanentemente
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        {/* Contêiner Principal para Main e Aside */}
        <div className="flex flex-col lg:flex-row px-4 pt-4 pb-0 lg:px-6 lg:pt-6 lg:pb-0 lg:gap-6">

          {loadingPlano ? (
            // Indicador de Carregamento Centralizado
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : temPlanoAtivo ? (
            // Conteúdo do Dashboard QUANDO HÁ PLANO
            <>
              <main className="flex flex-col gap-4 lg:w-2/3">
                {/* Alerta para Conectar Strava (Dispensável) */}
                {/* <ConectarStravaAlert
                  isVisible={showStravaAlert}
                  onDismiss={handleDismissStravaAlert}
                /> */}

                {/* 1. Progresso do Plano */}
                <ProgressoPlanoCard plano={planoAtivoData} />

                {/* 2. Calendário Semanal - Aumentado em tamanho */}
                <div className="h-auto min-h-[300px]">
                  <CalendarioSemanalView planoId={planoIdAtivo} />
                </div>

                {/* 4. Gráfico Distância Prevista */}
                {planoIdAtivo && planoAtivoData?.data_inicio && planoAtivoData?.data_fim && (
                  <DistanciaPrevistaChart
                    planoId={planoIdAtivo}
                    dataInicioPlano={planoAtivoData.data_inicio}
                    dataFimPlano={planoAtivoData.data_fim}
                  />
                )}

              </main>

              {/* Barra Lateral */}
              <aside className="w-full mt-6 lg:mt-0 lg:w-1/3 space-y-6">
                {/* Conteúdo da Sidebar aqui */}
              </aside>
            </>
          ) : (
            // Conteúdo QUANDO NÃO HÁ PLANO
            <main className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-8">
              <h2 className="text-2xl font-semibold">Nenhum plano de treino ativo.</h2>
              <p className="text-muted-foreground">
                Vamos criar um plano personalizado para você alcançar seus objetivos!
              </p>
              <Link href="/quiz">
                <Button size="lg">Gerar Novo Plano de Treino</Button>
              </Link>
            </main>
          )}

        </div> {/* Fim do Contêiner Principal */}

        {/* Navegação Inferior Fixa */}
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 grid grid-cols-2 gap-1 items-center z-20">
          {/* ... (conteúdo da navegação) ... */}
        </nav>

      </div>
    </ProtectedRoute>
  );
}
