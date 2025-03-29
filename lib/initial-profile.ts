import { auth } from "@clerk/nextjs/server"; // Correct import
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server"; // Use the server-side function

export const initialProfile = async () => {
    const { userId } = await auth();  // ⬅️ Await the auth function

    if (!userId) {
        return redirect("/sign-in");  
    }

    // Fetch user details from Clerk
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    });

    if (profile) {
        return profile;
    }

    const newProfile = await db.profile.create({
        data: {
            userId,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            imageUrl: user.imageUrl || "",
            email: user.emailAddresses[0]?.emailAddress || "",
        }
    });

    return newProfile;
};
