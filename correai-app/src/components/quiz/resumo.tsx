import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, Calendar, Award, Clock, Target, Dumbbell, User, Activity, TrendingUp, CalendarDays, ChevronRight, AlertTriangle } from "lucide-react";
import { QuizFormData } from '@/types';

// Helper component for loading state
const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

interface QuizResumoProps {
  formData: QuizFormData;
  dadosUsuario: any; // Placeholder type
}

// Utility to format display values consistently
const formatDisplay = (data: any): string => {
    if (data === undefined || data === null || data === '') return 'N/A';
    if (Array.isArray(data)) return data.length > 0 ? data.join(', ') : 'N/A';
    if (typeof data === 'boolean') return data ? 'Sim' : 'Não';
    if (data instanceof Date) return format(data, "P", { locale: ptBR });
    // Specific check for date strings before formatting
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}/.test(data)) {
      try {
        // Attempt to parse and format only if it resembles a date
        const date = new Date(data + 'T00:00:00'); // Add time part to avoid timezone issues
        return format(date, "P", { locale: ptBR });
      } catch (e) {
        // Fallback if parsing fails
        return data;
      }
    }
    return String(data);
  };

// --- Display Helper Functions ---
const getNivelExperienciaLabel = (nivel: string | undefined): string => {
    switch (nivel?.toLowerCase()) {
        case 'iniciante': return 'Iniciante';
        case 'intermediario': return 'Intermediário'; 
        case 'avancado': return 'Avançado';       
        case 'não corro': return 'Não corro atualmente';
        default: return 'N/A';
    }
};

const getDiaLongoLabel = (dia: string | undefined): string => {
    switch (dia?.toLowerCase()) {
        case 'seg': return 'Segunda-feira'; 
        case 'ter': return 'Terça-feira';   
        case 'qua': return 'Quarta-feira';  
        case 'qui': return 'Quinta-feira';  
        case 'sex': return 'Sexta-feira';   
        case 'sab': return 'Sábado';
        case 'dom': return 'Domingo';
        default: return 'N/A';
    }
};

const getTipoObjetivoLabel = (tipo: string | undefined): string => {
    switch (tipo?.toLowerCase()) {
        case 'prova': return 'Competição/Prova';
        case 'pessoal': return 'Objetivo Pessoal'; 
        default: return 'N/A';
    }
};
// --- End Display Helper Functions ---

export function QuizResumo({ formData, dadosUsuario }: QuizResumoProps) {
   // --- JSX Structure --- 
   return (
     <div className="space-y-6">
       <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-primary">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Resumo das Suas Respostas
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/30">
            {/* Experience Section */}
            <div className="p-3 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center"><Activity className="h-4 w-4 mr-1.5" /> Nível Experiência</span>
                  <span className="font-medium text-foreground">{getNivelExperienciaLabel(formData.nivel_experiencia)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center"><Dumbbell className="h-4 w-4 mr-1.5" /> Treinos de Força?</span>
                  <span className="font-medium text-foreground">{formatDisplay(formData.treinos_forca)}</span>
              </div>
              {/* Add fields for performance if available and needed */}
              {formData.meta_performance && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center"><Clock className="h-4 w-4 mr-1.5" /> Meta Performance</span>
                    <span className="font-medium text-foreground">{formatDisplay(formData.meta_performance)}</span>
                </div>
              )}
            </div>

             {/* Objective Section */}
             <div className="p-3 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center"><Target className="h-4 w-4 mr-1.5" /> Objetivo Principal</span>
                    <span className="font-medium text-foreground">{getTipoObjetivoLabel(formData.tipo)}</span>
                </div>
                {/* Conditionally display distance/date only if objective is Competition */}
                {formData.tipo?.toLowerCase() === 'prova' && (
                    <>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center"><Award className="h-4 w-4 mr-1.5" /> Distância Alvo</span>
                            <span className="font-medium text-foreground">{formatDisplay(formData.distancia_objetivo_km ? `${formData.distancia_objetivo_km} km` : null)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center"><Calendar className="h-4 w-4 mr-1.5" /> Data Alvo</span>
                            <span className="font-medium text-foreground">{formatDisplay(formData.data_objetivo)}</span>
                        </div>
                    </>
                )}
             </div>

             {/* Availability Section */}
             <div className="p-3 space-y-1.5">
                 <div className="flex items-center justify-between text-sm">
                     <span className="text-muted-foreground flex items-center"><CalendarDays className="h-4 w-4 mr-1.5" /> Dias Disponíveis</span>
                     <span className="font-medium text-foreground">{formatDisplay(formData.dias_semana)}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                     <span className="text-muted-foreground flex items-center"><TrendingUp className="h-4 w-4 mr-1.5" /> Dia do Treino Longo</span>
                     <span className="font-medium text-foreground">{getDiaLongoLabel(formData.dia_treino_longo)}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                     <span className="text-muted-foreground flex items-center"><Calendar className="h-4 w-4 mr-1.5" /> Início Planejado do Treino</span>
                     <span className="font-medium text-foreground">{formatDisplay(formData.data_inicio)}</span>
                 </div>
             </div>
          </CardContent>
       </Card>
     </div>
   );
}