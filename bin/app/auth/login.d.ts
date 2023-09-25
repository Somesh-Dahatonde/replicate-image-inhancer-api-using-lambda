import middy from "@middy/core";
interface Event {
    body: string;
}
interface Response {
    statusCode: number;
    body: string;
}
export declare const handler: middy.MiddyfiedHandler<Event, Response, Error, import("aws-lambda").Context>;
export {};
