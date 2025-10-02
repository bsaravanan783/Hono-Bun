export interface paymentOptions {
    amount : number;
    currency : string;
    receipt : string;
}
export interface verifyPaymentDetails {
    orderId : string;
    paymentId : string;
    signature : string;
}

export type paymentProvider = 'razorpay' | 'payu';