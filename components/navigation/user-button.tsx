"use client";

import { UserButton } from "@clerk/nextjs";

export const UserButtonClient = () => {
    return (
        <UserButton
            appearance={{
                elements: {
                    avatarBox: "h-[48px] w-[48px]"
                }
            }}
        />
    );
};
