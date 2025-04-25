"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, Footprints, Dumbbell, Clock, Zap, Feather, HeartPulse, Bed, Trophy, Activity } from "lucide-react";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isToday, 
  addWeeks, 
  subWeeks,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  addMonths,
  subMonths,
  differenceInCalendarDays
} from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabaseClient'; // Importar cliente Supabase

interface CalendarioSemanalViewProps {
  planoId: string | null;
}

// Definir tipo para os dados do treino buscados (renomeado para evitar conflito)
type FetchedTreino = {
  id: string;
  data_planejada: string; 
  tipo: string; 
  distancia_km?: number;
  resumo?: string; 
  concluido?: boolean; 
  // Adicionar outros campos se necessário
};

export function CalendarioSemanalView({ planoId }: CalendarioSemanalViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [trainings, setTrainings] = useState<FetchedTreino[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const buscarTreinosDoPlano = async () => {
      // Se não houver planoId, não buscar
      if (!planoId) {
        setTrainings([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const firstDayOfMonth = startOfMonth(currentDate).toISOString().split('T')[0];
      const lastDayOfMonth = endOfMonth(currentDate).toISOString().split('T')[0];

      try {
        // Buscar treinos do mês atual usando o planoId fornecido
        const { data: fetchedTrainings, error: treinosError } = await supabase
          .from('treinos')
          .select('id, data_planejada, tipo, distancia_km, resumo, concluido') 
          .eq('plano_id', planoId) 
          .gte('data_planejada', firstDayOfMonth) 
          .lte('data_planejada', lastDayOfMonth) 
          .order('data_planejada', { ascending: true }); 

        if (treinosError) throw treinosError;

        setTrainings(fetchedTrainings || []);
      } catch (error: any) {
        console.error('Erro ao buscar treinos:', error.message);
        setTrainings([]); 
      } finally {
        setIsLoading(false);
      }
    };

    buscarTreinosDoPlano();

  }, [planoId, currentDate]); 

  const [isMonthView, setIsMonthView] = useState(true);
  
  // Funções de navegação para visão semanal
  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  // Funções de navegação para visão mensal
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  // Alternar entre visualizações
  const toggleView = () => {
    setIsMonthView(!isMonthView);
  };

  // Calcula os dias da semana
  const inicioSemana = startOfWeek(currentDate, { weekStartsOn: 1 });
  const fimSemana = endOfWeek(currentDate, { weekStartsOn: 1 });
  const diasDaSemana = eachDayOfInterval({ start: inicioSemana, end: fimSemana });
  
  // Calcula os dias do mês (incluindo dias fora do mês atual para preencher o grid)
  const inicioMes = startOfMonth(currentDate);
  const fimMes = endOfMonth(currentDate);
  
  // Ajusta para começar na segunda-feira antes do início do mês
  const inicioPrimeiraSemanaMes = startOfWeek(inicioMes, { weekStartsOn: 1 });
  // Ajusta para terminar no domingo após o fim do mês
  const fimUltimaSemanaMes = endOfWeek(fimMes, { weekStartsOn: 1 });
  
  // Array com todos os dias do calendário mensal
  const diasDoMes = eachDayOfInterval({ 
    start: inicioPrimeiraSemanaMes, 
    end: fimUltimaSemanaMes 
  });
  
  // Calcula número de semanas para o grid
  const numSemanas = Math.ceil(diasDoMes.length / 7);

  // Filtra os treinos para a visualização atual
  const treinosDoPeriodo = trainings.filter(t => {
    const dataTreino = new Date(t.data_planejada); 
    if (isMonthView) {
      // Para visão mensal, mostra todos os treinos que aparecem no calendário
      return dataTreino >= inicioPrimeiraSemanaMes && dataTreino <= fimUltimaSemanaMes;
    } else {
      // Para visão semanal, só mostra treinos da semana atual
      return dataTreino >= inicioSemana && dataTreino <= fimSemana;
    }
  });

  // Formata o intervalo para exibição
  const periodoFormatado = isMonthView
    ? format(currentDate, 'MMMM yyyy', { locale: ptBR })
    : `${format(inicioSemana, 'dd')} - ${format(fimSemana, 'dd MMM', { locale: ptBR })}`;

  // Busca treino para um dia específico
  const getTreinoDoDia = (dia: Date) => {
    // Formatar a data do dia para comparar com as datas dos treinos (YYYY-MM-DD)
    const diaFormatado = format(dia, 'yyyy-MM-dd');
    // Encontrar o treino cuja data_planejada corresponde ao dia formatado
    return trainings.find(t => t.data_planejada.startsWith(diaFormatado)); 
  };

  // Determina o número de semanas a mostrar (para altura do grid)
  const heightClass = isMonthView 
    ? numSemanas === 6 ? "min-h-[360px]" : "min-h-[300px]" 
    : "min-h-[200px] md:min-h-[250px]";

  // Função para obter o ícone com base no tipo de treino
  const getTipoIcon = (tipo: string | undefined | null, concluido: boolean = false) => {
    const iconClass = "h-3 w-3 md:h-4 md:w-4"; // Tamanho padrão do ícone

    // Se concluído, mostrar sempre o ícone de check
    if (concluido) {
      return <CheckCircle2 className={`${iconClass} text-green-500`} />;
    }

    // Mapear tipo para ícone
    switch (tipo?.toLowerCase()) {
      case 'longo':
        return <Footprints className={iconClass} />;
      case 'intervalado':
      case 'tiros':
        return <Zap className={iconClass} />;
      case 'leve':
      case 'moderado':
      case 'rodagem':
        return <Feather className={iconClass} />;
      case 'regenerativo':
        return <HeartPulse className={iconClass} />;
      case 'forca':
      case 'força':
        return <Dumbbell className={iconClass} />;
      case 'descanso':
        return <Bed className={iconClass} />;
      case 'competicao':
      case 'competição':
      case 'prova':
        return <Trophy className={iconClass} />;
      default:
        // Usar 'Activity' como ícone padrão para tipos desconhecidos
        return <Activity className={iconClass} />;
    }
  };

  return (
    <Card className="shadow-sm border-border/50 bg-background overflow-hidden">
      <CardHeader className="p-3 border-b border-border/50 flex flex-row items-center justify-between">
        {/* Botão Anterior */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={isMonthView ? goToPreviousMonth : goToPreviousWeek}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Título com Botão para Alternar Visualização */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="h-8 px-2 font-medium" 
            onClick={toggleView}
          >
            <CardTitle className="text-sm font-semibold text-foreground tracking-wide flex items-center capitalize">
              {periodoFormatado}
            </CardTitle>
          </Button>
        </div>

        {/* Botão Próximo */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={isMonthView ? goToNextMonth : goToNextWeek}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 text-center border-b border-border/40 bg-muted/30">
            {['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'].map(diaSemana => (
              <div key={diaSemana} className="py-2 text-xs font-medium text-muted-foreground uppercase">
                {diaSemana}
              </div>
            ))}
          </div>
          
          {/* Grade de dias - Mês ou Semana dependendo da visualização */}
          <div className={`grid grid-cols-7 ${heightClass}`}>
            {/* Dias do mês ou semana */}
            {(isMonthView ? diasDoMes : diasDaSemana).map((dia, index) => {
              const treinoDoDia = getTreinoDoDia(dia);
              const diaAtual = isToday(dia);
              const foraMes = !isSameMonth(dia, currentDate);
              
              // Classes condicionais
              const cellClasses = cn(
                "relative border-b border-r border-border/30", 
                "p-1", 
                "flex flex-col items-center", 
                isMonthView ? "min-h-[45px]" : "min-h-[70px] md:min-h-[90px]", 
                diaAtual ? "bg-primary/10" : "",
                foraMes ? "text-muted-foreground/50 bg-muted/10" : "",
                treinoDoDia ? "hover:bg-muted/50 cursor-pointer" : "",
                index % 7 === 6 ? "border-r-0" : "" 
              );
              
              // Container do dia
              return (
                <div key={dia.toISOString()} className={cellClasses}>
                  {/* Número do dia */}
                  <div className={cn(
                    "text-xs md:text-sm font-semibold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full",
                    diaAtual ? "bg-primary text-primary-foreground" : foraMes ? "text-muted-foreground/60" : "text-foreground"
                  )}>
                    {format(dia, 'd', { locale: ptBR })}
                  </div>
                  
                  {/* Indicador de treino - versão simplificada */}
                  {treinoDoDia && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="mt-1 flex h-4 w-4 items-center justify-center">
                          {getTipoIcon(treinoDoDia.tipo, treinoDoDia.concluido)}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3 shadow-lg">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getTipoIcon(treinoDoDia.tipo, treinoDoDia.concluido)}
                            <h4 className="font-semibold capitalize">{treinoDoDia.tipo}</h4>
                          </div>
                          <p className="text-sm">{treinoDoDia.resumo}</p> 
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              {treinoDoDia.distancia_km && <span>{treinoDoDia.distancia_km} km</span>} 
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(treinoDoDia.data_planejada), 'HH:mm')}h 
                            </span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
