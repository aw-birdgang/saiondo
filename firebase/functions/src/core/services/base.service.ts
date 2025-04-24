import { Logger } from '../utils/logger';

export abstract class BaseService {
    protected logger: Logger;

    constructor() {
        this.logger = new Logger(this.constructor.name);
    }
}
