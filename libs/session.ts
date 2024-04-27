import path from 'path';
import fs from 'fs';

import { Session } from '@/types/session'
import { getDataForToken } from './user-token';
import { parse, stringify } from '@iarna/toml';

const SESSIONS_FOLDER = path.join("data", "sessions");

function loadSession(id: string): Session | undefined {
    const filePath = path.join(SESSIONS_FOLDER, id + '.toml');
    if (!fs.existsSync(filePath))
        return undefined;

    return parse(fs.readFileSync(filePath, 'utf-8')) as any as Session;
}

function saveSession(id: string, session: Session) {
    if (!fs.existsSync(SESSIONS_FOLDER)) {
        fs.mkdirSync(SESSIONS_FOLDER, { recursive: true });
    }

    const filePath = path.join(SESSIONS_FOLDER, id + '.toml');
    fs.writeFileSync(filePath, stringify(session as any));
}

export function getSessionFromToken(token: string): Session | undefined {
    const tokenData = getDataForToken(token);
    if (tokenData == undefined) return undefined;
    return loadSession(tokenData.dataId);
}

export function saveSessionForToken(token: string, session: Session) {
    const tokenData = getDataForToken(token);
    if (tokenData == undefined) return;
    return saveSession(tokenData.dataId, session);
}