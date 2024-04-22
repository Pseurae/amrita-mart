import path from "path";
import fs from 'fs';
import { parse, stringify } from '@iarna/toml';
import { randomUUID, publicDecrypt, publicEncrypt, createCipheriv } from "crypto";
import { LoginStatus, RegisterStatus, User, UserRegister } from "@/types/user";
import { env } from "process";

export const USERS_FOLDER = path.join(process.cwd(), "users");

const encryptPassword = (password: string) => {
    let cipher = createCipheriv('aes-256-cbc', env.ENCRYPTION_KEY!, "5183666c72eec9e4");
    let encrypted = cipher.update(password, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

export const registerUser = (user: UserRegister) => {
    const solidUser: User = {
        userName: user.username,
        fullName: user.fullname,
        email: user.email,
        passwordHash: encryptPassword(user.password),
        cakeOrders: [],
        currentCart: [],
        productOrders: []
    };

    if (!fs.existsSync(USERS_FOLDER)) {
        fs.mkdirSync(USERS_FOLDER, { recursive: true });
    }

    const filePath = path.join(USERS_FOLDER, user.username + '.toml');
    if (fs.existsSync(filePath))
        return { status: RegisterStatus.USERNAME_EXISTS };

    fs.writeFileSync(filePath, stringify(solidUser as any), 'utf-8');

    return { status: RegisterStatus.SUCCESS, user: solidUser };
}

export const loginUser = (username: string, password: string) => {
    const filePath = path.join(USERS_FOLDER, username + '.toml');
    if (!fs.existsSync(filePath))
        return { status: LoginStatus.USERNAME_INVALID };

    const user = parse(fs.readFileSync(filePath, 'utf-8')) as User;
    
    if (user.userName != username) return { status: LoginStatus.USERNAME_INVALID }; // Filenames aren't case sensitive
    if (user.passwordHash != encryptPassword(password)) return { status: LoginStatus.PASSWORD_INVALID };

    return { status: LoginStatus.SUCCESS, user };
};


export const updateUser = (user: User) => {
    const filePath = path.join(USERS_FOLDER, user.userName + '.toml');
    fs.writeFileSync(filePath, stringify(user as any), 'utf-8');
}