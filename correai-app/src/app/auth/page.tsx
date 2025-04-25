import { Suspense } from 'react';
import AuthClientWrapper from '@/components/auth/AuthClientWrapper';

export default function AuthPage() { 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Suspense fallback={<p>Carregando...</p>}> 
        <AuthClientWrapper /> 
      </Suspense>
    </div>
  );
}
