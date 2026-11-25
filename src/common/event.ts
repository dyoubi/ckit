import { LiteralObject } from "./literal";

export class Event {
    id: string;
    source: string;
    data: LiteralObject;
    timestamp: Date = new Date();
}