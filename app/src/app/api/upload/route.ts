import { pinata } from "@/lib/pinata";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const upload = await pinata.upload.public.file(data.get('file') as File);
        const url = await pinata.gateways.public.convert(upload.cid);

        return NextResponse.json({ url: url }, { status: 200 })
    } catch (e) {
        console.error(`An error occurred when trying to upload file to Pinata`, e);
        return NextResponse.json({
            message: "Something went wrong"
        }, { status: 500 })
    }
}