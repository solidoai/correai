import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link, X } from "lucide-react"; // Ícone Strava (placeholder) e ícone Fechar

interface ConectarStravaAlertProps {
  isVisible: boolean; // Controlado pelo componente pai
  onDismiss: () => void; // Função para dispensar
}

export function ConectarStravaAlert({ isVisible, onDismiss }: ConectarStravaAlertProps) {
  const handleConnect = () => {
    // TODO: Implementar redirecionamento para o fluxo OAuth do Strava
    console.log("Iniciando conexão com Strava...");
    // Exemplo: window.location.href = 'URL_DE_AUTORIZACAO_STRAVA';
  };

  if (!isVisible) {
    return null; // Não renderiza nada se não for visível
  }

  return (
    <Alert className="mb-4 border-primary/30 bg-primary/5 dark:bg-primary/10 relative"> {/* Estilo mais sutil */}
      <Link className="h-4 w-4 absolute left-3 top-3.5 text-primary" /> {/* Ícone posicionado */}
      <AlertTitle className="ml-6 font-semibold text-primary">Aprimore sua experiência: Integre seu Strava!</AlertTitle>
      <AlertDescription className="ml-6 text-sm text-foreground/80">
        Conecte sua conta Strava. Saberemos quando e como terminou cada um de seus treinos
        <Button
          onClick={handleConnect}
          size="sm"
          variant="link" // Botão como link para menos destaque
          className="p-0 h-auto ml-2 text-primary hover:underline"
        >
          Conectar agora
        </Button>
      </AlertDescription>
      <button
        onClick={onDismiss}
        className="absolute right-2 top-2 p-1 rounded-full hover:bg-muted"
        aria-label="Dispensar alerta"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    </Alert>
  );
}
