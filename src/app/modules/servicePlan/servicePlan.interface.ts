
export interface IServicePlan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
  highlighted?: boolean;
  serviceId: number;
}
