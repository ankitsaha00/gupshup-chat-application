import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
        console.error("❌ Unauthorized: No user ID found");
        throw new Error("Unauthorized");
    }

    
    return { userId };
};

export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            console.log("🔹 Middleware running for serverImage");
            return await handleAuth();
        })
        .onUploadComplete(({ metadata, file }) => {
            
            return { url: file.ufsUrl };
        }),

    messageFile: f(["image", "pdf"])
        .middleware(async () => {
            console.log("🔹 Middleware running for messageFile");
            return await handleAuth();
        })
        .onUploadComplete(({ metadata, file }) => {
        
            return { url: file.ufsUrl };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
