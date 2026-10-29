/**
 * ⚠️ TEXTOS LEGALES PROVISIONALES — pendientes de revisión por un profesional jurídico.
 * Los campos entre [corchetes] deben completarse con los datos reales del titular.
 */
export type LegalDoc = { slug: string; title: string; description: string; sections: { h: string; p: string[] }[] };

const TITULAR = "[Nombre/razón social del titular], NIF [NIF], domicilio en [dirección], email [email de contacto]";

export const legalDocs: LegalDoc[] = [
  {
    slug: "aviso-legal",
    title: "Aviso legal",
    description: "Información del titular del sitio web conforme a la LSSI-CE.",
    sections: [
      { h: "Titular", p: [`En cumplimiento del artículo 10 de la Ley 34/2002 (LSSI-CE), se informa de que el titular de este sitio web es ${TITULAR}.`] },
      { h: "Objeto", p: ["Este sitio presenta el proyecto deportivo y de contenidos ACM Motorsport y ofrece la venta de productos a través de su tienda online."] },
      { h: "Propiedad intelectual", p: ["Los contenidos, marcas y diseños de ACM Motorsport son titularidad de su propietario o se usan con autorización. Las marcas de terceros pertenecen a sus respectivos titulares."] },
      { h: "Responsabilidad", p: ["[Completar cláusulas de exclusión de responsabilidad y enlaces a terceros.]"] },
    ],
  },
  {
    slug: "privacidad",
    title: "Política de privacidad",
    description: "Cómo tratamos tus datos personales (RGPD y LOPDGDD).",
    sections: [
      { h: "Responsable del tratamiento", p: [TITULAR] },
      { h: "Finalidades", p: ["Gestionar pedidos y envíos; responder consultas y solicitudes de patrocinio; enviar novedades a quien se suscriba; medir el uso de la web si se aceptan cookies analíticas."] },
      { h: "Base jurídica", p: ["Ejecución del contrato (pedidos), consentimiento (newsletter, cookies no esenciales, formularios) e interés legítimo cuando proceda."] },
      { h: "Encargados y destinatarios", p: ["Proveedores de alojamiento, pago, producción bajo demanda, envío y email. [Completar listado y transferencias internacionales con garantías aplicables.]"] },
      { h: "Conservación", p: ["[Completar plazos por finalidad.]"] },
      { h: "Derechos", p: ["Puedes ejercer acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a [email]. También puedes reclamar ante la AEPD (aepd.es)."] },
      { h: "Datos de pago", p: ["Los datos de tarjeta los procesa directamente la pasarela de pago. Este sitio no almacena números de tarjeta."] },
    ],
  },
  {
    slug: "cookies",
    title: "Política de cookies",
    description: "Qué cookies usamos y cómo gestionarlas.",
    sections: [
      { h: "Qué son", p: ["Pequeños archivos o tecnologías similares (como el almacenamiento local) que guardan información en tu navegador."] },
      { h: "Técnicas (necesarias)", p: ["Carrito de compra (acm.cart.v1) y preferencias de consentimiento (acm.consent.v1). No requieren consentimiento."] },
      { h: "Analíticas (opcionales)", p: ["Google Analytics 4, solo si las aceptas. [Completar nombres de cookies, duración y proveedor.]"] },
      { h: "Medición sin cookies", p: ["Usamos Vercel Web Analytics y Speed Insights para contar visitas y medir la velocidad de la web de forma agregada. No usan cookies ni almacenan nada en tu navegador, y no permiten identificarte."] },
      { h: "Marketing (opcionales)", p: ["Píxeles publicitarios (p. ej. Meta, Google Ads) solo con consentimiento. Actualmente no activos."] },
      { h: "Vídeos incrustados", p: ["Los vídeos de YouTube se cargan desde youtube-nocookie.com solo cuando pulsas reproducir."] },
      { h: "Gestión", p: ["Puedes cambiar tu elección en cualquier momento desde «Preferencias de cookies» en el pie de página."] },
    ],
  },
  {
    slug: "condiciones",
    title: "Condiciones de contratación",
    description: "Condiciones generales de venta de la tienda oficial.",
    sections: [
      { h: "Vendedor", p: [TITULAR] },
      { h: "Proceso de compra", p: ["Selección de productos, datos de envío, aceptación de estas condiciones y pago a través de pasarela segura. Recibirás confirmación por email."] },
      { h: "Precios", p: ["Precios en euros con IVA incluido. Los gastos de envío se muestran antes de confirmar el pedido."] },
      { h: "Tipos de producto", p: ["«Vendido por ACM»: stock propio. «Bajo demanda»: se fabrica tras el pago. «Afiliación»: lo vende un tercero bajo sus propias condiciones."] },
      { h: "Desistimiento", p: ["Dispones de 14 días naturales desde la entrega para desistir, salvo las excepciones legales (p. ej. productos personalizados, art. 103 TRLGDCU). [Revisar aplicación a productos bajo demanda.]"] },
      { h: "Garantía", p: ["Garantía legal de conformidad conforme al TRLGDCU."] },
      { h: "Resolución de litigios", p: ["[Completar jurisdicción y referencia a la plataforma de resolución de litigios aplicable.]"] },
    ],
  },
  {
    slug: "envios",
    title: "Política de envíos",
    description: "Plazos, zonas y costes de envío.",
    sections: [
      { h: "Zonas", p: ["Inicialmente España peninsular y Baleares. [Confirmar Canarias, Ceuta y Melilla.]"] },
      { h: "Plazos", p: ["Stock propio: [x] días laborables. Bajo demanda: producción [x] días + transporte [x] días. [Completar con datos reales del proveedor.]"] },
      { h: "Costes", p: ["Las tarifas actuales de la tienda son de demostración. [Completar con tarifas reales.]"] },
      { h: "Seguimiento", p: ["Recibirás el número de seguimiento por email cuando el pedido salga."] },
    ],
  },
  {
    slug: "devoluciones",
    title: "Política de devoluciones",
    description: "Cómo devolver o cambiar un producto.",
    sections: [
      { h: "Plazo", p: ["14 días naturales desde la recepción, salvo excepciones legales."] },
      { h: "Productos defectuosos", p: ["Si un producto llega dañado o con defecto de impresión, escríbenos con fotos en un plazo de [x] días y lo reponemos sin coste."] },
      { h: "Procedimiento", p: ["[Completar dirección de devolución, quién asume el coste y plazo de reembolso (máx. 14 días).]"] },
    ],
  },
  {
    slug: "iva-y-precios",
    title: "Información de IVA y precios",
    description: "Cómo se muestran precios e impuestos.",
    sections: [
      { h: "IVA", p: ["Todos los precios incluyen el IVA español vigente (21 % general). En la factura se desglosa la base imponible y la cuota."] },
      { h: "Facturas", p: ["Puedes solicitar factura completa con tus datos fiscales. [Completar procedimiento.]"] },
      { h: "Afiliación", p: ["En productos de afiliación el precio y los impuestos los fija el vendedor externo."] },
    ],
  },
];
