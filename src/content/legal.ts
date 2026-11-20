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
      { h: "Responsabilidad", p: ["Las guías y manuales de esta web se publican para ayudar, pero cada coche es un mundo: cualquier reparación la haces bajo tu responsabilidad y, si no lo tienes claro, mejor en un taller. Los enlaces a tiendas y webs de terceros llevan a páginas que no controlamos."] },
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
      { h: "Encargados y destinatarios", p: ["Para servirte usamos estos proveedores, que tratan tus datos solo para eso: Vercel (alojamiento de la web), Supabase (base de datos de pedidos), Stripe (pagos), Printful (fabricación y envío de los pedidos), las empresas de transporte que entregan el paquete y el servicio de email con el que te escribimos. Algunos están en Estados Unidos; las transferencias se amparan en el Marco de Privacidad de Datos UE-EE. UU. o en cláusulas contractuales tipo de la Comisión Europea."] },
      { h: "Conservación", p: ["Datos de pedidos y facturas: 6 años, por obligación fiscal y mercantil. Consultas por email: hasta resolverlas y un año más. Si te suscribes a algo, hasta que te des de baja."] },
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
      { h: "Analíticas (opcionales)", p: ["Google Analytics 4 (Google Ireland Ltd.), solo si las aceptas: cookies _ga y _ga_* para contar visitas de forma agregada, con una duración de hasta 2 años."] },
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
      { h: "Desistimiento", p: ["Dispones de 14 días naturales desde la entrega para desistir de la compra. Cómo hacerlo, en la política de devoluciones."] },
      { h: "Garantía", p: ["Garantía legal de conformidad conforme al TRLGDCU."] },
      { h: "Resolución de litigios", p: ["Si tienes cualquier problema, escríbenos primero a hola@acmmotorsport.com y lo arreglamos. Si no quedas conforme, puedes acudir a los servicios de consumo de tu comunidad autónoma. Estas condiciones se rigen por la ley española y, si eres consumidor, te corresponden los juzgados de tu domicilio."] },
    ],
  },
  {
    slug: "envios",
    title: "Política de envíos",
    description: "Plazos, zonas y costes de envío.",
    sections: [
      { h: "Zonas", p: ["España peninsular y Baleares. A Canarias, Ceuta y Melilla todavía no enviamos."] },
      { h: "Plazos", p: ["Las prendas se fabrican cuando haces el pedido: la impresión suele tardar de 2 a 5 días laborables y el transporte, de 3 a 6 más. En campañas como Black Friday o Navidad puede alargarse."] },
      { h: "Costes", p: ["4,95 € por pedido. Gratis a partir de 60 €."] },
      { h: "Seguimiento", p: ["Recibirás el número de seguimiento por email cuando el pedido salga."] },
    ],
  },
  {
    slug: "devoluciones",
    title: "Política de devoluciones",
    description: "Qué pasa si tu prenda llega mal, si no te vale la talla o si cambias de idea.",
    sections: [
      { h: "Cómo funciona", p: ["Nuestras prendas no están en un almacén: se imprimen una a una cuando haces el pedido, en el centro de producción de nuestro socio de fabricación (Printful), y salen de allí directamente a tu casa.", "Para cualquier problema escribe a hola@acmmotorsport.com con tu número de pedido. Lo gestionamos nosotros, no tienes que hablar con nadie más."] },
      { h: "Si llega mal: defecto, error de impresión o daño", p: ["Si la prenda llega con un fallo de impresión, defectuosa, dañada o no es lo que pediste, te mandamos otra igual o te devolvemos el dinero, lo que prefieras, sin coste para ti.", "Escríbenos en los 30 días siguientes a recibirla con una foto donde se vea el problema. No hace falta que nos la devuelvas."] },
      { h: "Si el paquete no llega", p: ["Si el paquete se pierde, avísanos en los 30 días siguientes a la fecha de entrega estimada y te lo volvemos a enviar sin coste.", "Si la dirección que nos diste está incompleta o el paquete no se recoge y vuelve, el nuevo envío corre de tu cuenta."] },
      { h: "Si no te vale la talla", p: ["Antes de comprar, mira la guía de tallas de cada ficha. Si aun así no te queda bien, escríbenos en los 14 días siguientes a recibirla y te decimos cómo cambiarla. El envío de la talla nueva corre de tu cuenta."] },
      { h: "Si cambias de idea (desistimiento)", p: ["Tienes 14 días naturales desde que la recibes para desistir de la compra sin dar explicaciones. Escríbenos (te vale cualquier mensaje claro, o el formulario de desistimiento de abajo) y te daremos la dirección a la que enviarla, que depende del centro donde se fabricó.", "La prenda tiene que volver sin usar y con sus etiquetas. El coste de enviarla de vuelta es tuyo.", "Te devolvemos lo que pagaste, envío estándar incluido, por el mismo medio de pago, en un máximo de 14 días desde que nos avisas. Podemos esperar a recibirla o a que nos mandes el justificante de envío."] },
      { h: "Formulario de desistimiento", p: ["A la atención de ACM Motorsport, hola@acmmotorsport.com: por la presente le comunico que desisto de mi contrato de venta del siguiente producto: [producto], pedido el [fecha] y recibido el [fecha]. Nombre: [nombre]. Dirección: [dirección]. Fecha y firma (solo si se envía en papel)."] },
      { h: "Garantía", p: ["Además, todas las prendas tienen la garantía legal de 3 años por falta de conformidad (Real Decreto Legislativo 1/2007). Si aparece un defecto de fabricación, escríbenos."] },
    ],
  },
  {
    slug: "iva-y-precios",
    title: "Información de IVA y precios",
    description: "Cómo se muestran precios e impuestos.",
    sections: [
      { h: "IVA", p: ["Todos los precios incluyen el IVA español vigente (21 % general). En la factura se desglosa la base imponible y la cuota."] },
      { h: "Facturas", p: ["Si necesitas factura completa, escríbenos a hola@acmmotorsport.com con tu número de pedido, nombre o razón social, NIF y dirección, y te la enviamos por email."] },
      { h: "Afiliación", p: ["En productos de afiliación el precio y los impuestos los fija el vendedor externo."] },
    ],
  },
];
