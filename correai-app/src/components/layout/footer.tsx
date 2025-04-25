export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} CorreAí. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
