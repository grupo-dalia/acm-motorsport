/**
 * Cálculos económicos puros. Sin dependencias de UI ni de proveedores.
 * Importes en céntimos. Redondeo bancario no necesario: redondeo estándar al céntimo.
 */

export const VAT_ES = 0.21;

export function netFromGross(grossCents: number, vatRate = VAT_ES) {
  return Math.round(grossCents / (1 + vatRate));
}

export function vatFromGross(grossCents: number, vatRate = VAT_ES) {
  return grossCents - netFromGross(grossCents, vatRate);
}

/** Comisión de pasarela configurable (por defecto aproximación de tarjetas EEE). Revisar con la tarifa real. */
export type PaymentFeeModel = { percent: number; fixedCents: number };
export const DEFAULT_PAYMENT_FEE: PaymentFeeModel = { percent: 0.015, fixedCents: 25 };

export function paymentFee(totalCents: number, model: PaymentFeeModel = DEFAULT_PAYMENT_FEE) {
  return Math.round(totalCents * model.percent) + model.fixedCents;
}

export type ContributionInput = {
  grossRevenueCents: number; // cobrado al cliente, IVA incluido
  vatRate?: number;
  productionCostCents: number;
  shippingCostCents: number; // coste real de envío pagado al proveedor
  paymentFeeCents?: number;
  adSpendCents?: number;
};

/**
 * Beneficio de contribución = ingresos netos de IVA − fabricación − envío − comisiones − publicidad.
 * Es un indicador operativo, no un resultado contable.
 */
export function contribution(i: ContributionInput) {
  const net = netFromGross(i.grossRevenueCents, i.vatRate ?? VAT_ES);
  const fees = i.paymentFeeCents ?? paymentFee(i.grossRevenueCents);
  const costs = i.productionCostCents + i.shippingCostCents + fees + (i.adSpendCents ?? 0);
  const profit = net - costs;
  return { netRevenueCents: net, costsCents: costs, contributionCents: profit, marginPct: net > 0 ? profit / net : 0 };
}

/** Precio mínimo IVA incluido para alcanzar un margen objetivo sobre el neto. */
export function priceForMargin(unitCostCents: number, targetMargin: number, vatRate = VAT_ES) {
  if (targetMargin >= 1) throw new Error("El margen objetivo debe ser < 1");
  const net = unitCostCents / (1 - targetMargin);
  return Math.ceil((net * (1 + vatRate)) / 10) * 10; // redondeo a 10 céntimos
}
