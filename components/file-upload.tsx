"use client"

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
    const urlParts = value?.split("?type="); 
    const fileType = urlParts.length > 1 ? urlParts[1] : undefined;

    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-20 w-20 object-cover">
                <Image 
                    fill
                    src={urlParts[0]} // Use only the URL, without type
                    alt="Upload"
                    className="rounded-full"
                />
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4"/>
                </button>
            </div>
        );
    }

    if (value && fileType === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                <a 
                    href={urlParts[0]} // Use only the URL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    Open PDF
                </a>
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <UploadDropzone 
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                if (res?.[0]?.ufsUrl) {
                    const fileName = res[0].name; 
                    const fileType = fileName.split(".").pop()?.toLowerCase();
                    onChange(res[0].ufsUrl + "?type=" + fileType);
                }
            }}
        />
    );
};
