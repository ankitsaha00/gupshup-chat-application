import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
    params: {
        serverid: string;
    };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
    // Simulate "awaiting" params by wrapping in an async IIFE
    const { serverid } = await (async () => Promise.resolve(params))();

    if (!serverid) {
        return null;
    }

    const profile = await currentProfile();
    if (!profile) {
        return <RedirectToSignIn />;
    }

    const server = await db.server.findUnique({
        where: {
            id: serverid,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
        include: {
            channels: {
                where: {
                    name: "general",
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!server) {
        return null;
    }

    const initialChannel = server.channels[0];
    if (!initialChannel || initialChannel.name !== "general") {
        return null;
    }

    return redirect(`/servers/${serverid}/channels/${initialChannel.id}`);
};

export default ServerIdPage;