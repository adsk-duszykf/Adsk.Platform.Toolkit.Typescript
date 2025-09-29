import { type RequestOption } from "@microsoft/kiota-abstractions";

export const ErrorHandlerOptionKey = "ErrorHandlerOptionKey";
export class ErrorHandlerOptions implements RequestOption {
    constructor(public enabled: boolean = true) { }

    getKey(): string {
        return ErrorHandlerOptionKey;
    }
}