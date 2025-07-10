import {registerAs} from '@nestjs/config';

import {IsString} from 'class-validator';
import {AuthConfig} from './auth-config.type';
import { validateConfig } from "@common/utils/validation.util";

class EnvironmentVariablesValidator {
    @IsString()
    WALLET_SECRET_KEY: string;
}

export default registerAs<AuthConfig>('web3', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        secret: process.env.WALLET_SECRET_KEY,
    };
});
