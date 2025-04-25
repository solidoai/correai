"use client";

import { useState, useEffect } from "react";
import { QuizFormData, TipoObjetivo } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

// Define os possíveis passos que este formulário pode renderizar
type ObjetivoPasso = "objetivo_tipo" | "objetivo_distancia" | "objetivo_data" | "objetivo_data_inicio" | "objetivo_performance" | "desempenho_atual" | "distancia_confortavel";

interface QuizObjetivoFormProps {
  formData: Partial<QuizFormData>;
  onUpdateFormData: (data: Partial<QuizFormData>) => void;
  perguntaAtual: ObjetivoPasso; // Adiciona a nova prop
  setCustomTitle?: (title: React.ReactNode) => void; // Função para definir o título personalizado
  onAvancarSolicitado?: () => void; // Nova prop para solicitar avanço
}

export function QuizObjetivoForm({
  formData,
  onUpdateFormData,
  perguntaAtual, // Recebe a prop
  setCustomTitle,
  onAvancarSolicitado, // Recebe a nova prop
}: QuizObjetivoFormProps) {
  
  // Estado para controlar o mês atual exibido no calendário
  // Mantemos este estado local, pois controla apenas a UI do calendário
  const [mesAtual, setMesAtual] = useState<Date>(
    formData.data_objetivo ? new Date(formData.data_objetivo) : new Date()
  );
  // Novo estado para controlar o mês atual exibido no calendário de data_inicio
  const [mesInicioAtual, setMesInicioAtual] = useState<Date>(
    formData.data_inicio ? new Date(formData.data_inicio) : new Date()
  );
  
  // Estado para controlar a exibição do campo de entrada personalizado
  const [mostrarCampoOutro, setMostrarCampoOutro] = useState<boolean>(false);
  // Estado para o valor personalizado
  const [valorPersonalizado, setValorPersonalizado] = useState<string>("");

  // Distâncias padrão (para snap points)
  const distanciasPadroes = [3, 5, 10, 15, 21.1, 42.2];

  // Estado para controlar a exibição do campo personalizado de distância
  const [distanciaInput, setDistanciaInput] = useState<string>(
    formData.distancia_objetivo_km !== undefined 
      ? String(formData.distancia_objetivo_km) 
      : ""
  );

  // Adicionando uma flag para controlar a fonte da atualização
  const [atualizadoPorBotao, setAtualizadoPorBotao] = useState<boolean>(false);

  // Estado para controlar a exibição do campo personalizado de distância confortável
  const [mostrarDistanciaConfortavelPersonalizada, setMostrarDistanciaConfortavelPersonalizada] = useState(false);

  // Novo estado local para o valor do campo de entrada de distância confortável personalizada
  const [distanciaConfortavelInput, setDistanciaConfortavelInput] = useState<string>(
    formData.distancia_confortavel_km !== undefined ? String(formData.distancia_confortavel_km) : ""
  );

  // Inicializa a distância com um valor padrão se não estiver definido
  useEffect(() => {
    if (formData.distancia_objetivo_km === undefined && perguntaAtual === "objetivo_distancia") {
      onUpdateFormData({ distancia_objetivo_km: 5 }); // Valor padrão de 5km
    }
    
    // Inicializa a distância confortável com 0 se não estiver definida
    if (formData.distancia_confortavel_km === undefined && perguntaAtual === "distancia_confortavel") {
      onUpdateFormData({ distancia_confortavel_km: 0 }); // Valor inicial de 0km
    }
  }, [formData.distancia_objetivo_km, formData.distancia_confortavel_km, perguntaAtual, onUpdateFormData]);

  // Reativando useEffect para sincronizar distanciaInput com formData
  useEffect(() => {
    // Só atualiza o input se a mudança vier de um botão
    if (atualizadoPorBotao && formData.distancia_objetivo_km !== undefined) {
      // Formata o valor para exibição com vírgula como separador decimal
      setDistanciaInput(
        formData.distancia_objetivo_km.toLocaleString('pt-BR', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }).replace('.', ',')
      );
      // Reseta a flag após a atualização
      setAtualizadoPorBotao(false);
    } else if (formData.distancia_objetivo_km === undefined && atualizadoPorBotao) {
      setDistanciaInput("");
      setAtualizadoPorBotao(false);
    }
  }, [formData.distancia_objetivo_km, atualizadoPorBotao]); 

  // Efeito para definir o título personalizado quando o passo for "desempenho_atual"
  useEffect(() => {
    if (perguntaAtual === "desempenho_atual" && setCustomTitle && formData.distancia_confortavel_km) {
      setCustomTitle(
        <>
          Em quanto tempo você completa{' '}
          <span className="text-primary">
            {formData.distancia_confortavel_km.toLocaleString('pt-BR', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1
            }).replace('.', ',')} km
          </span>?
        </>
      );
    } else if (setCustomTitle && perguntaAtual !== "desempenho_atual") {
      // Limpar o título personalizado quando o passo não for "desempenho_atual"
      setCustomTitle(null);
    }
  }, [perguntaAtual, formData.distancia_confortavel_km, setCustomTitle]);

  const handleTipoChange = (value: TipoObjetivo) => {
    onUpdateFormData({ tipo: value });
  };

  const handleDistanciaChange = (values: number[]) => {
    const value = values[0];
    onUpdateFormData({ distancia_objetivo_km: value });
  };

  const handleMetaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateFormData({ meta_performance: event.target.value });
  };

  // Nova função para lidar com a mudança de mês
  const handleMesChange = (month: Date) => {
    setMesAtual(month);
  };

  // Funções auxiliares para lidar com tempo
  const getHoursFromDesempenho = (desempenhoAtual?: string): number => {
    if (!desempenhoAtual || desempenhoAtual === "Nunca completei esta distância") return 0;
    
    // Se for um formato de tempo direto como "1:30:45"
    if (desempenhoAtual.includes(':')) {
      const parts = desempenhoAtual.split(':');
      if (parts.length === 3) {
        return parseInt(parts[0]) || 0;
      } else if (parts.length === 2) {
        return 0;
      }
    }
    
    return 0;
  };
  
  const getMinsFromDesempenho = (desempenhoAtual?: string): number => {
    if (!desempenhoAtual || desempenhoAtual === "Nunca completei esta distância") return 0;
    
    // Se for um formato de tempo direto como "1:30:45"
    if (desempenhoAtual.includes(':')) {
      const parts = desempenhoAtual.split(':');
      if (parts.length === 3) {
        return parseInt(parts[1]) || 0;
      } else if (parts.length === 2) {
        return parseInt(parts[0]) || 0;
      }
    }
    
    return 0;
  };
  
  const getSecsFromDesempenho = (desempenhoAtual?: string): number => {
    if (!desempenhoAtual || desempenhoAtual === "Nunca completei esta distância") return 0;
    
    // Se for um formato de tempo direto como "1:30:45"
    if (desempenhoAtual.includes(':')) {
      const parts = desempenhoAtual.split(':');
      if (parts.length >= 2) {
        return parseInt(parts[parts.length - 1]) || 0;
      }
    }
    
    return 0;
  };
  
  const updateDesempenhoTime = (hours: number, mins: number, secs: number) => {
    // Garantir que os valores sejam números válidos
    hours = isNaN(hours) ? 0 : hours;
    mins = isNaN(mins) ? 0 : mins;
    secs = isNaN(secs) ? 0 : secs;
    
    let timeStr = '';
    
    if (hours > 0) {
      timeStr = `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    onUpdateFormData({ desempenho_atual: timeStr });
  };
  
  // Cálculo de ritmo em min/km
  const calculatePace = (time: string, distance: number): string => {
    if (!time || time === "Nunca completei esta distância" || !distance) return "-";
    
    let totalSeconds = 0;
    const parts = time.split(':');
    
    if (parts.length === 3) {
      totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    } else if (parts.length === 2) {
      totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else {
      return "-";
    }
    
    const paceSeconds = Math.round(totalSeconds / distance);
    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceRemainingSeconds = paceSeconds % 60;
    
    return `${paceMinutes}:${paceRemainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Gerar ritmos sugeridos baseados na distância
  const getRitmosSugeridos = (distance?: number): string[] => {
    if (!distance) return [];
    
    if (distance <= 5) {
      return ["4:00", "5:00", "6:00", "7:00", "8:00"];
    } else if (distance <= 10) {
      return ["5:00", "6:00", "7:00", "8:00", "9:00"];
    } else if (distance <= 21.1) {
      return ["5:30", "6:30", "7:30", "8:30", "9:30"];
    } else {
      return ["6:00", "7:00", "8:00", "9:00", "10:00"];
    }
  };
  
  // Calcular tempo total baseado no ritmo e distância
  const calcularTempoTotalByRitmo = (ritmo: string, distancia: number): string => {
    const [mins, secs] = ritmo.split(':').map(num => parseInt(num));
    const totalSeconds = (mins * 60 + secs) * distancia;
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div className="w-full"> 
      {/* Pergunta: Tipo de Objetivo */}
      {perguntaAtual === "objetivo_tipo" && (
        <div className="grid grid-cols-1 gap-2"> 
          <div 
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
              formData.tipo === "prova" 
                ? "border-primary bg-primary/5" 
                : "border-muted hover:border-primary/50"
            }`}
            onClick={() => handleTipoChange("prova")}
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                  <path d="m9 16 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-base">
                  Preparar para uma prova
                </h3>
                <p className="text-xs text-muted-foreground">
                  Quero me preparar para uma corrida específica
                </p>
              </div>
            </div>
          </div>

          <div 
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
              formData.tipo === "pessoal" 
                ? "border-primary bg-primary/5" 
                : "border-muted hover:border-primary/50"
            }`}
            onClick={() => handleTipoChange("pessoal")}
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
                  <path d="M12 11.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z"></path>
                  <path d="M12 11.5V21"></path>
                  <path d="M9 21h6"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-base">
                  Objetivo pessoal
                </h3>
                <p className="text-xs text-muted-foreground">
                  Quero melhorar minha performance
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pergunta: Distância do Objetivo */}
      {perguntaAtual === "objetivo_distancia" && (
        <div className="animate-fade-in">
          <div className="space-y-5 w-full">
            {/* Valor em destaque - REMOVIDO mostrador não editável */}
            
            <p className="text-center text-muted-foreground mb-2">Selecione ou digite sua distância:</p>
            
            {/* Mostrador editável único com estilo de destaque */}
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 px-5 py-4 rounded-2xl shadow-sm w-full max-w-[200px] text-center relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={distanciaInput}
                  onChange={(e) => {
                    const rawValue = e.target.value; 
                    setDistanciaInput(rawValue);

                    let sanitizedValue = rawValue.replace(/[^0-9.,]/g, '').replace(',', '.');
                    const parts = sanitizedValue.split('.');
                    if (parts.length > 2) {
                      sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
                    }

                    const numericValue = parseFloat(sanitizedValue);
                    
                    if (!isNaN(numericValue)) {
                      onUpdateFormData({ distancia_objetivo_km: numericValue });
                    } else {
                      onUpdateFormData({ distancia_objetivo_km: undefined });
                    }
                  }}
                  className="text-3xl font-bold text-primary bg-transparent border-none text-center focus:outline-none focus:ring-0 w-20"
                  placeholder="0,0"
                />
                <span className="text-xl text-primary">km</span>
              </div>
            </div>
            
            {/* Botões de distância rápida */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {distanciasPadroes.map((dist) => (
                <Button
                  key={dist}
                  variant={formData.distancia_objetivo_km === dist ? "default" : "outline"}
                  className={`text-sm h-10 rounded-xl ${formData.distancia_objetivo_km === dist ? 'bg-primary text-primary-foreground' : 'border-primary text-primary hover:bg-primary/10'}`}
                  onClick={() => {
                    // Define a flag antes de atualizar o formData
                    setAtualizadoPorBotao(true);
                    onUpdateFormData({ distancia_objetivo_km: dist });
                  }}
                >
                  {dist} km
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pergunta: Data do Objetivo */}
      {perguntaAtual === "objetivo_data" && (
        <div className="space-y-4 animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="border rounded-xl overflow-hidden">
              {/* Cabeçalho do calendário */}
              <div className="flex items-center justify-between bg-primary/10 px-3 py-2 border-b">
                <h4 className="font-medium text-base text-primary">
                  {format(mesAtual, 'MMMM yyyy', { locale: ptBR })}
                </h4>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-white rounded-full border"
                    onClick={() => handleMesChange(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-white rounded-full border"
                    onClick={() => handleMesChange(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Calendário */}
              <div className="p-3 bg-white">
                <Calendar
                  mode="single"
                  // Passa a data do formData diretamente, convertendo para Date se necessário
                  selected={formData.data_objetivo ? new Date(formData.data_objetivo) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      // Criar uma nova instância de Date
                      const novaData = new Date(date);
                      console.log("Data selecionada (Calendar onSelect):", novaData);
                      
                      // Atualizar APENAS o formData global
                      onUpdateFormData({ 
                        data_objetivo: novaData 
                      });
                      
                      // Atualizar o mês exibido localmente
                      setMesAtual(novaData);
                    }
                  }}
                  month={mesAtual}
                  onMonthChange={handleMesChange}
                  locale={ptBR}
                  disabled={{ before: new Date() }}
                  className="rounded-md border-0"
                  classNames={{
                    caption_label: "hidden", // Esconde o label padrão do mês
                    caption_dropdowns: "hidden", // Esconde os dropdowns
                    nav: "hidden", // Esconde a navegação padrão
                    nav_button: cn(
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      "flex items-center justify-center text-primary"
                    ),
                    nav_button_previous: "ml-1", 
                    nav_button_next: "mr-1",
                    table: "w-full border-collapse",
                    head_row: "border-b border-border/50", 
                    head_cell: "text-muted-foreground font-medium text-[0.8rem] py-2 text-center uppercase tracking-wider",
                    row: "h-10", // Altura fixa para as linhas
                    cell: "p-0 text-center relative",
                    day: cn(
                      "h-10 w-10 p-0 mx-auto text-center font-medium text-foreground", 
                      "hover:bg-primary/10 hover:text-primary transition-colors duration-200",
                      "rounded-full"
                    ),
                    day_selected: "bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:text-primary-foreground border-2 border-primary/40 shadow-md transform scale-110",
                    day_today: "bg-primary/10 text-primary border border-primary/20",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                    day_range_middle: "bg-primary/10",
                    day_range_end: "bg-primary text-primary-foreground",
                    day_range_start: "bg-primary text-primary-foreground",
                  }}
                />
              </div>
              
              {/* Rodapé com confirmação da data selecionada */}
              <div className="px-4 py-3 bg-secondary/30 text-xs text-muted-foreground text-center border-t">
                {formData.data_objetivo ? (
                  <div className="flex flex-col items-center">
                    <p className="text-primary font-medium mb-1">
                      Data selecionada:
                    </p>
                    <p className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {format(new Date(formData.data_objetivo), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                ) : (
                  <p>Selecione a data para atingir seu objetivo</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pergunta: Data de Início */}
      {perguntaAtual === "objetivo_data_inicio" && (
        <div className="space-y-4 animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="border rounded-xl overflow-hidden">
              {/* Cabeçalho do calendário */}
              <div className="flex items-center justify-between bg-primary/10 px-3 py-2 border-b">
                <h4 className="font-medium text-base text-primary">
                  {format(mesInicioAtual, 'MMMM yyyy', { locale: ptBR })}
                </h4>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-white rounded-full border"
                    onClick={() => setMesInicioAtual(new Date(mesInicioAtual.getFullYear(), mesInicioAtual.getMonth() - 1, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 bg-white rounded-full border"
                    onClick={() => setMesInicioAtual(new Date(mesInicioAtual.getFullYear(), mesInicioAtual.getMonth() + 1, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Calendário */}
              <div className="p-3 bg-white">
                <Calendar
                  mode="single"
                  // Passa a data do formData diretamente, convertendo para Date se necessário
                  selected={formData.data_inicio ? new Date(formData.data_inicio) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      // Criar uma nova instância de Date
                      const novaData = new Date(date);
                      console.log("Data de início selecionada (Calendar onSelect):", novaData);
                      
                      // Atualizar APENAS o formData global
                      onUpdateFormData({ 
                        data_inicio: novaData 
                      });
                      
                      // Atualizar o mês exibido localmente
                      setMesInicioAtual(novaData);
                    }
                  }}
                  month={mesInicioAtual}
                  onMonthChange={setMesInicioAtual}
                  locale={ptBR}
                  disabled={{ before: new Date() }}
                  className="rounded-md border-0"
                  classNames={{
                    caption_label: "hidden", // Esconde o label padrão do mês
                    caption_dropdowns: "hidden", // Esconde os dropdowns
                    nav: "hidden", // Esconde a navegação padrão
                    nav_button: cn(
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      "flex items-center justify-center text-primary"
                    ),
                    nav_button_previous: "ml-1", 
                    nav_button_next: "mr-1",
                    table: "w-full border-collapse",
                    head_row: "border-b border-border/50", 
                    head_cell: "text-muted-foreground font-medium text-[0.8rem] py-2 text-center uppercase tracking-wider",
                    row: "h-10", // Altura fixa para as linhas
                    cell: "p-0 text-center relative",
                    day: cn(
                      "h-10 w-10 p-0 mx-auto text-center font-medium text-foreground", 
                      "hover:bg-primary/10 hover:text-primary transition-colors duration-200",
                      "rounded-full"
                    ),
                    day_selected: "bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:text-primary-foreground border-2 border-primary/40 shadow-md transform scale-110",
                    day_today: "bg-primary/10 text-primary border border-primary/20",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                    day_range_middle: "bg-primary/10",
                    day_range_end: "bg-primary text-primary-foreground",
                    day_range_start: "bg-primary text-primary-foreground",
                  }}
                />
              </div>
              
              {/* Rodapé com confirmação da data selecionada */}
              <div className="px-4 py-3 bg-secondary/30 text-xs text-muted-foreground text-center border-t">
                {formData.data_inicio ? (
                  <div className="flex flex-col items-center">
                    <p className="text-primary font-medium mb-1">
                      Data de início selecionada:
                    </p>
                    <p className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {format(new Date(formData.data_inicio), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                ) : (
                  <p>Selecione a data de início para começar a treinar</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pergunta: Meta de Performance */}
      {perguntaAtual === "objetivo_performance" && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-4 max-w-md mx-auto">
            {/* Botões para metas pré-definidas */}
            <div className="grid grid-cols-1 gap-3">
              {formData.tipo === "prova" ? (
                <>
                  <Button
                    type="button"
                    variant={formData.meta_performance === "Melhorar meu tempo" ? "default" : "outline"}
                    className={cn(
                      "py-3 rounded-xl text-base font-semibold transition-all",
                      formData.meta_performance === "Melhorar meu tempo"
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-secondary/30 hover:bg-primary/10 text-foreground hover:text-primary border-border"
                    )}
                    onClick={() => {
                      onUpdateFormData({ meta_performance: "Melhorar meu tempo" });
                      setMostrarCampoOutro(false); // Fecha o campo personalizado
                    }}
                  >
                    Melhorar meu tempo
                  </Button>
                  
                  <Button
                    type="button"
                    variant={formData.meta_performance === "Apenas completar a prova bem" ? "default" : "outline"}
                    className={cn(
                      "py-3 rounded-xl text-base font-semibold transition-all",
                      formData.meta_performance === "Apenas completar a prova bem"
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-secondary/30 hover:bg-primary/10 text-foreground hover:text-primary border-border"
                    )}
                    onClick={() => {
                      onUpdateFormData({ meta_performance: "Apenas completar a prova bem" });
                      setMostrarCampoOutro(false); // Fecha o campo personalizado
                    }}
                  >
                    Apenas completar a prova bem
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant={formData.meta_performance === "Melhorar minha performance" ? "default" : "outline"}
                    className={cn(
                      "py-3 rounded-xl text-base font-semibold transition-all",
                      formData.meta_performance === "Melhorar minha performance"
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-secondary/30 hover:bg-primary/10 text-foreground hover:text-primary border-border"
                    )}
                    onClick={() => {
                      onUpdateFormData({ meta_performance: "Melhorar minha performance" });
                      setMostrarCampoOutro(false); // Fecha o campo personalizado
                    }}
                  >
                    Melhorar minha performance
                  </Button>
                  
                  <Button
                    type="button"
                    variant={formData.meta_performance === "Ter mais qualidade de vida" ? "default" : "outline"}
                    className={cn(
                      "py-3 rounded-xl text-base font-semibold transition-all",
                      formData.meta_performance === "Ter mais qualidade de vida"
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-secondary/30 hover:bg-primary/10 text-foreground hover:text-primary border-border"
                    )}
                    onClick={() => {
                      onUpdateFormData({ meta_performance: "Ter mais qualidade de vida" });
                      setMostrarCampoOutro(false); // Fecha o campo personalizado
                    }}
                  >
                    Ter mais qualidade de vida
                  </Button>
                </>
              )}
              
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "py-3 rounded-xl text-base font-semibold transition-all",
                  mostrarCampoOutro 
                    ? "bg-primary/10 border-primary/40 text-primary" 
                    : "bg-secondary/30 hover:bg-primary/10 text-foreground hover:text-primary border-border"
                )}
                onClick={() => {
                  setMostrarCampoOutro(!mostrarCampoOutro);
                  if (!mostrarCampoOutro) {
                    // Limpar o valor anterior se estiver fechando o campo
                    onUpdateFormData({ meta_performance: "" });
                  }
                }}
              >
                Personalizar meu objetivo
              </Button>
            </div>
            
            {/* Campo de entrada personalizado */}
            {mostrarCampoOutro && (
              <div className="bg-primary/5 p-3 rounded-lg max-w-md mx-auto">
                <Textarea
                  id="meta"
                  placeholder={`Ex: ${formData.tipo === "prova" 
                    ? `Completar os ${formData.distancia_objetivo_km?.toFixed(1)}km em menos de ${
                      formData.distancia_objetivo_km && formData.distancia_objetivo_km <= 5 
                        ? "30 minutos" 
                        : formData.distancia_objetivo_km && formData.distancia_objetivo_km <= 10 
                          ? "1 hora" 
                          : formData.distancia_objetivo_km && formData.distancia_objetivo_km <= 21 
                            ? "2 horas" 
                            : "4 horas"
                    }`
                    : `Conseguir correr ${formData.distancia_objetivo_km?.toFixed(1)}km sem parar` 
                  }`}
                  value={typeof formData.meta_performance === 'string' && 
                         !["Melhorar meu tempo", "Apenas completar a prova bem", 
                           "Melhorar minha performance", "Ter mais qualidade de vida"].includes(formData.meta_performance || "")
                    ? formData.meta_performance 
                    : ""}
                  onChange={handleMetaChange}
                  className="resize-none border-primary/20 focus-visible:ring-primary/40"
                  rows={3}
                  autoFocus
                />
                <p className="text-sm text-primary mt-2">Seja específico sobre seu objetivo!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pergunta: Desempenho Atual */}
      {perguntaAtual === "desempenho_atual" && (
        <div className="space-y-4 animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="space-y-4">
              {/* Container principal com todos os elementos */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                {/* Título da seção */}
                <p className="text-base font-semibold text-center mb-3">Selecione seu tempo</p>
                
                {/* Seletor de tempo */}
                <div className="flex justify-center items-end gap-1">
                  <div className="flex flex-col items-center">
                    <label className="text-xs text-gray-500 mb-1">Horas</label>
                    <select 
                      className="w-16 h-12 text-center text-lg font-semibold bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={getHoursFromDesempenho(formData.desempenho_atual)}
                      onChange={(e) => {
                        const hours = parseInt(e.target.value);
                        const mins = getMinsFromDesempenho(formData.desempenho_atual);
                        const secs = getSecsFromDesempenho(formData.desempenho_atual);
                        updateDesempenhoTime(hours, mins, secs);
                      }}
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-xl mb-2 text-gray-400">:</span> 
                  <div className="flex flex-col items-center">
                    <label className="text-xs text-gray-500 mb-1">Minutos</label>
                    <select 
                      className="w-16 h-12 text-center text-lg font-semibold bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={getMinsFromDesempenho(formData.desempenho_atual)}
                      onChange={(e) => {
                        const hours = getHoursFromDesempenho(formData.desempenho_atual);
                        const mins = parseInt(e.target.value);
                        const secs = getSecsFromDesempenho(formData.desempenho_atual);
                        updateDesempenhoTime(hours, mins, secs);
                      }}
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-xl mb-2 text-gray-400">:</span>
                  <div className="flex flex-col items-center">
                    <label className="text-xs text-gray-500 mb-1">Segundos</label>
                    <select 
                      className="w-16 h-12 text-center text-lg font-semibold bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={getSecsFromDesempenho(formData.desempenho_atual)}
                      onChange={(e) => {
                        const hours = getHoursFromDesempenho(formData.desempenho_atual);
                        const mins = getMinsFromDesempenho(formData.desempenho_atual);
                        const secs = parseInt(e.target.value);
                        updateDesempenhoTime(hours, mins, secs);
                      }}
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Cálculo de ritmo */}
                {formData.desempenho_atual && formData.distancia_confortavel_km && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500 mb-1">Seu ritmo médio</p>
                    <p className="text-xl font-bold text-primary">
                      {calculatePace(formData.desempenho_atual, formData.distancia_confortavel_km)}
                      <span className="text-sm font-normal ml-1">min/km</span>
                    </p>
                  </div>
                )}
              </div>
              
              {/* Botões de ritmos comuns para facilitar a escolha */}
              {formData.distancia_confortavel_km && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 text-center">Ritmos comuns</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {getRitmosSugeridos(formData.distancia_confortavel_km).map((ritmo, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-sm py-1"
                        onClick={() => {
                          if (formData.distancia_confortavel_km) {
                            const tempoTotal = calcularTempoTotalByRitmo(ritmo, formData.distancia_confortavel_km);
                            onUpdateFormData({ desempenho_atual: tempoTotal });
                          }
                        }}
                      >
                        {ritmo}/km
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pergunta: Distância Confortável */}
      {perguntaAtual === "distancia_confortavel" && (
        <div className="space-y-3 animate-fade-in"> 
          <div className="max-w-md mx-auto">
            <div className="space-y-3"> 
              {/* Seletor de distância confortável */}
              <div className="bg-card p-3 rounded-xl border border-border"> 
                <div className="space-y-3"> 
                  {/* Slider para selecionar a distância */}
                  <div className="space-y-3"> 
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">0 km</span> 
                      <span className="text-xs text-muted-foreground">30 km</span> 
                    </div>
                    
                    <Slider
                      value={[formData.distancia_confortavel_km || 0]}
                      max={30}
                      step={0.5}
                      onValueChange={(values) => {
                        onUpdateFormData({ distancia_confortavel_km: values[0] });
                      }}
                      className="py-2" 
                    />
                    
                    {/* Caixa de exibição */}
                    <div className="bg-primary/10 p-2 rounded-lg text-center"> 
                      <span className="text-xl font-bold text-primary"> 
                        {formData.distancia_confortavel_km !== undefined 
                          ? formData.distancia_confortavel_km.toLocaleString('pt-BR', {
                              minimumFractionDigits: 1,
                              maximumFractionDigits: 1
                            }).replace('.', ',')
                          : "0,0"
                        }
                      </span>
                      <span className="text-base text-primary ml-1">km</span> 
                    </div>
                  </div>
                  
                  {/* Botões de distâncias comuns */}
                  <div className="pt-2 border-t border-border/50"> 
                    <p className="text-xs text-muted-foreground mb-2 text-center">Distâncias comuns</p> 
                    <div className="flex flex-wrap justify-center gap-1"> 
                      {[3, 5, 10, 15, 21.1].map((distancia) => ( // Removido 0 e 8 da lista
                        <Button
                          key={distancia}
                          type="button"
                          variant={formData.distancia_confortavel_km === distancia ? "default" : "outline"}
                          size="sm"
                          className="text-sm py-0.5 px-2" 
                          onClick={() => onUpdateFormData({ distancia_confortavel_km: distancia })}
                        >
                          {distancia === 21.1 ? "21,1" : distancia} km
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botão para iniciantes */}
              <div className="flex justify-center mt-4"> {/* Adicionado mt-4 */}
                <Button
                  type="button"
                  variant="ghost"
                  className="text-primary hover:text-primary/80 hover:bg-primary/10 flex items-center gap-2 py-1 text-sm"
                  onClick={() => {
                    // Definir distancia como 0 e desempenho como undefined
                    onUpdateFormData({ 
                      distancia_confortavel_km: 0,
                      desempenho_atual: undefined // Limpa o desempenho
                    });
                    // Solicita ao componente pai para avançar para o próximo passo
                    onAvancarSolicitado?.(); 
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                  </svg>
                  Estou começando a correr agora
                </Button>
              </div>
              
              {/* Dica */}
              <div className="text-center text-xs text-muted-foreground"> 
                <p>Esta informação nos ajuda a criar um plano adequado.</p> 
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
