import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { LandingContent } from "@/components/landing-content";

export default async function LandingPage() {
  const profile = await currentProfile();

  if (profile) {
    const server = await db.server.findFirst({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });

    if (server) {
      return redirect(`/servers/${server.id}`);
    }
    return redirect("/create-server");
  }

  return <LandingContent />;
}