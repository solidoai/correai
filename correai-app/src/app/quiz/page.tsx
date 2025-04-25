"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation'; 
import { supabase } from '@/lib/supabaseClient'; 
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizFormData } from "@/types";
import { QuizObjetivoForm } from "@/components/quiz/objetivo-form";
import { QuizExperienciaForm } from "@/components/quiz/experiencia-form";
import { QuizDisponibilidadeForm } from "@/components/quiz/disponibilidade-form";
import { QuizResumo } from "@/components/quiz/resumo";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingScreen from '@/components/common/LoadingScreen';
import { TEST_USER_ID } from '@/lib/config';
import { useAuth } from '@/context/AuthContext'; // <-- Adicionar useAuth

// Define todos os passos individuais do quiz
const PASSOS = [
  "objetivo_tipo",
  "experiencia_nivel", 
  "distancia_confortavel", 
  "desempenho_atual", 
  "objetivo_distancia", 
  "objetivo_performance", 
  "objetivo_data", 
  "experiencia_forca",
  "disponibilidade_dias",
  "disponibilidade_longo",
  "objetivo_data_inicio", 
  "resumo",
];

export default function QuizPage() {
  const router = useRouter(); 
  const { user } = useAuth(); // <-- Obter usuário
  // Estado para rastrear o passo atual (pergunta)
  const [passoAtual, setPassoAtual] = useState<string>(PASSOS[0]);
  // Estado para a direção da animação
  const [direcao, setDirecao] = useState<number>(1); 
  // Estado para título personalizado
  const [customTitle, setCustomTitle] = useState<React.ReactNode | null>(null);
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<Partial<QuizFormData>>({
    tipo: undefined, 
    distancia_objetivo_km: undefined,
    nivel_experiencia: undefined,
    distancia_confortavel_km: undefined, 
    treinos_forca: undefined,
    dias_semana: [],
    dia_treino_longo: undefined,
    data_objetivo: undefined, 
    meta_performance: undefined, 
    desempenho_atual: undefined, 
    data_inicio: undefined, 
  });
  // Estado para controlar o carregamento
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Função para obter o próximo passo com base no passo atual e tipo de objetivo
  const obterProximoPasso = (passoAtual: string): string => {
    if (passoAtual === "objetivo_tipo") return "experiencia_nivel";
    if (passoAtual === "experiencia_nivel") return "distancia_confortavel";
    if (passoAtual === "distancia_confortavel") return "desempenho_atual";
    if (passoAtual === "desempenho_atual") return "objetivo_distancia";
    if (passoAtual === "objetivo_distancia") {
      if (formData.tipo === "prova") {
        return "objetivo_data";
      } else {
        return "objetivo_performance";
      }
    }
    
    if (formData.tipo === "prova") {
      if (passoAtual === "objetivo_data") return "objetivo_performance";
      if (passoAtual === "objetivo_performance") return "experiencia_forca";
      if (passoAtual === "experiencia_forca") return "disponibilidade_dias";
      if (passoAtual === "disponibilidade_dias") return "disponibilidade_longo";
      if (passoAtual === "disponibilidade_longo") return "objetivo_data_inicio"; 
      if (passoAtual === "objetivo_data_inicio") return "resumo"; 
    } 
    else {
      if (passoAtual === "objetivo_performance") return "objetivo_data"; 
      if (passoAtual === "objetivo_data") return "experiencia_forca";
      if (passoAtual === "experiencia_forca") return "disponibilidade_dias";
      if (passoAtual === "disponibilidade_dias") return "disponibilidade_longo";
      if (passoAtual === "disponibilidade_longo") return "objetivo_data_inicio"; 
      if (passoAtual === "objetivo_data_inicio") return "resumo"; 
    }
    
    return "resumo"; 
  };

  // Função para avançar para o próximo passo válido
  const avancarPasso = () => {
    const proximoPasso = obterProximoPasso(passoAtual);
    setDirecao(1);
    setPassoAtual(proximoPasso);
  };

  // Nova função para avançar pulando a etapa de desempenho_atual
  const avancarPulandoDesempenho = () => {
    const proximoPassoLogico = obterProximoPasso("desempenho_atual"); 
    setDirecao(1); 
    setPassoAtual(proximoPassoLogico);
  };

  // Função para voltar para o passo válido anterior
  const voltarPasso = () => {
    const passosValidos = PASSOS.filter((passo) => {
      return true;
    });
    const passoAtualIndex = passosValidos.indexOf(passoAtual);
    if (passoAtualIndex > 0) {
      setDirecao(-1);
      setPassoAtual(passosValidos[passoAtualIndex - 1]);
    }
  };

  // Função para atualizar os dados do formulário
  const atualizarFormData = (data: Partial<QuizFormData>) => {
    console.log("QuizPage: Atualizando formData com:", data);
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Função para enviar o formulário (simulado)
  const finalizarQuiz = async () => {
    // Validação básica para garantir que dados essenciais foram preenchidos
    if (!formData.tipo || !formData.nivel_experiencia) {
      console.error("Erro: Tentativa de finalizar o quiz com dados essenciais ausentes.", formData);
      alert("Por favor, preencha todas as informações obrigatórias antes de finalizar.");
      return;
    }

    setIsSubmitting(true);

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('URL do Webhook N8N não definida em .env.local');
      alert('Erro de configuração. Não é possível finalizar o quiz.');
      setIsSubmitting(false);
      return;
    }

    if (user) {
      // --- Usuário LOGADO --- 
      try {
        console.log("Usuário logado detectado. Tentando excluir objetivo antigo...");
        // 1. (Opcional mas recomendado) Excluir objetivo antigo
        const { error: deleteError } = await supabase
          .from('objetivos')
          .delete()
          .eq('usuario_id', user.id);

        if (deleteError) {
          // Não bloqueia o processo se a exclusão falhar (pode não existir objetivo)
          console.warn("Aviso ao excluir objetivo antigo (pode não existir):", deleteError.message);
        }

        console.log("Preparando para enviar novo webhook para usuário logado...");
        // 2. Enviar webhook com novos dados + usuario_id
        const payload = { 
          ...formData, 
          usuario_id: user.id,
          desempenho_atual: `Corre ${formData.distancia_confortavel_km}km confortavelmente. Completa ${formData.distancia_objetivo_km}km em ${formData.desempenho_atual}.`,
        };

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Erro no webhook: ${response.statusText}`);
        }

        console.log('Webhook enviado com sucesso para usuário logado!');
        alert('Novo plano solicitado com sucesso!'); // Melhorar feedback
        // 3. Redirecionar para o dashboard
        router.push('/dashboard');

      } catch (error) {
        console.error('Erro detalhado ao processar quiz para usuário logado:', error instanceof Error ? error.message : error);
        alert('Ocorreu um erro ao solicitar seu novo plano. Tente novamente.');
      } finally {
        setIsSubmitting(false);
      }

    } else {
      // --- Usuário NÃO LOGADO --- (Lógica original mantida)
      try {
        console.log("Usuário não logado. Salvando dados no localStorage e redirecionando para /auth?mode=signup...");
        // Salvar no localStorage para enviar após login/cadastro
        localStorage.setItem('quizDataPendente', JSON.stringify(formData));
        // Redirecionar para a página de autenticação com o modo correto
        router.push('/auth?mode=signup');
      } catch (error) {
         console.error('Erro ao salvar dados no localStorage:', error);
         alert('Ocorreu um erro inesperado. Tente novamente.');
         setIsSubmitting(false);
      }
      // Não definimos setIsSubmitting(false) aqui porque a página vai redirecionar
    }
  };

  // Função para obter o título do passo atual
  const getTituloPasso = () => {
    switch (passoAtual) {
      case "objetivo_tipo": return "Qual seu objetivo principal?";
      case "experiencia_nivel": return "Seu nível de experiência?";
      case "distancia_confortavel": return "Quantos km você consegue correr hoje confortavelmente?";
      case "desempenho_atual": return ""; 
      case "objetivo_distancia": 
        return formData.tipo === "prova" 
          ? "Qual a distância da prova?" 
          : "Qual distância você quer treinar para ser capaz de fazer?";
      case "objetivo_performance": 
        return formData.tipo === "prova" 
          ? `Qual sua meta para a prova de ${formData.distancia_objetivo_km?.toLocaleString('pt-BR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
          }).replace('.', ',')}km?` 
          : `Qual seu objetivo ao correr ${formData.distancia_objetivo_km?.toLocaleString('pt-BR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
          }).replace('.', ',')}km?`;
      case "objetivo_data": 
        return formData.tipo === "prova" 
          ? `Para quando é a prova de ${formData.distancia_objetivo_km?.toLocaleString('pt-BR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
          }).replace('.', ',')}km?` 
          : "Até quando quer atingir esse objetivo?";
      case "experiencia_forca": return "Faz treinos de força?";
      case "disponibilidade_dias": return "Quais dias da semana você tem disponíveis para treinar?";
      case "disponibilidade_longo": return "Prefere fazer seu treino mais longo no Sábado ou Domingo?";
      case "objetivo_data_inicio": return "Selecione a data em que planeja iniciar seus treinos.";
      case "resumo": return "Confirme suas respostas antes de prosseguir.";
      default: return "";
    }
  };

  // Função para obter a descrição do passo atual
  const getDescricaoPasso = () => {
    switch (passoAtual) {
      case "objetivo_tipo": return "Escolha o que mais te motiva.";
      case "experiencia_nivel": return "Como você se classifica na corrida?";
      case "distancia_confortavel": return "Considere uma corrida tranquila, sem muito esforço.";
      case "objetivo_distancia": 
        return formData.tipo === "prova"
          ? "Informe a distância em km (ex: 5, 10, 21, 42)."
          : "Escolha a distância que deseja alcançar em km.";
      case "desempenho_atual": 
        return "Quanto tempo você leva para completar esta distância atualmente?";
      case "objetivo_performance": 
        return formData.tipo === "prova"
          ? "Ex: Correr abaixo de 2h, completar bem..." 
          : "Ex: Melhorar condicionamento, perder peso...";
      case "objetivo_data": 
        return formData.tipo === "prova"
          ? "Selecione a data da sua prova."
          : "Defina uma data para atingir seu objetivo.";
      case "experiencia_forca": return "Isso ajuda a complementar seu treino.";
      case "disponibilidade_dias": return "Selecione os dias disponíveis.";
      case "disponibilidade_longo": return "O famoso 'longão' da semana.";
      case "objetivo_data_inicio": return "Defina a data de início dos treinos.";
      case "resumo": return "Revise tudo antes de finalizar.";
      default: return "";
    }
  };

  // Função para renderizar o componente de formulário correto para o passo atual
  const renderPasso = () => {
    switch (passoAtual) {
      case "objetivo_tipo":
      case "objetivo_distancia":
      case "objetivo_data":
      case "objetivo_performance":
      case "desempenho_atual":
      case "distancia_confortavel":
      case "objetivo_data_inicio":
        return (
          <QuizObjetivoForm
            formData={formData}
            onUpdateFormData={atualizarFormData}
            perguntaAtual={passoAtual as any} 
            setCustomTitle={setCustomTitle}
            onAvancarSolicitado={passoAtual === 'distancia_confortavel' ? avancarPulandoDesempenho : avancarPasso}
          />
        );
      case "experiencia_nivel":
      case "experiencia_forca":
        return (
          <QuizExperienciaForm
            formData={formData}
            onUpdateFormData={atualizarFormData}
            perguntaAtual={passoAtual} 
          />
        );
      case "disponibilidade_dias":
      case "disponibilidade_longo":
        return (
          <QuizDisponibilidadeForm
            formData={formData}
            onUpdateFormData={atualizarFormData}
            perguntaAtual={passoAtual} 
          />
        );
      case "resumo":
        return <QuizResumo formData={formData as QuizFormData} dadosUsuario={{ id: TEST_USER_ID }} />;
      default:
        return null;
    }
  };

  // Função para verificar se o passo atual tem uma resposta válida
  const isPassoValido = (passo: string, data: Partial<QuizFormData>): boolean => {
    switch (passo) {
      case "objetivo_tipo":
        return data.tipo !== undefined;
      case "experiencia_nivel":
        return data.nivel_experiencia !== undefined;
      case "distancia_confortavel":
        return data.distancia_confortavel_km !== undefined && data.distancia_confortavel_km > 0;
      case "desempenho_atual":
        if (data.nivel_experiencia === "iniciante") {
          return true;
        }
        return data.distancia_confortavel_km !== undefined && data.desempenho_atual !== undefined;
      case "objetivo_distancia":
        return data.distancia_objetivo_km !== undefined;
      case "objetivo_data":
        return data.data_objetivo !== undefined;
      case "objetivo_performance":
        return data.meta_performance !== undefined && data.meta_performance.trim() !== "";
      case "experiencia_forca":
        return data.treinos_forca !== undefined;
      case "disponibilidade_dias":
        return data.dias_semana !== undefined && data.dias_semana.length > 0;
      case "disponibilidade_longo":
        return data.dia_treino_longo !== undefined;
      case "objetivo_data_inicio":
        return data.data_inicio !== undefined;
      case "resumo":
        return true; 
      default:
        return false;
    }
  };

  // Verifica se o passo atual é válido
  const passoAtualValido = isPassoValido(passoAtual, formData);

  // Definições das variantes de animação
  const variants = {
    enter: () => ({
      opacity: 0
    }),
    center: {
      opacity: 1
    },
    exit: () => ({
      opacity: 0
    })
  };

  const passosValidos = PASSOS.filter((passo) => {
    return true;
  }); 

  const handleCompleteQuiz = () => {
    // Aqui, futuramente, salvaremos as respostas do quiz
    console.log('Quiz concluído, redirecionando para autenticação (modo signup)...');
    // TODO: Salvar dados do quiz (local storage? state management?)
    router.push('/auth?mode=signup'); // Redireciona para cadastro
  };

  return (
    <>
      {isLoading && <LoadingScreen />} 
      <main className="min-h-screen bg-gradient-to-br from-background to-background/90 p-3 pt-4 md:pt-8 md:p-5 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card shadow-xl rounded-xl overflow-hidden">
            <div className="w-full px-3 md:px-4 pt-3 md:pt-4 pb-2 border-b">
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${Math.round(((passosValidos.indexOf(passoAtual) + 1) / passosValidos.length) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="px-3 md:px-4 py-3 md:py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={passoAtual} 
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="space-y-3">
                    <div className="text-center space-y-1">
                      <h2 className="text-xl font-semibold text-foreground">
                        {customTitle || getTituloPasso()}
                      </h2>
                    </div>
                    
                    {renderPasso()}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-t px-3 md:px-4 py-3 bg-secondary/30">
              <Button
                variant="outline"
                onClick={voltarPasso}
                disabled={passoAtual === passosValidos[0]}
                className="w-full sm:w-[48%]"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              
              {passoAtual !== passosValidos[passosValidos.length - 1] ? (
                <Button 
                  onClick={avancarPasso} 
                  className="w-full sm:w-[48%] bg-primary hover:bg-primary/90"
                  disabled={!passoAtualValido} 
                >
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  onClick={finalizarQuiz} 
                  className="w-full sm:w-[48%] bg-accent hover:bg-accent/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Finalizando...' : 'Concluir Questionário'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-8">Quiz CorreAí</h1>
        <div className="w-full max-w-md p-8 bg-card rounded-lg border shadow-sm space-y-6">
          <p className="text-center text-muted-foreground">
            Responda algumas perguntas para montarmos seu plano ideal.
          </p>
          {/* Placeholder para as perguntas do quiz */}
          <div className="h-40 bg-muted rounded-md flex items-center justify-center">
            <p className="text-sm text-muted-foreground">(Perguntas do Quiz aqui)</p>
          </div>

          <Button onClick={handleCompleteQuiz} className="w-full">
            Concluir Quiz e Criar Conta
          </Button>
        </div>
      </div>
    </>
  );
}
