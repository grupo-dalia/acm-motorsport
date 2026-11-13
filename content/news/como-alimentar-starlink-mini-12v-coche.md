---
title: "Cómo alimentar Starlink Mini a 12V en el coche: consumo, cables y baterías"
summary: "Cuánto gasta, qué cargador USB-C sirve y cuál no, cómo hacer una línea a 12V con su fusible y cuántas horas aguanta con batería. Con números."
date: 2026-11-13
image: "/media/taller-lampara-itv.jpg"
imageAlt: "Andrés trabajando en el vano motor del Pajero en el taller"
category: overland
kind: guide
collection: starlink
order: 3
tags: [starlink, starlink mini, 12v, consumo, baterías, overland, guia]
faq:
  - q: "¿Cuánto consume Starlink Mini?"
    a: "Starlink indica un consumo medio de 20 a 40 W, unos 15 W en reposo. Para calcular baterías, 30 W de media es una buena referencia."
  - q: "¿Funciona con cualquier cargador USB-C del coche?"
    a: "No. Necesita USB-C Power Delivery de 100 W (20 V / 5 A) para ir bien, y por debajo de 65 W no funciona. La mayoría de cargadores de mechero baratos se quedan cortos."
  - q: "¿Se puede conectar directamente a 12V?"
    a: "Sí. Admite entrada de corriente continua de 12 a 48 V. Lo correcto es una línea propia desde la batería con fusible e interruptor."
  - q: "¿Cuánto aguanta con una batería?"
    a: "A 30 W de media, 8 horas son unos 240 Wh, unos 20 Ah a 12 V. Una estación de energía de 500 Wh da para una jornada larga con margen."
  - q: "¿Puede descargar la batería del coche?"
    a: "Sí, si la dejas encendida horas con el motor parado. Pon un interruptor y, si vas a usarla mucho en parado, una batería auxiliar."
sources:
  - title: "Starlink · Especificaciones de Starlink Mini"
    url: "https://www.starlink.com/specifications?spec=5"
  - title: "Starlink · Requisitos de alimentación de Starlink Mini"
    url: "https://starlink.com/support/article/a7fe6525-5356-a837-48e6-33df176cdbc5"
---

La antena es lo vistoso, pero lo que más problemas da en un Starlink Mini dentro del coche es **la corriente**. Cargadores que no tiran, cables que se calientan, baterías de arranque vacías por la mañana… Aquí van los números y las tres formas de alimentarlo bien.

## Lo que pide Starlink Mini

| Dato | Valor |
|---|---|
| Entrada de corriente continua | 12 a 48 V, 60 W |
| USB-C Power Delivery | 100 W (20 V / 5 A) recomendado |
| Mínimo USB-C que funciona | 65 W (por debajo, no arranca) |
| Consumo medio | 20 a 40 W |
| Consumo en reposo | unos 15 W |

Son datos de las especificaciones y del soporte oficial de Starlink. Para hacer cuentas usamos **30 W de media**.

## Opción 1: línea directa a 12V (la buena para un montaje fijo)

Es lo que recomendamos si la antena va fija en el coche:

1. **Fusible cerca de la batería.** 60 W a 12 V son 5 A; un fusible de 7,5 a 10 A protege el cable sin saltar por nada.
2. **Cable de sección suficiente.** Para unos pocos metros, 1,5 mm² va sobrado a 5 A. Si el recorrido es largo, sube de sección para no perder tensión.
3. **Interruptor o relé.** Para apagarla sin desenchufar nada y no vaciar la batería con el motor parado.
4. **Conector en condiciones** hacia el cable de la antena, y todo bien sujeto: en pista, lo que cuelga acaba rozando.

Starlink vende su propio cable para 12 V; si usas otro, comprueba que es de calidad y del conector correcto.

## Opción 2: USB-C de 100 W (la rápida)

Un cargador de mechero o una batería con **USB-C PD de 100 W** y el cable oficial de **USB-C a conector de alimentación**. Es cómodo y desmontable, pero ojo:

- Un cargador de 30 o 45 W **no vale**. Mira el vatiaje antes de comprar.
- El cable USB-C también cuenta: tiene que ser de 100 W (5 A).
- Muchas tomas de mechero antiguas se calientan con cargas sostenidas: si notas que se calienta, pasa a la opción 1.

## Opción 3: batería o estación de energía (para el campamento)

Para usarla en parado sin tocar la batería del coche. Las cuentas, con 30 W de media:

| Uso | Energía | A 12 V |
|---|---|---|
| 1 hora | 30 Wh | 2,5 Ah |
| 8 horas | 240 Wh | 20 Ah |
| 24 horas | 720 Wh | 60 Ah |

Suma un 10-20 % por pérdidas de conversión. Una estación de energía de unos 500 Wh da para una jornada larga con margen; para varios días sin arrancar el motor, batería auxiliar y, si puedes, placa solar.

![El Pajero en la montaña](/media/pajero-montana.jpg)

*En parado, mejor una batería auxiliar que la de arranque.*

## Errores típicos

- **Cargador USB-C de poca potencia**: la antena se reinicia o ni arranca.
- **Sin fusible propio**: un roce en el cable y tienes un problema serio.
- **Cable fino en un recorrido largo**: pierde tensión y se calienta.
- **Dejarla encendida toda la noche** con la batería de arranque.

## ¿Te lo montamos?

En **ACM Workshop** hacemos la instalación completa: línea con fusible, interruptor y paso de cable sellado. [Escríbenos](/contacto).

Si todavía no tienes Starlink, con nuestro enlace de referido os lleváis una recompensa tú y nosotros, sin pagar más:

{{affiliate:starlink}}

Sigue con la serie: [cómo instalar Starlink Mini en el coche](/noticias/como-instalar-starlink-mini-en-el-coche) y [qué plan elegir para viajar](/noticias/que-plan-starlink-elegir-para-viajar).
