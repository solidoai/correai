import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthStatus } from "./AuthStatus";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">CorreAí</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {/* Renderiza o componente que controla o botão de login */}
            <AuthStatus />
          </nav>
        </div>
      </div>
    </header>
  );
}
