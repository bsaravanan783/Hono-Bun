export interface paymentOptions {
    amount : number;
    currency : string;
    receipt : string;
}
export type paymentProvider = 'razorpay' | 'payu';