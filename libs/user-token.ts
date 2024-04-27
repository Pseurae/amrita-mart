import { CartItem } from "@/types/cartitem";
import path from "path";
import fs from "fs";
import { parse, stringify } from "@iarna/toml";
import { UserTokenData, UserTokens } from "@/types/user-auth";
import { randomUUID } from "crypto";

const USERTOKENS_FILE = path.join("data", "tokens.toml");

//
function loadValidTokens(): UserTokens {
    try {
        return parse(fs.readFileSync(USERTOKENS_FILE, 'utf-8')).tokens as UserTokens;
    } catch (e) {}

    return {};
}

function writeTokens(tokens: UserTokens) {
    if (!fs.existsSync(path.dirname(USERTOKENS_FILE))) {
        fs.mkdirSync(path.dirname(USERTOKENS_FILE), { recursive: true });
    }

    fs.writeFileSync(USERTOKENS_FILE, stringify({ tokens } as any), 'utf-8');
}

const changeTokens = (func: (val: UserTokens) => UserTokens = ((val) => val)) => {
    const tokens = loadValidTokens();
    writeTokens(func(tokens));
}

// 
export function checkIfTokenValid(token: string): boolean {
    const tokens = loadValidTokens();
    return token in tokens;
}

export function getDataForToken(token: string): UserTokenData | undefined {
    const tokens = loadValidTokens();
    return tokens[token];
}

export function createToken(username: string, dataId: string): string {
    const token = randomUUID();
    changeTokens((tokens) => ({ ...tokens, [token]: ({ username, dataId }) }));
    return token;
}

export function invalidateToken(token: string) {
    changeTokens((tokens) => {
        const { [token]: _, ...newTokens } = tokens;
        return newTokens;
    });
}

export function checkForUserToken(username: string) : string | undefined {
    const tokens: UserTokens = loadValidTokens();

    for (const [token, tokenData] of Object.entries(tokens)) {
        if (tokenData.username == username) return token;
    }

    return undefined;
}

export function tryCreateToken(username: string, dataId: string) : string {
    const tokens = loadValidTokens();

    for (const [token, tokenData] of Object.entries(tokens)) {
        if (tokenData.username == username) return token;
    }

    const token = randomUUID();
    writeTokens({ ...tokens, [token]: ({ username, dataId }) });

    return token; 
}