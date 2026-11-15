# Manual de taller Lada Niva 1600 (VAZ-2121) · datos para la web

Para el explorador de manuales de acmmotorsport.com (el mismo formato que el del Pajero III).
Coche: Lada Niva 1600, VAZ-2121, 1977-1994, motor 2121 de 1,6 L de gasolina, con carburador.

**Ya está montado en la rama `guias/manual-lada-niva` del repo `grupo-dalia/acm-motorsport`:**
- `src/content/manual-lada-niva.ts`: todos los datos de este documento, con el tipo `System` del Pajero.
- `public/manual/lada-niva/*.svg`: 4 esquemas propios en el estilo ACM.
- `src/app/guias/manual-lada-niva/page.tsx`: la página, con el SEO, más la tarjeta en /guias y la entrada en el sitemap.
- `src/components/manual/manual-guide.tsx`: una copia genérica del explorador para que funcionara. Cuando el explorador nuevo (el modo taller) acepte cualquier coche por props, se borra.

Fuente: el manual de reparación del VAZ-2121, consultado en vazbook.ru (en inglés y en ruso). Los textos están redactados por ACM. No hay que copiar ni texto ni dibujos del manual en la web.

---

## 1. Datos rápidos

| Dato | Valor | Nota |
|---|---|---|
| Aceite de motor | 3,75 L | con filtro |
| Refrigerante | 10,7 L | circuito completo con la calefacción |
| Depósito | 42 L | con 4-6,5 L de reserva |
| Orden de encendido | 1-3-4-2 | el cigüeñal gira a derechas |
| Ralentí | 850-900 rpm | 750-800 con el carburador 2106-1107010 |
| Avance inicial | 3-5° antes del PMS | 1 ± 1° con encendido electrónico |
| Separación de bujías | 0,5-0,6 mm | 0,7-0,8 con encendido electrónico |
| Presión de aceite a 5.400 rpm | 3,5-4,5 kgf/cm² | con el aceite a 85 °C |
| Temperatura del motor caliente | 95 °C | |
| Flecha de la correa del ventilador | 10-15 mm | empujando con 10 kg |

## 2. Culata y junta

La culata sale con el motor en el coche. Los colectores de admisión (con el carburador) y de escape pueden salir pegados a la culata.

**Pares de apriete**

| Qué | Par | Nota |
|---|---|---|
| Culata, 1.ª pasada, tornillos 1 a 10 | 33-41 N·m | 3,4-4,2 kgf·m |
| Culata, 2.ª pasada, tornillos 1 a 10 | 96-118 N·m | 9,8-12,1 kgf·m |
| Culata, tornillo 11 | 31-39 N·m | 3,2-4,0 kgf·m, en la 2.ª pasada |
| Tuercas de la tapa de balancines | máx. 8 N·m | con más se rompe la junta o se alabea la tapa |

Ojo: la junta de culata y la junta de la tapa van siempre nuevas.

**Paso a paso**
1. Saca la rueda de repuesto. En el Niva va en el vano motor.
2. Vacía el refrigerante por el radiador y por el tapón del bloque. Quita el filtro de aire.
3. Desconecta la batería, los cables de bujías, el sensor de temperatura del agua y el cable del estárter del carburador.
4. Quita las bujías y el sensor de temperatura.
5. Suelta las varillas del acelerador de la palanca intermedia y quita la tapa de balancines.
6. Pon el motor en marcas: la marca de la polea con la marca larga de la tapa de distribución (fig. 7-19 del manual) y la marca del piñón del árbol de levas con la del soporte (fig. 2-19).
7. Suelta los manguitos de la calefacción, del carburador, del colector de admisión y de la salida de agua de la culata.
8. Separa el bajante del colector de escape y la chapa que protege el motor de arranque.
9. Bloquea el tensor de la cadena: afloja la tuerca de sombrerete, empuja la varilla con una palanca y vuelve a apretar la tuerca.
10. Quita el piñón del árbol de levas y saca el soporte con el árbol entero.
11. Afloja los tornillos de culata en el orden inverso al de apriete y levanta la culata.
12. Montaje: superficies limpias y junta nueva, sin golpes, grietas ni el recubrimiento despegado.
13. Aprieta en dos pasadas, del centro hacia fuera, en el orden de la **fig. 2-16** del manual: 33-41 N·m y luego 96-118 N·m. El tornillo 11 va a 31-39 N·m.
14. Monta el soporte del árbol de levas apretando las tuercas en el orden de la **fig. 2-18**. Monta el piñón con las marcas alineadas y suelta el tensor.
15. Regla las válvulas en frío, monta la tapa con junta nueva (máx. 8 N·m), conecta todo y comprueba el avance al arrancar.

