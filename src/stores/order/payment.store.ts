import {
    ApiClient,
    BaseAction,
    BaseState,
    defaultAsyncState,
    PaymentCreateDomain,
    PaymentDomain,
    PaymentResponseSchema,
    PaymentStatus,
    PaymentStatusSchema,
    PaymentUrlRequest,
    setLoadAndDo
} from "@/api";
import {create} from "zustand";
import {z} from "zod";
import {ApiError} from "next/dist/server/api-utils";
import {BANK_CODES} from "@/lib/bankcodes";

export namespace PaymentSingle {
    namespace Schema {
        export const Url = z.string().url({message: "invalid Url"});
    }

    type State = BaseState & PaymentCreateDomain
    type Action = BaseAction & {
        getPaymentUrl(): Promise<string>,
        setOrderId(orderId: number): void,
        setBankCode(bankCode: typeof BANK_CODES[number]): void,
        setNote(note: string): void
    }
    type Store = State & Action;

    const initialState: State = {
        ...defaultAsyncState,
        orderId: 0,
        bankCode: '',
        note: ''
    }

    export const useStore = create<Store>((set, get) => ({
        ...initialState,
        proxyLoading(run, lastAction) {
            try {
                setLoadAndDo(set, run, lastAction)
            } catch (e: unknown) {
                void e
            }
        },
        async getPaymentUrl(): Promise<string> {
            const domainCreate = get()
            if (domainCreate.orderId <= 0)
                throw new ApiError(400, "invalid payment request")
            /// TODO: bind env when deploy callBackUrl
            const request: PaymentUrlRequest = {
                note: domainCreate.note,
                bankCode: domainCreate.bankCode,
                orderId: domainCreate.orderId,
                callbackUrl: `${window.location.origin}/cart/payment`
            }
            console.log("request is", request)


            const payUrl = await PaymentApis.getPaymentUrl(request);
            return Schema.Url.parse(payUrl);
        },
        setOrderId(orderId: number) {
            set(s => ({
                ...s,
                orderId: orderId
            }))
        },
        setBankCode(bankCode: typeof BANK_CODES[number]) {
            set(s => ({
                ...s,
                bankCode: bankCode
            }))
        },
        setNote(note: string) {
            set(s => ({
                ...s,
                note: note
            }))
        }

    }))
}

export namespace PaymentCallback {
    type State = {
        payment: PaymentDomain | null,
        status: PaymentStatus;
    }
    type Action = {
        callbackPayment(request: Record<string, string>): Promise<void>
    }
    const initialState: State = {
        status: 'PENDING',
        payment: null,
    }
    type Store = State & Action;

    export const useStore = create<Store>((set) => ({
        ...initialState,
        async callbackPayment(request: Record<string, string>): Promise<void> {
            console.log('request is', request)
            try {
                const response = await PaymentApis.callbackPayment(request);
                console.log("response is", response)
                const status = PaymentCommon.parseStatus(response?.status, 'FAILED')
                const domain: PaymentDomain = {
                    id: response?.id ?? 0,
                    status: status,
                    cardType: response?.status ?? 'VNPAY',
                    detailCode: response?.status ?? '',
                    detailMessage: response?.detailMessage ?? '',
                    note: response?.note ?? '',
                    paymentMethod: response?.note ?? "VNPAY",
                    profileId: response?.profileId ?? 0,
                }
                set({payment: domain, status: status})
            } catch (e) {
                void e
                set({status: 'FAILED'})
            }

        },
    }))

}

export namespace PaymentApis {
    const paymentClient = ApiClient.getInstance();

    export async function getPaymentUrl(request: PaymentUrlRequest) {
        return paymentClient.put("/payments/urls", z.string().nullish(), request)
    }

    export async function callbackPayment(request: Record<string, string>) {
        return paymentClient.put("/payments/vnpay", PaymentResponseSchema, request)
    }
}
export namespace PaymentCommon {
    export const isStatus = (value: string | null | undefined): value is PaymentStatus =>
        PaymentStatusSchema.options.includes(value as PaymentStatus);

    export function parseStatus(input: string | null | undefined, fallback: PaymentStatus = 'PENDING'): PaymentStatus {
        return isStatus(input) ? input : fallback;
    }
}