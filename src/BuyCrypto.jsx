import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { PayEmbed } from "thirdweb/react";
import { client } from "./thirdweb";

const BuyCrypto = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="m-1 text-black">
          Purchase Crypto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crypto</DialogTitle>
          <DialogDescription>Purchase Crypto here</DialogDescription>
        </DialogHeader>
        <PayEmbed client={client} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default BuyCrypto;