## 3. Prueba de estanqueidad de la culata

| Prueba | Valor | Criterio |
|---|---|---|
| Con agua a presión | 5 kgf/cm² | 2 minutos sin una gota |
| Con aire, culata metida en agua a 60-80 °C | 1,5-2 kgf/cm² | 1-1,5 minutos sin burbujas |

Si tiene una grieta, la culata se cambia.

## 4. Cadena de distribución (tensado)

1. Afloja la tuerca del tensor. El muelle empuja el patín contra la cadena.
2. Gira el cigüeñal 1-1,5 vueltas en su sentido de giro.
3. Aprieta la tuerca.

El propio tensor deja una holgura de 0,2-0,5 mm entre la varilla y el émbolo.

## 5. Reglaje de válvulas

- Holgura de 0,15 mm en frío, la misma en admisión y escape. Margen admitido: 0,14-0,17 mm.
- Se hace con la cadena ya tensada.
- Levas numeradas desde la cadena: 1 ESC, 2 ADM, 3 ADM, 4 ESC, 5 ESC, 6 ADM, 7 ADM, 8 ESC.

| Posición del cigüeñal | Levas que se reglan |
|---|---|
| Marcas alineadas (el cilindro 4 al final de la compresión) | 8 y 6 |
| +180° | 4 y 7 |
| +360° | 1 y 3 |
| +540° | 5 y 2 |

La primera posición viene en el manual. Las demás salen de la tabla 2-5 y de la colocación de las levas: conviene cotejarlas con esa tabla.

## 6. Chasis

| Dato | Valor |
|---|---|
| Juego libre del volante | ≤ 5° (18-20 mm en el aro) |
| Convergencia delantera | 2-4 mm (coche cargado, medida entre llantas) |
| Caída delantera | 0°30' ± 20' |
| Avance | 3°30' ± 30' |
| Holgura axial del rodamiento de buje | 0,01-0,07 mm |
| Recorrido libre del embrague | 25-35 mm |
| Recorrido libre del freno | 3-5 mm (motor parado) |
| Freno de mano | 4-5 dientes; tiene que sujetar el coche en una pendiente del 30 % |

## 7. Figuras

**Ya hechas** (esquemas propios en SVG, en `public/manual/lada-niva/`):
- `culata-orden-apriete.svg`: el principio de apriete (del centro hacia fuera) con los pares.
- `distribucion-marcas.svg`: marca de la polea con la tapa y marca del piñón con el soporte.
- `levas-numeracion.svg`: numeración de las levas y la tabla de reglaje.
- `valvulas-galga.svg`: dónde va la galga, la contratuerca y el tornillo.

**Pendientes**, para dibujarlas en el mismo estilo a partir del manual en papel o de una foto del coche:
- Orden numerado de los 11 tornillos de culata (fig. 2-16): es la que más falta hace.
- Orden de apriete de las tuercas del soporte del árbol de levas (fig. 2-18).
- Despiece del tensor de cadena.
- Fotos reales del Niva en el taller en cada paso: es lo mejor para SEO y lo que más ayuda.

## 8. Dónde están los dibujos originales (para consultarlos, no para subirlos)

- vazbook.ru: el manual del VAZ-2121 por secciones (Niva → 2121 → Power unit → Engine repair). En la versión online no salen las figuras.
- manualshive.com: el "Lada Niva Manual - Maintenance" (VAZ 2121 series), en inglés. Trae la tabla de reglaje de válvulas.
- Revue Technique Automobile RTA 435.3 (en francés): de pago, con todos los dibujos.
- El manual en papel del propio dueño: una foto de las figuras 2-16 y 2-18 basta para redibujarlas.
