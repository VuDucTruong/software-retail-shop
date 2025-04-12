

import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";


export default function TableCellViewer() {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" className="w-fit px-0 text-left text-inherit">
            
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader className="gap-1">
            <SheetTitle></SheetTitle>
            <SheetDescription>
              Showing total visitors for the last 6 months
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
              Main Content
          </div>
          <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
            <Button className="w-full">Submit</Button>
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Done
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }