/**
 * Manual interactivo del Mitsubishi Pajero III (V60/V70, 2001-2002) con motor 4D56 2.5 TD.
 * Datos técnicos sacados del manual de taller (grupos 11B, 12, 13D, 13E, 14, 15, 16, 21, 22, 26, 27, 31, 35A, 37A).
 * Los textos son de ACM: no copiar párrafos del manual aquí.
 *
 * FIGURAS: cada figura tiene un `file`. Para que aparezca en la web basta con dejar la imagen en
 * `public/manual/pajero-iii/<file>` (webp, jpg o png con ese mismo nombre). Mientras no exista,
 * la web enseña un hueco con el pie de foto y la página del manual de referencia (`ref`).
 * Un paso puede apuntar a una figura con `figure: "<file>"` y el modo taller la enseña al lado.
 */

import type { ManualVehicle, System } from "@/content/manual-types";

export type { Figure, ManualVehicle, Part, Procedure, Spec, Step, System } from "@/content/manual-types";

export const manualVehicle: ManualVehicle = {
  model: "Mitsubishi Pajero III",
  chassis: "V60 / V70",
  years: "2001-2002",
  engine: "4D56 · 2.5 turbodiésel intercooler",
  basePath: "/manual/pajero-iii",
  photo: {
    file: "coche.jpg",
    alt: "Mitsubishi Pajero III de 2001, cinco puertas, visto de frente y de lado",
    author: "OSX",
    license: "Dominio público",
    source: "https://commons.wikimedia.org/wiki/File:2001_Mitsubishi_Pajero_(NM_MY01)_Exceed_5-door_wagon_(2015-08-07)_01.jpg",
  },
};

const PMS = "Gira el cigüeñal siempre en sentido horario (visto desde delante). Nunca hacia atrás salvo donde se indica.";

