import {BaseUser} from "../core/type/common";

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    mbti: string;
    gender?: 'male' | 'female';
}

export interface User extends BaseUser {
    passwordHash?: string;
    emailVerified: boolean;
    disabled: boolean;
}
