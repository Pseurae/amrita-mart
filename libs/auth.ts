import path from "path";
import fs from 'fs';
import { parse, stringify } from '@iarna/toml';
import { createCipheriv, randomUUID } from "crypto";
import { User } from "@/types/user-auth";
import { LoginStatus, RegisterStatus } from '@/types/user-auth'
import { env } from "process";
import { createToken } from "@/libs/user-token";

export const USERS_FOLDER = path.join(process.cwd(), "data", "users");

const encryptPassword = (password: string) => {
    let cipher = createCipheriv('aes-256-cbc', env.ENCRYPTION_KEY!, "5183666c72eec9e4");
    let encrypted = cipher.update(password, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

export const registerUser = (username: string, fullname: string, email: string, password: string) => {
    const filePath = path.join(USERS_FOLDER, username + '.toml');
    if (fs.existsSync(filePath))
        return { status: RegisterStatus.USERNAME_EXISTS };

    if (!fs.existsSync(USERS_FOLDER)) {
        fs.mkdirSync(USERS_FOLDER, { recursive: true });
    }

    const user: User = {
        username,
        fullname,
        email,
        passwordHash: encryptPassword(password),
        dataId: randomUUID()
    };

    fs.writeFileSync(filePath, stringify(user as any), 'utf-8');
    const token = createToken(user.username, user.dataId);
    return { status: RegisterStatus.SUCCESS, token };
}

export const getUser = (username: string): User | undefined => {
    const filePath = path.join(USERS_FOLDER, username + '.toml');
    if (!fs.existsSync(filePath))
        return undefined;

    const user = parse(fs.readFileSync(filePath, 'utf-8')) as any as User;
    return user;
}

export const loginUser = (username: string, password: string) => {
    const user = getUser(username);
    if (user == undefined) return { status: LoginStatus.USERNAME_INVALID };

    if (user.username != username) return { status: LoginStatus.USERNAME_INVALID }; // Filenames aren't case sensitive
    if (user.passwordHash != encryptPassword(password)) return { status: LoginStatus.PASSWORD_INVALID };

    const token = createToken(user.username, user.dataId);

    return { status: LoginStatus.SUCCESS, token };
};
