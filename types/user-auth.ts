export enum LoginStatus {
    SUCCESS,
    USERNAME_INVALID,
    PASSWORD_INVALID
};

export enum RegisterStatus {
    SUCCESS,
    USERNAME_EXISTS,
};

export interface User {
    username: string;
    fullname: string;
    email: string;
    passwordHash: string;
    dataId: string;
};

export interface UserDetails {
    username: string;
    fullname: string;
    email: string;
};

// Payload for login and register
export interface UserPayload {
    username: string;
    fullname?: string;
    email: string;
    password: string;
};

export type UserToken = string;
export type UserTokenData = {
    username: string,
    dataId: string
};

export interface UserTokens {
    [userId: UserToken]: UserTokenData;
};