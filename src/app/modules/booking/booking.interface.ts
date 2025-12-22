export interface ICreateBookingPayload {
  fullName: string;
  customerEmail: string;
  company?: string;
  phone?: string;
  projectDetails?: string;
  planId: string;
}
