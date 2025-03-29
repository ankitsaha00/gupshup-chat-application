import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Define the props type with params as a Promise
interface InviteCodePageProps {
    params: Promise<{ inviteCode: string }>;
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
    // Resolve the params Promise
    const { inviteCode } = await params;

    const profile = await currentProfile();

    if (!profile) {
        return <RedirectToSignIn />;
    }

    if (!inviteCode) {
        return redirect("/");
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.findFirst({
        where: {
            inviteCode: inviteCode,
        },
    });

    if (!server) {
        return redirect("/");
    }

    await db.server.update({
        where: {
            id: server.id,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    },
                ],
            },
        },
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return null;
};

export default InviteCodePage;