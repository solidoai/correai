"use client";

import { useState } from "react";
import { QuizFormData, DiaSemana } from "@/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DisponibilidadePasso = "disponibilidade_dias" | "disponibilidade_longo";

interface QuizDisponibilidadeFormProps {
  formData: Partial<QuizFormData>;
  onUpdateFormData: (data: Partial<QuizFormData>) => void;
  perguntaAtual: DisponibilidadePasso;
}

const diasSemana: { value: DiaSemana; label: string; abrev: string }[] = [
  { value: "seg", label: "Segunda", abrev: "S" },
  { value: "ter", label: "Terça", abrev: "T" },
  { value: "qua", label: "Quarta", abrev: "Q" },
  { value: "qui", label: "Quinta", abrev: "Q" },
  { value: "sex", label: "Sexta", abrev: "S" },
  { value: "sab", label: "Sábado", abrev: "S" },
  { value: "dom", label: "Domingo", abrev: "D" },
];

export function QuizDisponibilidadeForm({
  formData,
  onUpdateFormData,
  perguntaAtual,
}: QuizDisponibilidadeFormProps) {
  const handleDiasChange = (dia: DiaSemana) => {
    if ((formData.dias_semana || []).includes(dia)) {
      onUpdateFormData({
        dias_semana: (formData.dias_semana || []).filter((d) => d !== dia),
      });
    } else {
      onUpdateFormData({
        dias_semana: [...(formData.dias_semana || []), dia],
      });
    }
  };

  const handleDiaTreinoLongoChange = (dia: DiaSemana) => {
    onUpdateFormData({ dia_treino_longo: dia });
  };

  // Função para obter o número de dias selecionados
  const getDiasSelecionadosCount = () => {
    return (formData.dias_semana || []).length;
  };

  return (
    <div className="space-y-6 w-full">
      {perguntaAtual === "disponibilidade_dias" && (
        <div className="animate-fade-in">
          <div className="text-center mb-6">
            <Label className="text-base font-semibold block mb-2">
              Em quais dias da semana você pode treinar?
            </Label>
            <p className="text-sm text-muted-foreground">
              Selecione todos os dias disponíveis
            </p>
          </div>
          
          <div className="grid grid-cols-7 gap-3 mb-4">
            {diasSemana.map((dia) => {
              const isSelected = (formData.dias_semana || []).includes(dia.value);
              return (
                <div
                  key={dia.value}
                  className={cn(
                    "flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
                    "aspect-square rounded-full",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-secondary/30 hover:bg-primary/10 text-foreground hover:text-primary border border-border"
                  )}
                  onClick={() => handleDiasChange(dia.value)}
                >
                  <div className="h-12 w-12 flex items-center justify-center">
                    <span className="text-lg font-bold">{dia.abrev}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {getDiasSelecionadosCount() > 3 ? (
            <div className="bg-red-50 p-3 rounded-lg text-center mb-3 border border-red-200">
              <p className="text-sm text-red-600 font-medium">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 inline-block mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
                Não recomendamos mais que 3 dias de treino, os descansos são primordiais para sua evolução
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-sm text-primary">
                {getDiasSelecionadosCount() === 0 
                  ? "Selecione pelo menos um dia para treinar" 
                  : `Você selecionou ${getDiasSelecionadosCount()} ${getDiasSelecionadosCount() === 1 ? 'dia' : 'dias'} para treinar`}
              </p>
            </div>
          )}
        </div>
      )}

      {perguntaAtual === "disponibilidade_longo" && (
        <div className="animate-fade-in">
          <div className="text-center mb-6">
            <Label className="text-base font-semibold block mb-2">
              Qual o melhor dia para seu treino longo?
            </Label>
            <p className="text-sm text-muted-foreground">
              Este é o treino mais importante da semana
            </p>
          </div>
          
          {(formData.dias_semana || []).length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200 max-w-md mx-auto">
              <p className="text-sm text-yellow-700 font-medium">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 inline-block mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                Você precisa selecionar pelo menos um dia disponível na etapa anterior
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
              {diasSemana
                .filter(dia => (formData.dias_semana || []).includes(dia.value))
                .map((dia) => {
                  const isSelected = formData.dia_treino_longo === dia.value;
                  return (
                    <div
                      key={`longo-${dia.value}`}
                      className={cn(
                        "p-4 rounded-xl transition-all cursor-pointer flex items-center",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "bg-secondary/30 hover:bg-primary/10 text-foreground hover:text-primary border border-border"
                      )}
                      onClick={() => handleDiaTreinoLongoChange(dia.value)}
                    >
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center mr-3",
                        isSelected ? "bg-primary-foreground text-primary" : "bg-primary/10 text-primary"
                      )}>
                        <span className="text-sm font-bold">{dia.abrev}</span>
                      </div>
                      <span className="font-medium flex-1">{dia.label}</span>
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-2"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
          
          {(formData.dias_semana || []).length > 0 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Escolha um dos dias que você selecionou anteriormente
            </p>
          )}
        </div>
      )}
    </div>
  );
}