export const manualSystems: System[] = [
  {
    id: "motor",
    title: "Motor 4D56",
    parts: [
      {
        id: "ficha",
        title: "Ficha del motor",
        summary: "El 2.5 TD de cuatro cilindros en línea, con árbol de levas en cabeza, balancines de rodillo y ejes de equilibrado movidos por su propia correa.",
        warning: "En 2002 el Pajero III estrenó bomba inyectora de control electrónico (normativa de emisiones Tipo III). Con ella cambiaron el ralentí, el calado de la bomba, el apriete de culata y la tapa de la distribución, que lleva sensor de ángulo de cigüeñal. Mira siempre de qué año es tu motor.",
        specs: [
          { label: "Cilindrada", value: "2.477", unit: "cc" },
          { label: "Diámetro × carrera", value: "91,1 × 95,0", unit: "mm" },
          { label: "Relación de compresión", value: "21:1" },
          { label: "Distribución", value: "SOHC 8V", note: "4 válvulas de admisión y 4 de escape en total" },
          { label: "Cámara de combustión", value: "Precámara de turbulencia" },
          { label: "Balancines", value: "De rodillo", note: "tornillo de reglaje tipo pata de elefante" },
          { label: "Admisión abre / cierra", value: "20° APMS / 49° DPMI" },
          { label: "Escape abre / cierra", value: "55° APMI / 22° DPMS" },
          { label: "Alternador", value: "12 V / 105 A" },
          { label: "Bomba de vacío (en el alternador)", value: "90,6", unit: "kPa", note: "vacío máximo a 3.000 rpm" },
        ],
      },
      {
        id: "correa-auxiliar",
        title: "Correa de accesorios",
        summary: "Una correa serpentina mueve alternador y bomba de la dirección, con tensor automático. El aire acondicionado lleva otra correa aparte con tensor manual.",
        specs: [
          { label: "Tensor automático (tornillo)", value: "44 ± 10", unit: "N·m" },
          { label: "Correa del A/A usada · flecha", value: "8,0 – 8,5", unit: "mm", note: "con unos 100 N de empuje · 260–325 N de tensión" },
          { label: "Correa del A/A nueva · flecha", value: "6,5 – 7,0", unit: "mm", note: "390–450 N de tensión" },
        ],
        figures: [
          { file: "correa-aux-tensor-marca", caption: "Marca del tensor automático y zona A en la que tiene que quedar", ref: "Manual 11B-5" },
          { file: "correa-aux-llave-allen", caption: "Cómo bloquear el tensor automático con una llave Allen", ref: "Manual 11B-21" },
          { file: "correa-aux-aa", caption: "Correa del aire acondicionado: dónde medir la flecha y tornillos A y B", ref: "Manual 11B-6 · 11B-7" },
        ],
        procedures: [
          {
            title: "Revisar la correa serpentina",
            steps: [
              { title: "Dale una vuelta al motor", text: "Gira el motor al menos una vuelta en su sentido normal antes de mirar el tensor, para que la correa asiente." },
              { title: "Mira la marca del tensor", text: "La marca del tensor automático tiene que estar dentro de la zona A del soporte. Esta correa no se ajusta: el tensor lo hace solo.", figure: "correa-aux-tensor-marca" },
              { title: "Fuera de la zona A", text: "Si la marca se sale de la zona, la correa está estirada: cámbiala." },
            ],
          },
          {
            title: "Quitar y poner la correa serpentina",
            steps: [
              { title: "Marca el sentido", text: "Si vas a reutilizarla, pinta con tiza una flecha en el dorso con el sentido de giro (horario)." },
              { title: "Lleva el tensor al tope", text: "Mete una llave de estrella en el tornillo de la polea del tensor y gíralo en sentido horario hasta que haga tope.", figure: "correa-aux-llave-allen" },
              { title: "Bloquéalo", text: "Mete una llave Allen en el agujero del tensor para dejarlo bloqueado y saca la correa." },
              { title: "Monta y suelta", text: "Pasa la correa nueva por todas las poleas, vuelve a tensar el tensor con la llave, saca la Allen y suéltalo despacio." },
            ],
          },
          {
            title: "Ajustar la correa del aire acondicionado",
            steps: [
              { title: "Afloja", text: "Afloja el tornillo de fijación A de la polea tensora.", figure: "correa-aux-aa" },
              { title: "Tensa", text: "Con el tornillo de ajuste B, lleva la flecha de la correa a su valor empujando en el centro del tramo con unos 100 N." },
              { title: "Fija", text: "Aprieta el tornillo A y vuelve a comprobar la flecha." },
            ],
          },
        ],
      },
      {
        id: "distribucion",
        title: "Correas de distribución",
        summary: "Dos correas: la principal (cigüeñal, bomba inyectora y árbol de levas) y la B, que va por detrás y mueve los ejes de equilibrado. La B se monta primero.",
        warning: PMS,
        specs: [
          { label: "Flecha correa principal y B", value: "4 – 5", unit: "mm" },
          { label: "Tornillos de los tensores", value: "26 ± 3", unit: "N·m" },
          { label: "Tornillo de la polea del cigüeñal", value: "177 ± 9", unit: "N·m", note: "rosca con aceite de motor" },
          { label: "Tornillos de las tapas y del embrague del ventilador", value: "11 ± 1", unit: "N·m" },
          { label: "Tensor automático de accesorios", value: "44 ± 10", unit: "N·m" },
          { label: "Tornillos de las tapas (largos)", value: "M6 × 22 · 50 · 60", note: "cada largo va en su agujero" },
        ],
        figures: [
          { file: "distribucion-despiece", caption: "Despiece: qué sale y en qué orden hasta llegar a las correas", ref: "Manual 11B-19 · 11B-20" },
          { file: "distribucion-marcas", caption: "Marcas de distribución con el cilindro 1 en PMS y útil de la polea", ref: "Manual 11B-21" },
          { file: "distribucion-tensor-principal", caption: "Tensor de la correa principal: tornillos A y B", ref: "Manual 11B-22" },
          { file: "distribucion-correa-b", caption: "Correa B: marcas de los tres piñones, tensor (C y D) y lado tenso", ref: "Manual 11B-22" },
          { file: "distribucion-recorrido", caption: "Recorrido de la correa principal, los 2 dientes y el punto A", ref: "Manual 11B-23" },
          { file: "distribucion-flecha", caption: "Dónde medir la flecha y posición de los tornillos de la tapa", ref: "Manual 11B-24" },
        ],
        procedures: [
          {
            title: "Desmontaje",
            intro: "Hasta llegar a las correas sale medio frontal del motor. Este es el orden.",
            before: ["Quita el travesaño superior del radiador.", "Ten a mano el útil para sujetar la polea del cigüeñal (o un sistema equivalente)."],
            steps: [
              { title: "Correa del aire acondicionado", text: "Afloja el tornillo A de la polea tensora y luego el de ajuste B, y saca la correa. Si la vas a reutilizar, márcale el sentido de giro.", figure: "distribucion-despiece" },
              { title: "Compresor del A/A, a un lado", text: "Desenchufa el conector, suelta el compresor de su soporte sin abrir los tubos del gas y cuélgalo con una cuerda para que no estorbe.", caution: "No desconectes los tubos del aire acondicionado: el gas no se puede soltar a la atmósfera." },
              { title: "Polea tensora del A/A", text: "Quita la polea tensora con su soporte delantero." },
              { title: "Ventilador", text: "Desmonta el ventilador de refrigeración." },
              { title: "Correa serpentina", text: "Lleva el tensor automático al tope con una llave de estrella, bloquéalo con una Allen y saca la correa del alternador y la dirección." },
              { title: "Tensor, embrague del ventilador y polea de la bomba", text: "Quita el tensor automático, el embrague del ventilador y la polea de la bomba de agua." },
              { title: "Tapa superior", text: "Quita la tapa superior delantera de la distribución." },
              { title: "PMS y polea del cigüeñal", text: "Gira el cigüeñal en sentido horario hasta alinear las marcas con el cilindro 1 en compresión. Sujeta la polea con el útil y quita el tornillo y la polea.", figure: "distribucion-marcas", caution: "A partir de aquí no muevas el cigüeñal hacia atrás." },
              { title: "Tapa inferior", text: "Quita la tapa inferior delantera. En el motor de 2002 detrás aparecen el sensor de ángulo del cigüeñal y su paleta." },
              { title: "Afloja la correa principal", text: "Marca el sentido de giro en la correa. Afloja los tornillos A y B del tensor, empújalo hacia la bomba de agua y vuelve a apretarlos para dejarlo retirado. Saca la correa.", figure: "distribucion-tensor-principal" },
              { title: "Afloja la correa B", text: "Igual con la B: marca el sentido, afloja el tornillo C y la tuerca D, lleva el tensor hacia la bomba de agua, aprieta y saca la correa.", figure: "distribucion-correa-b" },
            ],
          },
          {
            title: "Montaje",
            steps: [
              { title: "Marcas de la correa B", text: "Alinea las marcas de los tres piñones de la correa B con sus referencias.", figure: "distribucion-correa-b" },
              { title: "Mete la correa B", text: "Si reutilizas la correa, la flecha tiene que apuntar como cuando la quitaste. Móntala sin holgura en el lado tenso." },
              { title: "Tensa la correa B", text: "Empuja con la mano el lado flojo para estirar al máximo el lado del tensor y comprueba que las marcas siguen alineadas. Afloja el tornillo C y la tuerca D para que tense solo el muelle." },
              { title: "Aprieta el tensor B", text: "Aprieta primero la tuerca D y después el tornillo C.", torque: "26 N·m", caution: "Si aprietas antes el tornillo, el tensor gira y pasa de tensión la correa." },
              { title: "Comprueba la flecha de la B", text: "Empuja con el dedo en el tramo indicado: tiene que ceder 4–5 mm." },
              { title: "Marcas de la correa principal", text: "Alinea las marcas de cigüeñal, bomba inyectora y árbol de levas.", figure: "distribucion-marcas" },
              { title: "Mete la correa principal", text: "En este orden: cigüeñal, bomba inyectora, tensor y árbol de levas, sin holgura en el lado tenso. El piñón de la bomba tiende a girarse: sujétalo en su marca mientras encajas la correa.", figure: "distribucion-recorrido" },
              { title: "Que tense el muelle", text: "Afloja los tornillos del tensor para que actúe el muelle." },
              { title: "Gira 2 dientes", text: "Gira el cigüeñal en sentido horario lo justo para que el piñón del árbol de levas avance 2 dientes. Exactamente eso, y sin tocar la correa.", caution: "Ni más ni menos de 2 dientes, y nunca hacia atrás en este paso." },
              { title: "Comprueba el punto A", text: "Mira que la correa no se levante en la zona marcada como A." },
              { title: "Aprieta el tensor", text: "Aprieta primero el tornillo del agujero alargado y luego el otro.", torque: "26 N·m", caution: "Si empiezas por el de abajo, la correa queda demasiado tensa." },
              { title: "Marcas y flecha", text: "Vuelve el cigüeñal hasta alinear las marcas, como indica el manual, comprueba que coinciden todas y mide la flecha: 4–5 mm.", figure: "distribucion-flecha" },
              { title: "Tapas", text: "Monta la tapa inferior y la superior. Cada tornillo tiene su largo (22, 50 o 60 mm): no los mezcles.", torque: "11 N·m" },
              { title: "Polea del cigüeñal", text: "Pon aceite de motor en la rosca, sujeta la polea con el útil y aprieta.", torque: "177 N·m" },
              { title: "El resto, al revés", text: "Polea de la bomba, embrague del ventilador, tensor automático, correa serpentina, ventilador, polea tensora y compresor del A/A, y su correa." },
            ],
            after: ["Revisa la tensión de la correa del aire acondicionado.", "Arranca y escucha: un silbido o golpeteo en la distribución es para parar y revisar."],
          },
        ],
        tips: ["Si tienes todo abierto, cambia también la correa B y revisa los tensores y la bomba de agua. Volver a desmontar por una correa barata es lo que más duele."],
      },
      {
        id: "tension-distribucion",
        title: "Retensar la distribución",
        summary: "Si solo quieres corregir la tensión de las correas sin cambiarlas, no hace falta desmontar todo: basta con quitar la tapa superior y la tapa de acceso.",
        warning: "Ojo con los aprietes del tensor B en este ajuste: el manual da 24 N·m para el tornillo del pivote y 23 N·m para la tuerca de la ranura (en el montaje completo da 26 N·m para los dos).",
        specs: [
          { label: "Flecha de ambas correas", value: "4,0 – 5,0", unit: "mm" },
          { label: "Tensor principal (tornillos A y B)", value: "26 ± 3", unit: "N·m" },
          { label: "Tensor B · tornillo del pivote", value: "24 ± 4", unit: "N·m" },
          { label: "Tensor B · tuerca de la ranura", value: "23 ± 3", unit: "N·m" },
        ],
        figures: [
          { file: "tension-principal", caption: "Tornillo A (lado de la ranura) y B del tensor principal", ref: "Manual 11B-14 · 11B-15" },
          { file: "tension-acceso-b", caption: "Tapa de acceso y tensor B: tornillo del pivote y tuerca de la ranura", ref: "Manual 11B-16" },
        ],
        procedures: [
          {
            title: "Correa principal",
            steps: [
              { title: "Tapa superior fuera", text: "Quita la tapa superior delantera de la distribución." },
              { title: "PMS del cilindro 1", text: "Alinea la marca del piñón del árbol de levas con la de la caja, con el cilindro 1 en compresión." },
              { title: "Suelta el tensor", text: "Afloja una o dos vueltas los dos tornillos del tensor para que el muelle tense la correa solo.", figure: "tension-principal" },
              { title: "Gira 2 dientes", text: "Gira el cigüeñal en sentido horario hasta que el piñón del árbol de levas avance 2 dientes. No te pases.", caution: "Nunca hacia atrás." },
              { title: "Aprieta en orden", text: "Primero el tornillo A, el del lado de la ranura, y luego el B, para que el soporte del tensor no gire con ellos.", torque: "26 N·m" },
              { title: "Comprueba", text: "Vuelve a alinear las marcas y empuja la correa en el centro del tramo con el dedo: 4–5 mm. Monta la tapa." },
            ],
          },
          {
            title: "Correa B",
            steps: [
              { title: "Revisa la correa", text: "Con la tapa superior fuera, da vueltas al cigüeñal en sentido horario y mira la correa entera por si tiene grietas o dientes dañados." },
              { title: "Alinea marcas", text: "Alinea las marcas de los piñones con la de la caja girando solo hacia delante.", caution: "Si giras hacia atrás para alinear, la tensión sale mal." },
              { title: "Tapa de acceso", text: "Quita la tapa de acceso de la tapa inferior.", figure: "tension-acceso-b" },
              { title: "Suelta el tensor B", text: "Afloja una vuelta el tornillo del pivote y una o dos vueltas la tuerca del lado de la ranura: el muelle tensa la correa." },
              { title: "Aprieta en orden", text: "Primero la tuerca de la ranura y después el tornillo del pivote.", torque: "Tuerca 23 N·m · tornillo 24 N·m" },
              { title: "Cierra", text: "Monta la tapa de acceso deslizando la tapa inferior por sus dos guías y luego la tapa superior." },
            ],
          },
        ],
      },
      {
        id: "valvulas",
        title: "Reglaje de válvulas",
        summary: "Se hace con el motor caliente y en dos pasadas: la mitad de las válvulas con el cilindro 1 en PMS y la otra mitad con el 4.",
        specs: [
          { label: "Holgura (admisión y escape)", value: "0,25", unit: "mm", note: "motor caliente, refrigerante a 80–90 °C" },
          { label: "Tapa de balancines", value: "5,9 ± 0,9", unit: "N·m" },
        ],
        figures: [
          { file: "valvulas-pms-1", caption: "Válvulas que se reglan con el cilindro 1 en PMS", ref: "Manual 11B-8" },
          { file: "valvulas-pms-4", caption: "Válvulas que se reglan con el cilindro 4 en PMS", ref: "Manual 11B-9" },
          { file: "valvulas-sellador", caption: "Dónde va el sellador de las juntas semicirculares (10 mm a cada lado)", ref: "Manual 11B-9" },
        ],
        procedures: [
          {
            title: "Reglaje",
            steps: [
              { title: "Calienta el motor", text: "Hasta que el refrigerante esté a 80–90 °C." },
              { title: "Destapa", text: "Quita la tapa superior de la distribución y la tapa de balancines." },
              { title: "Cilindro 1 en PMS", text: "Alinea la marca del piñón del árbol de levas girando el cigüeñal en sentido horario." },
              { title: "Mide la primera tanda", text: "Mide las válvulas de la figura metiendo la galga desde el centro de la culata hacia fuera, sin que toque la almohadilla del tornillo.", figure: "valvulas-pms-1" },
              { title: "Ajusta", text: "Si no está en 0,25 mm, afloja la contratuerca del balancín, gira el tornillo hasta que la galga pase justa, sujeta el tornillo con un destornillador y aprieta la contratuerca." },
              { title: "Cilindro 4 en PMS", text: "Gira el cigüeñal una vuelta completa (360°) en sentido horario y repite con la segunda tanda.", figure: "valvulas-pms-4" },
              { title: "Sellador y cierre", text: "Pon sellador en las juntas semicirculares, 10 mm a cada lado. Monta la tapa de balancines y la de la distribución.", figure: "valvulas-sellador", torque: "Tapa 5,9 N·m" },
            ],
          },
        ],
      },
      {
        id: "arbol-levas",
        title: "Árbol de levas y retén",
        summary: "Para cambiar el retén del árbol de levas solo hace falta quitar la tapa superior y el piñón. Para sacar el árbol entero, además, balancines y tapas de cojinete.",
        specs: [
          { label: "Tornillo del piñón del árbol de levas", value: "69 ± 5", unit: "N·m" },
          { label: "Conjunto de balancines (tornillos)", value: "37 ± 2", unit: "N·m" },
          { label: "Tapas de cojinete (tornillos)", value: "20 ± 1", unit: "N·m" },
          { label: "Tapa de balancines", value: "5,9 ± 0,9", unit: "N·m" },
          { label: "Tapa superior de la distribución", value: "11 ± 1", unit: "N·m" },
        ],
        figures: [
          { file: "levas-despiece", caption: "Despiece de tapa de balancines, balancines, tapas de cojinete y árbol", ref: "Manual 11B-27" },
          { file: "levas-brida-pinon", caption: "Piñón atado a la correa con una brida y útil para sujetarlo", ref: "Manual 11B-28" },
          { file: "levas-numeros-tapas", caption: "Números de las tapas de cojinete y sentido hacia delante", ref: "Manual 11B-28" },
          { file: "levas-reten", caption: "Profundidad a la que va el retén del árbol de levas", ref: "Manual 11B-29" },
        ],
        procedures: [
          {
            title: "Desmontaje",
            before: ["Quita el tubo de aire y la manguera de admisión."],
            steps: [
              { title: "Mangueras", text: "Suelta la manguera de vacío, la del respiradero y la de sobrepresión.", figure: "levas-despiece" },
              { title: "Tapas", text: "Quita la tapa superior de la distribución, el tapón de llenado de aceite y la tapa de balancines con su junta y las juntas semicirculares." },
              { title: "PMS del cilindro 1", text: "Gira el cigüeñal en sentido horario hasta alinear las marcas, con el cilindro 1 en compresión." },
              { title: "Ata piñón y correa", text: "Une el piñón del árbol de levas y la correa con una brida para que no se descale la marca.", figure: "levas-brida-pinon" },
              { title: "Saca el piñón con la correa", text: "Sujeta el piñón con el útil, quita el tornillo y saca el piñón con la correa puesta. Déjalo apoyado sin tensar.", caution: "Con el piñón fuera, no gires el cigüeñal." },
              { title: "Retén", text: "Saca el retén del árbol de levas. Si solo venías a cambiar el retén, aquí ya puedes montar el nuevo." },
              { title: "Balancines", text: "Afloja los tornillos del conjunto de balancines y sácalo entero, con los tornillos puestos.", caution: "No desmontes el conjunto de balancines y eje." },
              { title: "Tapas de cojinete y árbol", text: "Quita las tapas de cojinete y saca el árbol de levas." },
            ],
          },
          {
            title: "Montaje",
            steps: [
              { title: "Aceite", text: "Pon aceite de motor en todas las piezas que rozan antes de montarlas." },
              { title: "Árbol y tapas", text: "Mete el árbol y coloca las tapas de cojinete por el número grabado encima (la 1 y la 5 no llevan número).", figure: "levas-numeros-tapas", torque: "20 N·m" },
              { title: "Balancines", text: "Monta el conjunto de balancines sobre las tapas con la arandela orientada como en la figura.", torque: "37 N·m" },
              { title: "Retén nuevo", text: "Pon un poco de aceite en el labio del retén y en el árbol, y mételo con el útil hasta la profundidad indicada.", figure: "levas-reten" },
              { title: "Piñón", text: "Coloca el piñón con la correa, sujétalo con el útil y aprieta. Quita la brida.", torque: "69 N·m" },
              { title: "Reglaje y tapas", text: "Haz el reglaje de válvulas. Sellador en las juntas semicirculares, tapa de balancines y tapa de la distribución con cada tornillo en su sitio.", torque: "Tapa de balancines 5,9 N·m · tapa distribución 11 N·m" },
            ],
          },
        ],
      },
      {
        id: "culata",
        title: "Culata y junta",
        summary: "18 tornillos que se aprietan en espiral desde el centro hacia fuera. Se aflojan en orden inverso y poco a poco, para no deformar la culata.",
        warning: "Motor 2001 (bomba mecánica): el manual da 132 ± 5 N·m en frío en el texto del montaje, pero en el despiece de la misma sección marca 118 ± 5 N·m. Se contradice: confírmalo con el fabricante de la junta antes de apretar. Motor 2002 (bomba electrónica): 29 ± 2 N·m y luego 120° de ángulo, siempre en el mismo orden.",
        specs: [
          { label: "Tornillos de culata (2001)", value: "118 / 132 ± 5", unit: "N·m", note: "en frío · ver aviso" },
          { label: "Tornillos de culata (2002)", value: "29 ± 2 + 120°", note: "rosca y arandela con un poco de aceite" },
          { label: "Grosor de junta", value: "1,45 · 1,50 · 1,55", unit: "mm", note: "aplastada; se elige según lo que sobresalen los pistones" },
          { label: "Tubos de inyección (racores)", value: "30 ± 6", unit: "N·m" },
          { label: "Soporte de la bomba de dirección", value: "22 – 24 ± 4", unit: "N·m" },
          { label: "Guía de la varilla del aceite", value: "12 ± 1", unit: "N·m" },
        ],
        figures: [
          { file: "culata-despiece", caption: "Despiece: todo lo que hay que soltar para sacar la culata", ref: "Manual 11B-30 (2001) · 11B-13 (2002)" },
          { file: "culata-orden-aflojado", caption: "Orden para aflojar los tornillos de culata", ref: "Manual 11B-31 · 11B-14" },
          { file: "culata-orden-apriete", caption: "Orden de apriete de los 18 tornillos (vista desde arriba, delante a la izquierda)", ref: "Manual 11B-33 (2001) · 11B-16 (2002)" },
          { file: "culata-arandela", caption: "Posición del bisel de la arandela del tornillo de culata", ref: "Manual 11B-32 · 11B-15" },
          { file: "culata-junta-marcas", caption: "Dónde mirar la marca de grosor de la junta", ref: "Manual 11B-32 · 11B-15" },
        ],
        procedures: [
          {
            title: "Desmontaje",
            before: [
              "Motor frío.",
              "Vacía el aceite del motor.",
              "Quita el ventilador con su embrague y el colector de admisión.",
              "Quita las correas de distribución (ver «Correas de distribución»).",
              "Quita la tapa de balancines.",
            ],
            steps: [
              { title: "Varilla del aceite", text: "Quita la guía con la varilla.", figure: "culata-despiece" },
              { title: "Manguito superior del radiador", text: "Haz una marca en el manguito y en la abrazadera para volver a montarlo igual, y suéltalo." },
              { title: "Conectores", text: "Desenchufa los dos interruptores de temperatura (A/A y ventilador del condensador), el de los calentadores, el sensor de temperatura y el cable de masa." },
              { title: "Tubos de inyección", text: "Afloja los racores de los dos extremos sujetando con otra llave el racor de la bomba o el inyector. Tapa las bocas para que no entre suciedad.", caution: "Una mota de polvo en la bomba o en un inyector sale cara." },
              { title: "Mangueras", text: "Suelta la manguera de la calefacción, la del gasoil y el tubo de agua C." },
              { title: "Bomba de la dirección", text: "Suelta la bomba de su soporte sin desconectar las mangueras y átala a un lado. Quita el tornillo del soporte." },
              { title: "Afloja la culata", text: "Con la llave de vaso específica, afloja los tornillos en el orden de la figura, en varias pasadas.", figure: "culata-orden-aflojado" },
              { title: "Fuera la culata", text: "Levanta la culata y saca la junta. Guárdala: lleva la marca del grosor." },
            ],
          },
          {
            title: "Montaje",
            steps: [
              { title: "Elige la junta", text: "Si solo cambias la junta, pide la del mismo grosor que la vieja según su marca. Si has cambiado pistones o bielas, mide cuánto sobresalen y elige otra vez.", figure: "culata-junta-marcas" },
              { title: "Limpia", text: "Rasca los restos de junta del bloque y de la culata sin que caiga nada en los pasos de agua, de aceite ni en los cilindros." },
              { title: "Arandelas", text: "Monta las arandelas en los tornillos con el bisel hacia donde indica la figura. En el motor de 2002, pon una gota de aceite en la rosca y bajo la arandela.", figure: "culata-arandela" },
              { title: "Aprieta en espiral", text: "Aprieta en el orden de la figura empezando por el centro. Motor 2001: una pasada al par final. Motor 2002: todos a 29 N·m y después todos +120° en el mismo orden.", figure: "culata-orden-apriete", torque: "2001: ver aviso · 2002: 29 N·m + 120°" },
              { title: "Tubos de inyección", text: "Aprieta los racores sujetando con otra llave el racor contrario.", torque: "30 N·m" },
              { title: "Manguito del radiador", text: "Si reutilizas el manguito superior, haz coincidir las marcas que hiciste y pon la abrazadera." },
              { title: "El resto", text: "Bomba de la dirección, mangueras, conectores, varilla del aceite, correas de distribución, tapa de balancines, colector y ventilador." },
            ],
            after: ["Llena de aceite.", "Purga el aire del gasoil (ver «Gasoil, filtro e inyectores»).", "Llena y purga el refrigerante."],
          },
        ],
      },
      {
        id: "aceite",
        title: "Aceite y filtro",
        summary: "6,5 litros en total, contando filtro y enfriador. Cámbialo con el motor caliente para que salga todo.",
        specs: [
          { label: "Aceite de motor (total)", value: "6,5", unit: "L", note: "incluye 0,8 L del filtro y 0,4 L del enfriador" },
          { label: "Calidad mínima", value: "API CD" },
          { label: "Tapón de vaciado del cárter", value: "39 ± 5", unit: "N·m", note: "arandela nueva" },
          { label: "Presión de aceite al ralentí", value: "≥ 0,29", unit: "bar" },
          { label: "Presión a 3.500 rpm", value: "2,9 – 6,9", unit: "bar" },
        ],
        figures: [
          { file: "aceite-varilla", caption: "Niveles de la varilla", ref: "Manual 12-4" },
          { file: "aceite-arandela-tapon", caption: "Orientación de la arandela del tapón de vaciado", ref: "Manual 12-4 · 11B-18" },
        ],
        procedures: [
          {
            title: "Cambio de aceite y filtro",
            steps: [
              { title: "Calienta", text: "Arranca y deja el motor hasta que el refrigerante llegue a 80–90 °C." },
              { title: "Abre arriba", text: "Quita el tapón de llenado." },
              { title: "Vacía", text: "Quita el tapón de vaciado del cárter.", caution: "El aceite sale caliente." },
              { title: "Filtro fuera", text: "Quita la tapa inferior y saca el filtro con su llave." },
              { title: "Filtro nuevo", text: "Limpia el asiento del soporte, pon un poco de aceite en la junta del filtro nuevo y apriétalo con la llave desde que la junta toca el asiento." },
              { title: "Tapón", text: "Pon una arandela nueva bien orientada y aprieta el tapón.", torque: "39 N·m", figure: "aceite-arandela-tapon" },
              { title: "Llena y comprueba", text: "Echa el aceite, arranca, mira que no gotee nada, para y comprueba el nivel con la varilla tras un par de minutos.", figure: "aceite-varilla" },
            ],
          },
        ],
      },
      {
        id: "carter",
        title: "Cárter de aceite",
        summary: "En el Pajero III sacar el cárter es un trabajo gordo: hay que bajar el diferencial delantero y el travesaño nº 2.",
        specs: [
          { label: "Tornillos del cárter", value: "7,0 ± 1,0", unit: "N·m" },
          { label: "Tapón de vaciado", value: "39 ± 5", unit: "N·m" },
          { label: "Colador de la bomba de aceite", value: "19 ± 3", unit: "N·m" },
          { label: "Guía de la varilla", value: "12 ± 1", unit: "N·m" },
          { label: "Sensor de nivel de aceite", value: "8,8 ± 1,0", unit: "N·m" },
          { label: "Cordón de sellador", value: "≈ 4", unit: "mm", note: "continuo; montar antes de 15 min" },
        ],
        figures: [
          { file: "carter-despiece", caption: "Despiece del cárter, colador, sensor de nivel y tapa del volante", ref: "Manual 11B-17" },
          { file: "carter-sellador", caption: "Recorrido del cordón de sellador por dentro de los agujeros", ref: "Manual 11B-18" },
        ],
        procedures: [
          {
            title: "Desmontaje y montaje",
            before: [
              "Quita la protección inferior (cubrecárter) y la tapa inferior.",
              "Vacía el aceite del motor y el del diferencial delantero.",
              "Baja el diferencial delantero y el travesaño nº 2.",
            ],
            steps: [
              { title: "Varilla y tapón", text: "Quita la varilla con su guía y el tapón de vaciado.", figure: "carter-despiece" },
              { title: "Retorno de la bomba de vacío", text: "Suelta el tubo flexible de retorno de aceite de la bomba de vacío del alternador." },
              { title: "Sensor de nivel", text: "Desenchufa y quita el sensor de nivel de aceite con su separador de goma." },
              { title: "Tapa del volante", text: "Quita la tapa del volante." },
              { title: "Cárter fuera", text: "Despega el cárter con el útil (una cuchilla plana que se mete entre cárter y bloque). No hagas palanca con un destornillador." },
              { title: "Colador", text: "Si hace falta, quita el colador de la bomba de aceite y su junta. Revisa que la malla no esté rota ni atascada." },
              { title: "Limpia y desengrasa", text: "Quita todo el sellador viejo del cárter y del bloque y desengrasa las dos caras." },
              { title: "Sellador", text: "Haz un cordón continuo de unos 4 mm por la cara del cárter, por dentro de los agujeros de los tornillos.", figure: "carter-sellador" },
              { title: "Monta en 15 minutos", text: "Pon el cárter antes de que pasen 15 minutos desde que echaste el sellador y aprieta los tornillos.", torque: "7 N·m", caution: "Espera al menos 1 hora antes de arrancar el motor." },
              { title: "El resto", text: "Colador (19 N·m), tapa del volante, sensor de nivel, retorno de la bomba de vacío, tapón con arandela nueva y varilla." },
            ],
          },
        ],
      },
      {
        id: "retenes-ciguenal",
        title: "Retenes del cigüeñal",
        summary: "El delantero sale tras quitar las correas de distribución. El trasero, después de bajar la caja de cambios y el volante.",
        specs: [
          { label: "Tornillo del volante", value: "132 ± 5", unit: "N·m" },
          { label: "Tornillo de la polea del cigüeñal", value: "177 ± 9", unit: "N·m" },
        ],
        figures: [
          { file: "reten-delantero", caption: "Montaje del retén delantero con su guía", ref: "Manual 11B-26" },
          { file: "reten-trasero", caption: "Caja del retén trasero y separador de aceite con el agujero hacia abajo", ref: "Manual 11B-25 · 11B-26" },
        ],
        procedures: [
          {
            title: "Retén delantero",
            before: ["Quita las correas de distribución y la B (ver «Correas de distribución»)."],
            steps: [
              { title: "Piñón B", text: "Saca el piñón B del cigüeñal." },
              { title: "Retén viejo", text: "Saca el retén sin rayar el cigüeñal ni su alojamiento." },
              { title: "Retén nuevo", text: "Pon aceite en el labio y por fuera de la guía, y mételo a presión con el útil.", figure: "reten-delantero" },
            ],
          },
          {
            title: "Retén trasero",
            before: ["Baja la caja de cambios (grupo 22)."],
            steps: [
              { title: "Placa adaptadora y volante", text: "Quita la placa adaptadora. Bloquea el volante con el tope y quita sus tornillos." },
              { title: "Hasta el retén", text: "Quita el adaptador del cigüeñal, el rodamiento, la caja del retén con su junta y el separador de aceite." },
              { title: "Retén nuevo", text: "Mete el retén a presión en su caja con el útil." },
              { title: "Separador", text: "Monta el separador de aceite con su agujero hacia abajo de la caja.", figure: "reten-trasero" },
              { title: "Volante", text: "Bloquea el volante igual que al quitarlo y aprieta sus tornillos.", torque: "132 N·m" },
            ],
          },
        ],
      },
      {
        id: "refrigeracion",
        title: "Refrigeración",
        summary: "Circuito de 9 litros (10,5 con calefacción trasera). Termostato que empieza a abrir a 82 °C.",
        specs: [
          { label: "Refrigerante", value: "9,0 / 10,5", unit: "L", note: "sin / con calefacción trasera, incluye depósito" },
          { label: "Anticongelante", value: "30 – 60", unit: "%", note: "nunca con alcohol ni metanol" },
          { label: "Tapón de vaciado del bloque", value: "39 ± 5", unit: "N·m", note: "con fijador de roscas" },
          { label: "Termostato empieza a abrir", value: "82 ± 1,5", unit: "°C" },
          { label: "Termostato totalmente abierto", value: "95", unit: "°C", note: "con 8,5 mm o más de recorrido" },
          { label: "Tapón del radiador", value: "0,74 – 1,03", unit: "bar", note: "límite 0,64 bar" },
          { label: "Tornillos de la toma de agua (termostato)", value: "14 ± 1", unit: "N·m" },
          { label: "Tornillos de la bomba de agua", value: "13 ± 2 · 24 ± 3", unit: "N·m", note: "según el tornillo: ver figura" },
        ],
        figures: [
          { file: "refri-tapon-bloque", caption: "Dónde está el tapón de vaciado del bloque en el 4D56", ref: "Manual 14-4" },
          { file: "refri-termostato", caption: "Termostato, toma de agua y anillo de goma", ref: "Manual 14-8 · 14-9" },
          { file: "refri-bomba-agua", caption: "Bomba de agua y posición de cada tornillo (8×25, 8×40, 8×85)", ref: "Manual 14-12" },
        ],
        procedures: [
          {
            title: "Cambiar el refrigerante",
            steps: [
              { title: "Radiador", text: "Con el motor frío, quita el tapón del radiador y el tapón de vaciado de abajo." },
              { title: "Bloque", text: "Quita el tapón de vaciado del bloque para que salga lo que queda en el motor.", figure: "refri-tapon-bloque" },
              { title: "Depósito", text: "Saca el depósito de expansión y vacíalo." },
              { title: "Limpia", text: "Echa agua por la boca del radiador hasta que salga limpia." },
              { title: "Cierra", text: "Pon fijador de roscas en el tapón del bloque y apriétalo. Aprieta el del radiador y monta el depósito.", torque: "Tapón del bloque 39 N·m" },
              { title: "Tornillo de purga", text: "Quita el tornillo de purga de aire y cambia su arandela." },
              { title: "Llena", text: "Llena el radiador hasta que salga refrigerante por el agujero del tornillo de purga y aprieta el tornillo. Sigue llenando despacio hasta arriba y el depósito hasta FULL." },
              { title: "Calienta", text: "Pon el tapón, arranca y deja calentar hasta que abra el termostato (el manguito de abajo se calienta). Acelera unas cuantas veces y para." },
              { title: "Rellena en frío", text: "Con el motor ya frío, abre el tapón y completa el radiador y el depósito hasta FULL. Si baja mucho, repite desde el paso anterior." },
            ],
          },
          {
            title: "Cambiar el termostato",
            before: ["Vacía parte del refrigerante, lo justo para que no salga por la toma."],
            steps: [
              { title: "Manguito inferior", text: "Haz marcas en el manguito inferior del radiador y en su abrazadera, y suéltalo.", figure: "refri-termostato" },
              { title: "Toma de agua", text: "Quita la toma de agua y saca el termostato." },
              { title: "Pruébalo", text: "En un cazo con agua que vas calentando y removiendo: tiene que empezar a abrir a 82 ± 1,5 °C y abrir 8,5 mm o más a 95 °C." },
              { title: "Monta el nuevo", text: "El anillo de goma limpio, sin aceite y sin pellizcarlo al meterlo. Si está dañado, termostato nuevo.", torque: "14 N·m" },
              { title: "Manguito", text: "Mete el manguito hasta el resalte de la toma y haz coincidir las marcas con la abrazadera." },
            ],
            after: ["Rellena y purga el refrigerante."],
          },
          {
            title: "Cambiar la bomba de agua",
            before: ["Vacía el refrigerante.", "Quita las correas de distribución.", "Quita la manguera de admisión de aire y la bomba de la dirección."],
            steps: [
              { title: "Placa y bomba", text: "Quita la placa, su junta y la bomba de agua con su junta.", figure: "refri-bomba-agua" },
              { title: "Junta tórica", text: "Cambia la junta tórica del tubo de agua. Mójala con agua, igual que la ranura del tubo, y mete el tubo en la bomba." },
              { title: "Monta", text: "Bomba con junta nueva. Cada tornillo tiene su largo y su par: mira la figura.", torque: "13 / 24 N·m" },
            ],
            after: ["Monta la distribución.", "Llena y purga el refrigerante."],
          },
        ],
      },
      {
        id: "gasoil",
        title: "Gasoil, filtro e inyectores",
        summary: "Filtro con bomba de cebado manual y sensor de agua. Después de tocar cualquier cosa del circuito hay que purgar el aire.",
        specs: [
          { label: "Sensor de nivel de agua del filtro", value: "2,5 ± 0,5", unit: "N·m" },
          { label: "Tapón de purga de aire del filtro", value: "6,0 ± 1,0", unit: "N·m" },
          { label: "Manguera de gasoil (4D56)", value: "25 – 30", unit: "mm", note: "lo que entra el tubo, si no tiene resalte" },
          { label: "Presión de tarado del inyector", value: "147 – 155", unit: "bar" },
          { label: "Estanqueidad del inyector", value: "127 – 137", unit: "bar", note: "aguantar unos 10 s sin gotear" },
          { label: "Arandelas de reglaje del inyector", value: "0,10 – 0,80", unit: "mm", note: "+0,1 mm ≈ +23,5 bar" },
        ],
        figures: [
          { file: "gasoil-filtro", caption: "Filtro de gasoil: bomba manual, tapón de purga y sensor de agua", ref: "Manual 13D-13 · 13E-59 · 13E-60" },
          { file: "inyector-chorro", caption: "Chorros correctos e incorrectos del inyector", ref: "Manual 13E-55" },
        ],
        procedures: [
          {
            title: "Sacar el agua del filtro",
            intro: "Cuando se enciende el testigo del filtro de gasoil, hay agua acumulada.",
            steps: [
              { title: "Afloja el sensor", text: "Afloja el sensor de nivel de agua de debajo del filtro.", figure: "gasoil-filtro" },
              { title: "Bombea", text: "Acciona la bomba manual hasta que salga gasoil limpio, sin agua." },
              { title: "Aprieta", text: "Aprieta el sensor.", torque: "2,5 N·m" },
            ],
          },
          {
            title: "Purgar el aire del gasoil",
            intro: "Después de cambiar el filtro, soltar tuberías, quitar un inyector o quedarte sin gasoil. Primero llena el depósito.",
            steps: [
              { title: "Afloja el tapón de purga", text: "Afloja el tapón de aire del filtro y rodéalo con un trapo.", figure: "gasoil-filtro" },
              { title: "Bombea", text: "Acciona la bomba manual hasta que por el tapón no salgan burbujas." },
              { title: "Cierra", text: "Aprieta el tapón de purga.", torque: "6 N·m" },
              { title: "Hasta que endurezca", text: "Sigue bombeando hasta que la bomba se ponga dura." },
            ],
          },
          {
            title: "Probar un inyector",
            intro: "Con un comprobador de inyectores. No pongas nunca la mano delante del chorro.",
            steps: [
              { title: "Purga el comprobador", text: "Monta el inyector y da 2–3 bombeos para sacar el aire." },
              { title: "Presión de tarado", text: "Baja la palanca despacio y lee la presión en el momento en que la aguja cae de golpe: 147–155 bar." },
              { title: "Corrige", text: "Si no está en su valor, desmonta el portainyector y cambia el grosor de la arandela de reglaje: cada 0,1 mm más sube unos 23,5 bar." },
              { title: "Forma del chorro", text: "Bombea rápido (4 a 6 veces por segundo): el chorro tiene que salir recto y en cono uniforme, sin desviarse ni salir a golpes.", figure: "inyector-chorro" },
              { title: "Goteo", text: "Lleva la presión a 127–137 bar y mantenla unos 10 segundos: no puede gotear. Si gotea, limpia el inyector o cámbialo." },
            ],
          },
        ],
      },
      {
        id: "bomba-inyectora",
        title: "Calado de la bomba y ralentí",
        summary: "En el motor de 2001, con bomba mecánica, el calado se comprueba con un reloj comparador en el tapón trasero de la bomba. En el de 2002 el calado y el ralentí los gestiona la centralita.",
        warning: "Este procedimiento es del motor de 2001 con bomba mecánica.",
        specs: [
          { label: "Calado de la inyección", value: "1 ± 0,03", unit: "mm", note: "lectura del reloj a 9° DPMS" },
          { label: "Tuercas de la bomba", value: "19 ± 3", unit: "N·m" },
          { label: "Tornillos de la bomba", value: "23 ± 3", unit: "N·m" },
          { label: "Racores de los tubos de inyección", value: "30 ± 6", unit: "N·m" },
          { label: "Tapón de comprobación del calado", value: "17 ± 2", unit: "N·m", note: "junta nueva" },
          { label: "Ralentí (2001)", value: "750 ± 100", unit: "rpm" },
          { label: "Ralentí (2002)", value: "750 ± 30", unit: "rpm", note: "lo controla la centralita" },
        ],
        figures: [
          { file: "calado-tapon", caption: "Tapón de comprobación en la parte trasera de la bomba", ref: "Manual 11B-9" },
          { file: "calado-reloj", caption: "Útil con reloj comparador montado en la bomba", ref: "Manual 11B-10" },
          { file: "calado-ajuste", caption: "Hacia dónde girar la bomba según la lectura, y sus tuercas y tornillos", ref: "Manual 11B-11" },
          { file: "ralenti-tornillo", caption: "Tornillo de ajuste del ralentí", ref: "Manual 11B-12" },
        ],
        procedures: [
          {
            title: "Comprobar y ajustar el calado (2001)",
            steps: [
              { title: "Calienta", text: "Calienta el motor y comprueba que la palanca del ralentí acelerado está separada de la del acelerador." },
              { title: "Prepara", text: "Quita los calentadores y la tapa superior de la distribución." },
              { title: "Cilindro 1 en PMS", text: "Alinea las marcas del piñón del árbol de levas." },
              { title: "Tapón de la bomba", text: "Quita el tapón de comprobación de la parte trasera de la bomba inyectora.", figure: "calado-tapon" },
              { title: "Monta el reloj", text: "Comprueba que la varilla del útil sobresale unos 10 mm, monta el reloj comparador en el útil y el útil en el agujero del tapón.", figure: "calado-reloj" },
              { title: "A 30° antes del PMS", text: "Gira el cigüeñal en sentido horario hasta unos 30° antes del PMS del cilindro 1 y pon el reloj a cero." },
              { title: "Comprueba el cero", text: "Mueve el cigüeñal 2–3° a un lado y a otro: la aguja no se puede mover. Si se mueve, vuelve a buscar los 30° girando hacia delante." },
              { title: "Lee a 9° DPMS", text: "Gira en sentido horario hasta 9° después del PMS y lee el reloj: 1 ± 0,03 mm." },
              { title: "Si no cuadra", text: "Afloja los racores de los cuatro tubos en la bomba (sujetando los soportes) y las tuercas y tornillos de la bomba sin quitarlos. Inclina la bomba hacia un lado u otro hasta que el reloj marque su valor.", figure: "calado-ajuste" },
              { title: "Repite y aprieta", text: "Aprieta provisionalmente, repite la medida desde los 30° y, si está bien, aprieta todo al par.", torque: "Tuercas 19 · tornillos 23 · racores 30 N·m" },
              { title: "Cierra", text: "Quita el útil y pon el tapón con junta nueva.", torque: "17 N·m" },
            ],
          },
          {
            title: "Ajustar el ralentí (2001)",
            before: ["Calado de la bomba correcto.", "Motor caliente, luces y accesorios apagados."],
            steps: [
              { title: "Cuentavueltas", text: "Conecta un cuentavueltas en un inyector o en su tubo (si es en el tubo, quita sus abrazaderas)." },
              { title: "Mide", text: "Arranca y deja al ralentí: 750 ± 100 rpm." },
              { title: "Ajusta", text: "Si no está, afloja la contratuerca del tornillo de ralentí, gira el tornillo hasta dejarlo en su valor y aprieta la contratuerca.", figure: "ralenti-tornillo" },
            ],
          },
        ],
      },
      {
        id: "turbo",
        title: "Turbo e intercooler",
        summary: "Turbo con válvula de descarga (wastegate) en el colector de escape, e intercooler delante. Lo primero cuando falta empuje: medir la presión de soplado.",
        specs: [
          { label: "Actuador de la wastegate", value: "≈ 92", unit: "kPa", note: "presión a la que empieza a moverse (1 mm)" },
          { label: "Presión máxima en la prueba del actuador", value: "105", unit: "kPa", note: "más rompe la membrana" },
          { label: "Soplado anormalmente alto", value: "> 84", unit: "kPa", note: "en la prueba en carretera" },
          { label: "Turbo al colector y codo de escape", value: "59 ± 10", unit: "N·m" },
          { label: "Colector de escape a la culata", value: "18 ± 2", unit: "N·m" },
          { label: "Racores del tubo de agua", value: "42 ± 7", unit: "N·m" },
          { label: "Tubo de engrase (lado turbo)", value: "17 ± 2", unit: "N·m" },
          { label: "Válvula EGR", value: "25 ± 4", unit: "N·m" },
          { label: "Actuador de la wastegate", value: "12 ± 1", unit: "N·m" },
        ],
        figures: [
          { file: "turbo-manometro", caption: "Dónde conectar el manómetro para medir el soplado", ref: "Manual 15-2" },
          { file: "turbo-actuador", caption: "Prueba del actuador de la wastegate con bomba manual", ref: "Manual 15-3" },
          { file: "turbo-despiece", caption: "Despiece de turbo, colectores, tubos de agua y aceite y EGR", ref: "Manual 15-12" },
          { file: "intercooler", caption: "Intercooler y sus manguitos", ref: "Manual 15-5" },
        ],
        procedures: [
          {
            title: "Medir la presión de soplado",
            intro: "Prueba en carretera, en un sitio donde se pueda ir a fondo con seguridad y con dos personas: una conduce y otra lee el manómetro.",
            steps: [
              { title: "Manómetro", text: "Quita la manguera del compensador de soplado de la bomba inyectora y conecta ahí un manómetro.", figure: "turbo-manometro" },
              { title: "A fondo en segunda", text: "Acelera a fondo en segunda y lee la presión cuando el motor pase por unas 3.000 rpm." },
              { title: "Si no hay presión", text: "Revisa el actuador de la wastegate, fugas en manguitos e intercooler, y el propio turbo." },
              { title: "Si pasa de 84 kPa", text: "La wastegate no está regulando: mira la goma del actuador (suelta o rajada), el actuador y la válvula." },
            ],
          },
          {
            title: "Probar el actuador de la wastegate",
            steps: [
              { title: "Bomba manual", text: "Conecta una bomba manual de presión a la boquilla del actuador.", figure: "turbo-actuador" },
              { title: "Mide", text: "Sube la presión poco a poco y apunta cuándo empieza a moverse la varilla (1 mm): unos 92 kPa.", caution: "No pases de 105 kPa o romperás la membrana." },
              { title: "Decide", text: "Si se aleja mucho del valor, revisa actuador y válvula y cambia lo que esté mal." },
            ],
          },
          {
            title: "Desmontar el turbo",
            before: ["Vacía el refrigerante.", "Quita la batería y su bandeja, el filtro de aire y la protección inferior.", "Suelta el tubo de escape delantero."],
            steps: [
              { title: "Admisión", text: "Quita el tubo de aire y la manguera de admisión y suelta la manguera de vacío.", figure: "turbo-despiece" },
              { title: "Protector", text: "Quita la pantalla térmica del turbo." },
              { title: "Agua y aceite", text: "Suelta el tubo de agua B, el actuador de la wastegate, el tubo de engrase, el tubo de agua A y la manguera y el tubo de retorno de aceite. Tapa las bocas." },
              { title: "EGR", text: "Quita el tubo de recirculación de gases y la válvula EGR." },
              { title: "Conjunto", text: "Saca el colector de escape con el turbo como conjunto y, en el banco, separa turbo, codo de escape, pantallas y juntas." },
              { title: "Monta con juntas nuevas", text: "Todas las juntas nuevas. Antes de conectar el tubo de engrase, echa aceite limpio por la entrada del turbo.", torque: "Turbo 59 · colector 18 · agua 42 · engrase 17 N·m" },
            ],
            after: ["Llena el refrigerante.", "Deja el motor al ralentí un minuto antes de acelerar, para que llegue aceite al turbo."],
          },
        ],
        tips: ["El turbo vive del aceite: después de ir a fondo, deja el motor un minuto al ralentí antes de pararlo."],
      },
      {
        id: "calentadores",
        title: "Calentadores y carga",
        summary: "Calentadores autorregulados controlados por un relé, y alternador de 105 A con bomba de vacío.",
        specs: [
          { label: "Resistencia de cada calentador", value: "0,6 – 1,0", unit: "Ω", note: "a 20 °C" },
          { label: "Resistencia de los 4 en paralelo", value: "0,15 – 0,25", unit: "Ω", note: "a 20 °C" },
          { label: "Tensión al dar el contacto", value: "9 – 11", unit: "V", note: "cae a 0 a los 4–8 s" },
          { label: "Tensión arrancando", value: "≥ 6", unit: "V" },
          { label: "Postcalentamiento", value: "12 – 15", unit: "V", note: "hasta 60 °C de agua o 180 s" },
          { label: "Apriete de los calentadores", value: "18 ± 2", unit: "N·m" },
          { label: "Tensión de carga a 20 °C", value: "13,9 – 14,9", unit: "V" },
        ],
        figures: [{ file: "calentadores-placa", caption: "Placa de conexión de los calentadores y dónde medir", ref: "Manual 16-45 · 16-51" }],
        procedures: [
          {
            title: "Comprobar los calentadores",
            before: ["Batería entre 11 y 13 V.", "Motor frío."],
            steps: [
              { title: "Los cuatro juntos", text: "Mide la resistencia entre la placa de conexión y masa: 0,15–0,25 Ω.", figure: "calentadores-placa" },
              { title: "Tensión al dar el contacto", text: "Voltímetro entre placa y masa. Nada más dar el contacto, 9–11 V, que caen a 0 a los 4–8 segundos." },
              { title: "Arrancando", text: "Mientras arrancas, 6 V o más." },
              { title: "Postcalentamiento", text: "Con el motor ya en marcha, 12–15 V hasta que el agua pasa de 60 °C o pasan 180 segundos." },
              { title: "Uno a uno", text: "Si algo falla, suelta la placa y mide cada calentador: 0,6–1,0 Ω. El que esté abierto, fuera.", torque: "18 N·m" },
            ],
          },
        ],
      },
      {
        id: "compresion",
        title: "Compresión",
        summary: "La prueba para saber cómo está el motor por dentro antes de meterle mano.",
        specs: [
          { label: "Compresión a 280 rpm", value: "30,4", unit: "bar" },
          { label: "Mínimo", value: "≈ 22,5", unit: "bar" },
          { label: "Diferencia máxima entre cilindros", value: "2,9", unit: "bar" },
          { label: "Apriete de los calentadores", value: "18 ± 2", unit: "N·m" },
        ],
        figures: [{ file: "compresion-corte", caption: "Conector que hay que soltar para cortar la inyección", ref: "Manual 11B-13" }],
        procedures: [
          {
            title: "Medir la compresión",
            before: ["Aceite, motor de arranque y batería en buen estado.", "Motor caliente."],
            steps: [
              { title: "Calentadores fuera", text: "Quita los cuatro calentadores." },
              { title: "Corta la inyección", text: "Desenchufa la electroválvula de corte de gasoil (o su controlador si el coche tiene inmovilizador).", figure: "compresion-corte" },
              { title: "Limpia", text: "Tapa los agujeros con un trapo y da arranque: así salta lo que haya dentro.", caution: "No te pongas delante de los agujeros: si hay agua, aceite o gasoil, sale caliente y con fuerza." },
              { title: "Mide", text: "Enrosca el compresímetro en un agujero, da arranque y apunta. Repite en los cuatro." },
              { title: "Si alguno está bajo", text: "Echa un poco de aceite por el agujero y vuelve a medir. Si sube: segmentos o cilindro gastados. Si no sube: válvula o junta de culata." },
              { title: "Cierra", text: "Enchufa el corte de gasoil y monta los calentadores.", torque: "18 N·m" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "transmision",
    title: "Transmisión",
    parts: [
      {
        id: "embrague",
        title: "Embrague",
        summary: "Monodisco en seco con mando hidráulico. El líquido es el mismo que el de frenos.",
        specs: [
          { label: "Altura del pedal", value: "202 – 205", unit: "mm", note: "volante a la izquierda (197–200 a la derecha)" },
          { label: "Juego libre del pedal", value: "6 – 13", unit: "mm" },
          { label: "Juego del pasador de la horquilla", value: "1 – 3", unit: "mm" },
          { label: "Distancia al piso pisado", value: "≥ 75", unit: "mm", note: "volante a la izquierda (≥ 70 a la derecha)" },
          { label: "Líquido", value: "DOT3 / DOT4" },
        ],
      },
      {
        id: "caja-reductora",
        title: "Caja de cambios y reductora",
        summary: "Caja manual V5MT1 de cinco marchas y reductora de dos velocidades.",
        specs: [
          { label: "Aceite de caja", value: "3,2", unit: "L", note: "hipoidal 75W-90 o 75W-85W, API GL-4" },
          { label: "Aceite de reductora", value: "2,5", unit: "L", note: "hipoidal 75W-90 o 75W-85W, API GL-4" },
          { label: "Desarrollos", value: "3,918 · 2,261 · 1,395 · 1,000 · 0,829", note: "de primera a quinta" },
          { label: "Marcha atrás", value: "3,925" },
          { label: "Reductora alta / baja", value: "1,000 / 1,925" },
          { label: "Tapones de llenado y vaciado", value: "Con sellador", note: "semisecante" },
        ],
      },
      {
        id: "diferenciales",
        title: "Diferenciales",
        summary: "Aceite hipoidal GL-5 en los dos puentes.",
        specs: [
          { label: "Diferencial delantero", value: "1,2", unit: "L", note: "API GL-5, SAE 90 / 80W" },
          { label: "Diferencial trasero", value: "≈ 1,6", unit: "L", note: "API GL-5, SAE 90 / 80W" },
          { label: "Nivel correcto", value: "≤ 8", unit: "mm", note: "por debajo del borde del agujero de llenado" },
        ],
        procedures: [
          {
            title: "Comprobar el nivel",
            steps: [
              { title: "Coche plano", text: "Con el coche en llano, quita el tapón de llenado del diferencial." },
              { title: "Mide", text: "El aceite no puede estar más de 8 mm por debajo del borde inferior del agujero." },
              { title: "Rellena", text: "Si falta, rellena con aceite hipoidal GL-5 y pon el tapón." },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "chasis",
    title: "Chasis y dirección",
    parts: [
      {
        id: "frenos",
        title: "Frenos de disco",
        summary: "Discos delante y detrás. Las pastillas avisan con un chirrido cuando les quedan unos 2 mm.",
        specs: [
          { label: "Pastillas (nuevas / límite)", value: "10,0 / 2,0", unit: "mm", note: "delante y detrás" },
          { label: "Disco delantero (nuevo / límite)", value: "26,0 / 24,4", unit: "mm" },
          { label: "Disco trasero (nuevo / límite)", value: "22,0 / 20,4", unit: "mm" },
          { label: "Alabeo máximo del disco", value: "0,06", unit: "mm" },
          { label: "Variación de espesor máxima", value: "0,015", unit: "mm", note: "entre dos medidas cualesquiera" },
          { label: "Pinza delantera a la mangueta", value: "113 ± 9", unit: "N·m" },
          { label: "Pinza trasera", value: "88 ± 10", unit: "N·m" },
          { label: "Latiguillo (racor)", value: "30 ± 4", unit: "N·m" },
          { label: "Líquido", value: "DOT3 / DOT4" },
          { label: "Altura del pedal", value: "192 – 195", unit: "mm", note: "volante a la izquierda (187–190 a la derecha)" },
          { label: "Juego libre del pedal", value: "3 – 8", unit: "mm" },
          { label: "Distancia al piso pisado", value: "≥ 90", unit: "mm" },
        ],
        figures: [
          { file: "frenos-pastillas", caption: "Despiece de pastillas, clips y suplementos, delante y detrás", ref: "Manual 35A-31" },
          { file: "frenos-purga", caption: "Orden de purga de las ruedas", ref: "Manual 35A-30" },
        ],
        procedures: [
          {
            title: "Cambiar las pastillas",
            steps: [
              { title: "Mira el grosor", text: "Por la ventana de la pinza: si quedan 2 mm o menos, cambia las pastillas de las dos ruedas del eje a la vez." },
              { title: "Abre la pinza", text: "Quita el tornillo del pasador guía, gira la pinza hacia arriba sobre el otro pasador y átala con un alambre.", figure: "frenos-pastillas" },
              { title: "Fuera las viejas", text: "Saca las pastillas (la delantera con su avisador de desgaste), los clips y los suplementos." },
              { title: "Mide el arrastre", text: "Si quieres hacerlo como el manual, mide con un dinamómetro lo que cuesta girar el buje sin pastillas, para comparar luego." },
              { title: "Recoge el pistón", text: "Limpia el pistón y empújalo hasta el fondo con el útil o un sargento." },
              { title: "Monta las nuevas", text: "Clips y pastillas nuevas en el soporte, sin manchar de grasa ni aceite las caras de fricción." },
              { title: "Cierra la pinza", text: "Bájala con cuidado de no pellizcar el guardapolvos del pistón y pon el pasador guía." },
              { title: "Bombea", text: "Arranca el motor y pisa fuerte el freno dos o tres veces para acercar las pastillas. Para el motor y revisa el nivel del líquido.", caution: "No salgas sin haber bombeado: el primer pisotón va al fondo." },
            ],
          },
          {
            title: "Medir los discos",
            steps: [
              { title: "Espesor", text: "Con un micrómetro, mide en 8 puntos repartidos cada 45°, a 10 mm del borde exterior." },
              { title: "Decide", text: "Por debajo del límite, disco nuevo. Si entre dos medidas cualesquiera hay más de 0,015 mm, rectifícalo o cámbialo." },
              { title: "Alabeo", text: "Con un reloj comparador cerca del borde del disco, al girarlo no puede bailar más de 0,06 mm." },
            ],
          },
        ],
      },
      {
        id: "ruedas",
        title: "Ruedas",
        summary: "Par de las tuercas de rueda y de la rueda de repuesto.",
        specs: [
          { label: "Tuercas de rueda", value: "108 ± 10", unit: "N·m" },
          { label: "Soporte de la rueda de repuesto", value: "46 ± 8", unit: "N·m", note: "válvula hacia arriba para que no entre agua" },
        ],
      },
      {
        id: "direccion",
        title: "Dirección asistida",
        summary: "Líquido y holgura del volante.",
        specs: [
          { label: "Líquido", value: "≈ 0,6", unit: "L", note: "ATF Dexron II" },
          { label: "Holgura del volante", value: "≤ 30", unit: "mm", note: "con el motor en marcha" },
          { label: "Ángulo de giro · rueda interior", value: "36°30′ ± 1°30′" },
          { label: "Ángulo de giro · rueda exterior", value: "31°40′", note: "referencia" },
        ],
      },
    ],
  },
];
