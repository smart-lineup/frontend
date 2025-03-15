export interface Attendee {
    id: number;
    phone: string;
    info: string;
    createdAt: string;
}

export interface Queue {
    id: number;
    attendee: Attendee;
    status: QueueStatus;
    previous: Queue | null;
    next: Queue | null;
    createdAt: string;
    updatedAt: string;
}

export enum QueueStatus {
    WAITING = "WAITING",
    ENTERED = "ENTERED"
}

export interface Line {
    id: number;
    name: string;
    queues: Queue[];
}