export interface PaymentProduct {
  id: string;
  title: string;
  description: string;
  priceLabel: string;
  /** Amount in minor units (kopecks) for Telegram Stars / provider */
  amountMinor: number;
  currency: "RUB" | "XTR";
}

export const FULL_READING_PRODUCT: PaymentProduct = {
  id: "additional-lines",
  title: "Дополнительные линии ладони",
  description: "Полная расшифровка скрытых линий",
  priceLabel: "299 ₽",
  amountMinor: 29900,
  currency: "RUB",
};

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

/**
 * Initiate payment (Telegram Stars, ЮKassa, etc.)
 * TODO: integrate provider SDK / bot invoice
 */
export async function initiatePayment(
  _productId: string,
  _userId?: number,
): Promise<PaymentResult> {
  await new Promise((r) => setTimeout(r, 1200));
  return {
    success: true,
    transactionId: `mock_${Date.now()}`,
  };
}
