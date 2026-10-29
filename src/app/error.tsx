"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Container className="flex min-h-[80vh] flex-col justify-center py-32">
      <p className="eyebrow">Avería</p>
      <h1 className="display mt-6 text-[length:var(--text-display-md)]">Algo se ha roto</h1>
      <p className="mt-4 max-w-lg text-paper/70">Ha ocurrido un error inesperado. Ya estamos con la llave inglesa.</p>
      <Button className="mt-8 self-start" onClick={reset}>Reintentar</Button>
    </Container>
  );
}
