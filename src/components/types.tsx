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
}