export class Logger {
    constructor(private context: string) {}

    info(message: string, data?: any) {
        console.log(`[${this.context}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }

    error(message: string, error?: any) {
        console.error(`[${this.context} Error] ${message}`, error);
    }
}
