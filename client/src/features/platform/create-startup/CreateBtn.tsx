import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { FaPlus } from "react-icons/fa";
import CreateStartup from "./CreateStartup";

export function CreateBtn() {
    return (
      <div className="fixed bottom-20 right-5 z-50 md:bottom-5">
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="shadow-lg transition-all duration-200 w-14 h-14 rounded-full p-0 bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 sm:w-auto sm:h-auto sm:rounded-full sm:px-6 sm:py-3 sm:gap-2 sm:text-base sm:font-semibold"
              aria-label="Create startup"
            >
              <FaPlus className="h-6 w-6 m-auto sm:mr-2 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Create startup</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full">
            <DrawerHeader>
              <DrawerTitle>Create your startup</DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <CreateStartup />
          </DrawerContent>
        </Drawer>
      </div>
    );
  }