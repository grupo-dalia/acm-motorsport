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
      <h1 className="t-display">Algo se ha roto.</h1>
      <p className="mt-4 max-w-lg text-paper/70">La página no ha cargado por un error inesperado. Vuelve a intentarlo; si se repite, escríbenos desde Contacto.</p>
      <Button className="mt-8 self-start" onClick={reset}>Volver a intentarlo</Button>
    </Container>
  );
}
