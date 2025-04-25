'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; 

const AuthForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supabase] = useState(() => createClientComponentClient<Database>());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    const pendingData = localStorage.getItem('quizDataPendente');
    if (pendingData) {
      try {
        const parsedData = JSON.parse(pendingData);
        setQuizData(parsedData);
        localStorage.removeItem('quizDataPendente'); 
        console.log("AUTHFORM: Dados do quiz pendente carregados:", parsedData);
      } catch (error) {
        console.error("AUTHFORM: Erro ao parsear dados do quiz pendente:", error);
        localStorage.removeItem('quizDataPendente'); 
      }
    }
  }, []);

  const mode = searchParams.get('mode') || undefined; 

  console.log('[AuthForm] Modo lido dos searchParams:', mode);

  const defaultTabValue = mode === 'signup' ? 'signup' : 'login';

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data?.user) throw new Error('Login realizado, mas dados do usuário não retornados.');

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Falha ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    console.log("AUTHFORM: Iniciando SignUp...") 

    try {
      if (password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres.");
      }

      // A confirmação de email já foi desativada no console do Supabase,
      // então esta chamada criará o usuário imediatamente sem enviar email
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            // Dados adicionais do usuário podem ser adicionados aqui se necessário
            nome: nome,
            telefone: telefone || null,
          },
        },
      });

      if (signUpError) throw signUpError;
      console.log("AUTHFORM: Supabase Auth signUp bem-sucedido.", signUpData);

      const newUserId = signUpData?.user?.id;

      if (!newUserId) {
        throw new Error("Não foi possível obter o ID do novo usuário após o cadastro.");
      }

      if (quizData) { 
        // URL hardcoded para evitar problemas com variáveis de ambiente
        const webhookUrl = "https://n8n-n8n.ozcity.easypanel.host/webhook-test/gerador-treino";
        try {
          console.log("AUTHFORM: Enviando webhook para n8n com dados do quiz...");
          
          // Payload no mesmo formato usado por usuários já logados
          const webhookPayload = {
            ...quizData, 
            usuario_id: newUserId,
            desempenho_atual: `Corre ${quizData.distancia_confortavel_km}km confortavelmente. Completa ${quizData.distancia_objetivo_km}km em ${quizData.desempenho_atual}.`,
          };
          
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload),
          });

          if (!response.ok) {
            console.error(`AUTHFORM: Erro ao enviar webhook para n8n: ${response.status} ${response.statusText}`);
          } else {
            console.log("AUTHFORM: Webhook para n8n enviado com sucesso.");
          }
        } catch (webhookError) {
          console.error("AUTHFORM: Exceção ao tentar enviar webhook para n8n:", webhookError);
        }
      } else {
         console.log("AUTHFORM: Cadastro sem dados de quiz pendentes, webhook não enviado.");
      }

      console.log(`AUTHFORM: Inserindo usuário ${newUserId} na tabela 'usuarios'...`);
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert([{
          id: newUserId, 
          email: email, 
          nome: nome, 
          telefone: telefone || null, 
        }]);

      if (insertError) {
        console.error("AUTHFORM: Erro ao inserir na tabela 'usuarios':", insertError);
        throw new Error(`Usuário criado na autenticação, mas falha ao salvar perfil: ${insertError.message}`);
      }

      console.log("AUTHFORM: Usuário inserido na tabela 'usuarios' com sucesso.");

      console.log("AUTHFORM: Redirecionando para /dashboard...");
      router.push("/dashboard"); 
      setPassword('');
    } catch (err: any) {
      console.error("AUTHFORM: Erro geral no handleSignUp:", err); 
      if (err.message.includes("User already registered")) {
        setError("Este e-mail já está cadastrado. Tente fazer login.");
      } else if (err.message.includes("Password should be at least 6 characters")) {
        setError("A senha deve ter no mínimo 6 caracteres.");
      } else {
        setError(err.message || "Falha ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto"> 
      {mode !== 'signup' ? (
        <Tabs defaultValue={defaultTabValue} className="w-full"> 
          <CardHeader>
            <CardTitle className="text-2xl text-center">CorreAí</CardTitle>
            <TabsList className="grid w-full grid-cols-2 mt-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Cadastrar</CardTitle>
                <CardDescription>Crie sua conta para começar.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-nome-tab">Nome</Label> 
                    <Input
                      id="signup-nome-tab" 
                      type="text"
                      placeholder="Seu nome completo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email-tab">Email</Label>
                    <Input
                      id="signup-email-tab" 
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-telefone-tab">Telefone</Label>
                    <Input
                      id="signup-telefone-tab" 
                      type="tel"
                      placeholder="(99) 99999-9999"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password-tab">Senha</Label>
                    <Input
                      id="signup-password-tab" 
                      type="password"
                      placeholder="Crie uma senha segura"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Criar Conta'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>Crie sua conta para começar após o quiz.</CardDescription> 
          </CardHeader>
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-nome">Nome</Label> 
                <Input
                  id="signup-nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-telefone">Telefone</Label>
                <Input
                  id="signup-telefone"
                  type="tel"
                  placeholder="(99) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Crie uma senha segura (mín. 6 caracteres)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </Card>
  );
}

export default AuthForm; 
