export interface IStripeCheckoutPayload {
  planId: string;
  fullName: string;
  customerEmail: string;
  company?: string;
  phone?: string;
  projectDetails?: string;
}

export interface IInvoiceData {
  stripeSessionId: string;
  invoiceDate: Date;
  bookingDate: Date;
  fullName: string;
  customerEmail: string;
  company?: string;
  phone?: string;

  planName: string;
  amount: number;
  currency: string;

  bookingId: string;
}
