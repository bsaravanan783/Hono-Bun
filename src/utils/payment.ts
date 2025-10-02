// @ts-ignore
import Razorpay = require("razorpay")
import { paymentOptions, paymentProvider, verifyPaymentDetails } from "../interfaces/payment"
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
const razorpayInstance = new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID as string,
    key_secret : process.env.RAZORPAY_KEY_SECRET as string
});

abstract class PaymentGateway {
    abstract createOrder(options : paymentOptions) : Promise<any>
    abstract verifyPayment(details : verifyPaymentDetails) : Promise<boolean>
    protected log(message : string) {
        console.log(`message : ${message}`);
    }
}

class RazorpayGateway extends PaymentGateway {
    private razorpayInstance : Razorpay
    constructor(keyId : string , keySecret : string){
        super();
        this.razorpayInstance = new Razorpay({ key_id : keyId , key_secret : keySecret });
    }

    async createOrder(options: paymentOptions): Promise<any> {
        this.log(`Creating razorpay order for ${options.amount} `); 
        return razorpayInstance.orders.create({
            amount : options.amount,
            currency : options.currency,
            receipt : options.receipt
        });
    }

    async verifyPayment(details: verifyPaymentDetails): Promise<boolean> {
        this.log(`Verifying payment for orderId : ${details.orderId}`);
        const validattionState = validatePaymentVerification({
            order_id:details.orderId ,payment_id:details.paymentId
        } , details.signature , process.env.RAZORPAY_KEY_SECRET as string);
        return validattionState;
    }
}

function createGateway(provider : paymentProvider): PaymentGateway {
    switch (provider) {
    case 'razorpay':
        return new RazorpayGateway(process.env.RAZORPAY_KEY_ID as string ,
            process.env.RAZORPAY_KEY_SECRET as string);
    case 'payu':
        throw new Error('payu payment provider is not functioning');
    default:
        throw new Error('Unsupported payment provider');
    }
}

export const paymentGateway = createGateway(process.env.PAYMENT_PROVIDER as paymentProvider || 'razorpay');