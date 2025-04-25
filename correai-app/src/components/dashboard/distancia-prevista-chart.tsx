 'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  BarProps,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Treino } from '@/types';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  addDays,
  isSameDay,
  isSameMonth,
  parseISO,
  getDay,
  getWeekOfMonth,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DistanciaPrevistaChartProps {
  planoId: string | null;
  dataInicioPlano?: string | null;
  dataFimPlano?: string | null;
}

type FiltroPeriodo = 'semanal' | 'mensal';

const diasSemanaAbrev = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface ChartDataPoint {
  name: string;
  km: number;
}

export function DistanciaPrevistaChart({ planoId, dataInicioPlano, dataFimPlano }: DistanciaPrevistaChartProps) {
  const [periodo, setPeriodo] = useState<FiltroPeriodo>('semanal');
  const [fetchedTreinos, setFetchedTreinos] = useState<Treino[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const buscarTreinosDoPlano = async () => {
      if (!planoId) {
        setFetchedTreinos([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('treinos')
          .select('id, data_planejada, distancia_km, concluido, tipo, resumo, criado_em, atualizado_em')
          .eq('plano_id', planoId);

        if (error) throw error;

        const treinosFormatados: Treino[] = (data || []).map((t: any) => ({
          id: t.id,
          data_planejada: new Date(t.data_planejada),
          distancia_km: Number(t.distancia_km) || 0,
          tipo: t.tipo || 'indefinido',
          resumo: t.resumo || '',
          concluido: t.concluido || false,
          plano_id: planoId,
          criado_em: t.criado_em ? new Date(t.criado_em) : new Date(),
          atualizado_em: t.atualizado_em ? new Date(t.atualizado_em) : new Date(),
        }));

        setFetchedTreinos(treinosFormatados);
      } catch (error: any) {
        console.error('[DistanciaPrevistaChart] Erro ao buscar/formatar treinos:', error.message);
        console.error('Erro ao buscar treinos para o gráfico:', error.message);
        setFetchedTreinos([]);
      } finally {
        setIsLoading(false);
      }
    };

    buscarTreinosDoPlano();
  }, [planoId]);

  const handlePeriodoChange = (value: string) => {
    if (value === 'semanal' || value === 'mensal') {
      setPeriodo(value as FiltroPeriodo);
    }
  };

  const dadosGrafico = useMemo((): ChartDataPoint[] => {
    if (!fetchedTreinos.length) return [];

    if (periodo === 'semanal') {
      // Nova lógica: mostrar o acumulado das próximas semanas
      const hoje = new Date();
      
      // Definir início e fim da semana atual
      const inicioSemanaAtual = startOfWeek(hoje, { weekStartsOn: 1 });
      const fimSemanaAtual = endOfWeek(hoje, { weekStartsOn: 1 });
      
      // Definir início e fim da próxima semana
      const inicioProximaSemana = addDays(fimSemanaAtual, 1);
      const fimProximaSemana = endOfWeek(inicioProximaSemana, { weekStartsOn: 1 });
      
      // Definir início e fim da semana seguinte
      const inicioSemanaSeguinte = addDays(fimProximaSemana, 1);
      const fimSemanaSeguinte = endOfWeek(inicioSemanaSeguinte, { weekStartsOn: 1 });
      
      // Calcular km acumulados para a semana atual
      const kmSemanaAtual = fetchedTreinos
        .filter(t => {
          const dataTreino = t.data_planejada instanceof Date ? t.data_planejada : new Date(t.data_planejada);
          return dataTreino >= inicioSemanaAtual && dataTreino <= fimSemanaAtual && t.distancia_km;
        })
        .reduce((sum, t) => sum + (t.distancia_km || 0), 0);
      
      // Calcular km acumulados para a próxima semana
      const kmProximaSemana = fetchedTreinos
        .filter(t => {
          const dataTreino = t.data_planejada instanceof Date ? t.data_planejada : new Date(t.data_planejada);
          return dataTreino >= inicioProximaSemana && dataTreino <= fimProximaSemana && t.distancia_km;
        })
        .reduce((sum, t) => sum + (t.distancia_km || 0), 0);
      
      // Calcular km acumulados para a semana seguinte
      const kmSemanaSeguinte = fetchedTreinos
        .filter(t => {
          const dataTreino = t.data_planejada instanceof Date ? t.data_planejada : new Date(t.data_planejada);
          return dataTreino >= inicioSemanaSeguinte && dataTreino <= fimSemanaSeguinte && t.distancia_km;
        })
        .reduce((sum, t) => sum + (t.distancia_km || 0), 0);
      
      // Formatar os intervalos de datas para exibição (ex: "21-27 abr")
      const formatarSemana = (inicio: Date, fim: Date) => {
        const inicioFormatado = format(inicio, 'dd', { locale: ptBR });
        const fimFormatado = format(fim, 'dd MMM', { locale: ptBR });
        return `${inicioFormatado}-${fimFormatado}`;
      };
      
      // Criar os pontos de dados para o gráfico
      const dadosSemanas = [
        {
          name: `${formatarSemana(inicioSemanaAtual, fimSemanaAtual)}`,
          km: Math.round(kmSemanaAtual * 10) / 10
        },
        {
          name: `${formatarSemana(inicioProximaSemana, fimProximaSemana)}`,
          km: Math.round(kmProximaSemana * 10) / 10
        }
      ];
      
      // Adicionar a semana seguinte apenas se houver treinos programados para ela OU para a próxima
      if (kmSemanaSeguinte > 0 || kmProximaSemana > 0) {
        dadosSemanas.push({
          name: `${formatarSemana(inicioSemanaSeguinte, fimSemanaSeguinte)}`,
          km: Math.round(kmSemanaSeguinte * 10) / 10
        });
      }
      
      return dadosSemanas;

    } else { // periodo === 'mensal'
      if (!dataInicioPlano || !dataFimPlano) {
        console.warn('[DistanciaPrevistaChart] Datas de início/fim do plano não fornecidas.');
        return []; // Retorna vazio se não houver datas
      }

      try {
        const inicioPlano = parseISO(dataInicioPlano);
        const fimPlano = parseISO(dataFimPlano);

        // Garantir que as datas sejam válidas
        if (isNaN(inicioPlano.getTime()) || isNaN(fimPlano.getTime())) {
          throw new Error('Datas do plano inválidas.');
        }

        // Gerar lista de meses no intervalo do plano
        const mesesDoPlano = eachMonthOfInterval({ start: inicioPlano, end: fimPlano });

        return mesesDoPlano.map(mes => {
          const kmDoMes = fetchedTreinos
            .filter(t => {
              const dataTreino = t.data_planejada instanceof Date ? t.data_planejada : new Date(t.data_planejada);
              // Verifica se o treino pertence a este mês específico
              return !isNaN(dataTreino.getTime()) && isSameMonth(dataTreino, mes) && t.distancia_km;
            })
            .reduce((sum, t) => sum + (t.distancia_km || 0), 0);

          const dataPoint = {
            name: format(mes, 'MMM/yy', { locale: ptBR }), // Formato 'Abr/25'
            km: Math.round(kmDoMes * 10) / 10
          };

          return dataPoint;
        });

      } catch (error) {
        console.error('[DistanciaPrevistaChart] Erro ao processar datas do plano:', error);
        return []; // Retorna vazio em caso de erro
      }
    }
  }, [periodo, fetchedTreinos, dataInicioPlano, dataFimPlano]); // Dependências do useMemo

  return (
    <Card className="shadow-sm border-border/50 bg-background">
      <CardHeader className="p-3 border-b border-border/50 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide">
          DISTÂNCIA PREVISTA (KM)
        </CardTitle>
        <ToggleGroup
          type="single"
          defaultValue="semanal"
          value={periodo}
          onValueChange={handlePeriodoChange}
          aria-label="Selecionar período"
          size="sm"
          className="h-7"
        >
          <ToggleGroupItem value="semanal" aria-label="Semanal" className="text-xs px-2">
            Semana
          </ToggleGroupItem>
          <ToggleGroupItem value="mensal" aria-label="Mensal" className="text-xs px-2">
            Mês
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {!isLoading && (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dadosGrafico} margin={{ top: 20, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
                axisLine={false} 
                tickLine={false} 
                interval={0} // Mostrar todos os labels
              />
              <YAxis
                tickFormatter={(value) => `${value} km`}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                axisLine={false}
                tickLine={false} 
                allowDecimals={false} // Tentar evitar decimais/valores estranhos no eixo
              />
              <Bar dataKey="km" radius={[4, 4, 0, 0]} fill="#60a5fa">
                <LabelList dataKey="km" position="top" formatter={(value: number) => `${value} km`} style={{ fontSize: '10px', fill: '#3b82f6', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
