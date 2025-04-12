export interface Attendee {
    name: string;
    phone: string;
    info: string;
    createdAt: string;
}

export interface Queue {
    id: number;
    attendee: Attendee;
    status: QueueStatus;
    previousId: number;
    nextId: number;
    createdAt: string;
}

export enum QueueStatus {
    WAITING = "WAITING",
    ENTERED = "ENTERED"
}

export interface Line {
    id: number;
    name: string;
    uuid: string;
    isQueuePositionVisibleToAttendee: boolean;
}

export enum BillingStatus {
    NONE = "NONE",
    ACTIVE = "ACTIVE",
    CANCEL = "CANCEL",
    EXPIRED = "EXPIRED"
}

export interface SubscriptionInfo {
    isExist: boolean
    isSubscribe: boolean
    cardLastNumber: string
    endAt: string
    planType: string
    status: BillingStatus
    nextPaymentDate?: string
    isRefundable?: boolean
}