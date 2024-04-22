import { CartItem } from "./cartitem";

export type User = {
    userName: string;
    fullName: string;
    email: string;
    passwordHash: string | number;

    currentCart: CartItem[];

    cakeOrders: string[];
    productOrders: string[];
};

export type UserRegister = {
    username: string;
    fullname: string;
    email: string;
    password: string;
};

export enum LoginStatus {
    SUCCESS,
    USERNAME_INVALID,
    PASSWORD_INVALID
};

export enum RegisterStatus {
    SUCCESS,
    USERNAME_EXISTS,
};