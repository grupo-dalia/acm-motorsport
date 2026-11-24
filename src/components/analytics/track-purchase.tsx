"use client";

import { useEffect } from "react";
import { trackPurchaseOnce, type CommerceData } from "@/lib/meta-pixel";

/** Purchase de Meta en la página de éxito. Una vez por pedido: recargar la página no lo repite. */
export function TrackPurchase({ orderReference, data }: { orderReference: string; data: CommerceData }) {
  useEffect(() => {
    trackPurchaseOnce(orderReference, data);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- un solo disparo por pedido
  }, [orderReference]);
  return null;
}
