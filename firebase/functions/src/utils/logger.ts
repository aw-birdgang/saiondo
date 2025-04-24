export class Logger {
    constructor(private context: string) {}

    info(message: string, data?: any) {
        console.log(`[${this.context}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }

    error(message: string, error?: any) {
        console.error(`[${this.context} Error] ${message}`, error);
        if (error?.stack) {
            console.error(error.stack);
        }
    }

    warn(message: string, data?: any) {
        console.warn(`[${this.context} Warning] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }

    debug(message: string, data?: any) {
        console.debug(`[${this.context} Debug] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
}
