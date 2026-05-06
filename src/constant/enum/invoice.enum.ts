export const InvoiceStatus = {
  Unpaid: "UNPAID",
  PartiallyPaid: "PARTIALLY_PAID",
  Paid: "PAID",
  Refunded: "REFUNDED",
} as const;
export type InvoiceStatus = typeof InvoiceStatus[keyof typeof InvoiceStatus];

export const PaymentMethod = {
  Cash: "CASH",
} as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];
