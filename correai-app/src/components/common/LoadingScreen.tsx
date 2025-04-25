// src/components/common/LoadingScreen.tsx
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
      <p className="text-lg font-semibold text-primary animate-pulse">
        Calculando seu plano...
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Aguarde um momento, estamos preparando tudo para você!
      </p>
    </div>
  );
};

export default LoadingScreen;
