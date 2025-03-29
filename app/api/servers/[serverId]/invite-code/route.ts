import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface ServerIdRouteProps {
    params: Promise<{ serverId: string }>;
}

export async function PATCH(
    req: Request,
    {params}: ServerIdRouteProps
) {
    try {
        const {serverId} = await params;
        const profile = await currentProfile();

        if(!profile) {
            return new NextResponse("Unauthorized", {status: 400});
    }

    if (!serverId) {
        return new NextResponse("Server ID Missing", { status: 400});
    }

    const server= await db.server.update({
        where: {
            id: serverId,
            profileId: profile.id,
        },
        data: {
            inviteCode: uuidv4(),
        },
    });
     return NextResponse.json(server);
     
    } catch(error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", { status: 500});
    }
}