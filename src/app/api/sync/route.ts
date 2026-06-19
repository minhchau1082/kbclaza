import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Using /tmp or a local file to store the sync data
const SYNC_FILE_PATH = path.join(process.cwd(), 'data_sync.json');

export async function GET() {
    try {
        if (!fs.existsSync(SYNC_FILE_PATH)) {
            return NextResponse.json({ data: {} });
        }
        const fileContent = fs.readFileSync(SYNC_FILE_PATH, 'utf-8');
        return NextResponse.json({ data: JSON.parse(fileContent) });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { key, data } = body;

        let currentData: any = {};
        if (fs.existsSync(SYNC_FILE_PATH)) {
            currentData = JSON.parse(fs.readFileSync(SYNC_FILE_PATH, 'utf-8'));
        }

        currentData[key] = data;
        fs.writeFileSync(SYNC_FILE_PATH, JSON.stringify(currentData, null, 2), 'utf-8');

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
    }
}
