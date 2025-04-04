import { pinata } from "@/lib/pinata";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File|null = data.get('file') as unknown as File;

        // const url = await pinata.upload.public.createSignedURL({ expires: 300 });
        const upload = await pinata.upload.public.file(file);
        const url = await pinata.gateways.public.convert(upload.cid);

        return NextResponse.json({
            message: "Uploaded successfully",
            url: url
        }, { status: 200 })
    } catch (e) {
        console.log(e);
        
        return NextResponse.json({
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}