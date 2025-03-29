import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";


export const MobileToggle = ({ serverId }: { serverId: string }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex h-full w-[260px]">
            <SheetTitle className="text-lg font-semibold p-3">Server Sidebar</SheetTitle>

                <div className="w-[72px] flex-shrink-0">
                    <NavigationSidebar />
                </div>
                <div className="flex-1 overflow-hidden">
                    <ServerSidebar serverId={serverId} />
                </div>
            </SheetContent>
        </Sheet>
    );
};
