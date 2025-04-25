"use client";

import { QuizFormData, NivelExperiencia } from "@/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Define os passos que este formulário pode renderizar
type ExperienciaPasso = "experiencia_nivel" | "experiencia_forca";

interface QuizExperienciaFormProps {
  formData: Partial<QuizFormData>;
  onUpdateFormData: (data: Partial<QuizFormData>) => void;
  perguntaAtual: ExperienciaPasso; // Adiciona a prop
}

export function QuizExperienciaForm({
  formData,
  onUpdateFormData,
  perguntaAtual, // Recebe a prop
}: QuizExperienciaFormProps) {
  const handleNivelChange = (value: NivelExperiencia) => {
    onUpdateFormData({ nivel_experiencia: value });
  };

  const handleTreinosForcaChange = (value: boolean) => {
    onUpdateFormData({ treinos_forca: value });
  };

  return (
    <div className="space-y-6 w-full"> {/* Garante largura total */} 

      {/* Pergunta: Nível de Experiência */}
      {perguntaAtual === "experiencia_nivel" && (
        <div className="grid grid-cols-1 gap-4 animate-fade-in"> {/* Animação */} 
          <div 
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              formData.nivel_experiencia === "iniciante" 
                ? "border-primary bg-primary/5" 
                : "border-muted hover:border-primary/50"
            }`}
            onClick={() => handleNivelChange("iniciante")}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M18 20a6 6 0 0 0-12 0"></path>
                  <circle cx="12" cy="10" r="4"></circle>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Iniciante</h3>
                <p className="text-sm text-muted-foreground">
                  Comecei a correr recentemente
                </p>
              </div>
            </div>
          </div>

          <div 
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              formData.nivel_experiencia === "intermediario" 
                ? "border-primary bg-primary/5" 
                : "border-muted hover:border-primary/50"
            }`}
            onClick={() => handleNivelChange("intermediario")}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m8 14 2.5-2.5 2.5 2.5 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Intermediário</h3>
                <p className="text-sm text-muted-foreground">
                  Corro regularmente há alguns meses
                </p>
              </div>
            </div>
          </div>

          <div 
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              formData.nivel_experiencia === "avancado" 
                ? "border-primary bg-primary/5" 
                : "border-muted hover:border-primary/50"
            }`}
            onClick={() => handleNivelChange("avancado")}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Avançado</h3>
                <p className="text-sm text-muted-foreground">
                  Corro há anos e participo de provas
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pergunta: Treinos de Força */}
      {perguntaAtual === "experiencia_forca" && (
        <div className="space-y-3 animate-fade-in"> {/* Animação */} 
          <Label className="text-base font-medium block text-center"> {/* Centraliza label */} 
            Você gostaria de incluir treinos de força?
          </Label>
          <p className="text-sm text-muted-foreground text-center mb-4">Eles complementam a corrida e previnem lesões.</p> {/* Adiciona descrição */} 
          
          <div className="grid grid-cols-2 gap-4"> {/* Aumenta o gap */} 
            <div 
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                formData.treinos_forca === true
                  ? "border-primary bg-primary/5" 
                  : "border-muted hover:border-primary/50"
              }`}
              onClick={() => handleTreinosForcaChange(true)}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M6 18h8"></path>
                    <path d="M3 22h18"></path>
                    <path d="M10 22V4a2 2 0 1 1 4 0v18"></path>
                    <path d="M5 13a2 2 0 0 0-2 2v5"></path>
                    <path d="M19 13a2 2 0 0 1 2 2v5"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Sim</h3>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                formData.treinos_forca === false
                  ? "border-primary bg-primary/5" 
                  : "border-muted hover:border-primary/50"
              }`}
              onClick={() => handleTreinosForcaChange(false)}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Não</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
