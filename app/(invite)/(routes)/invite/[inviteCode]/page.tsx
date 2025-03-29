import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async ({
    params
}:InviteCodePageProps) => {

    const profile = await currentProfile();

    if(!profile) {
        return <RedirectToSignIn />;
    }

    if(!params.inviteCode){
        return redirect("/");
    }
    const existngServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if(existngServer) {
        return redirect(`/servers/${existngServer.id}`);
    }

    const server= await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
        }
    });

    if(!server){
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
                    }
                ]
            }
        }
    });

    if(server) {
        return redirect(`/servers/${server.id}`);
    }  

    return null;
    }
 
export default InviteCodePage;