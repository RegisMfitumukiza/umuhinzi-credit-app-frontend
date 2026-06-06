import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

import { useAddCooperativeMember } from "../hooks/useAddCooperativeMember";
import { addMemberSchema, type AddMemberSchemaType } from "../schemas/cooperative.schema";
import { useState } from "react";

type Props = { cooperativeId: string };

export const AddMemberDialog = ({ cooperativeId }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, error } = useAddCooperativeMember();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMemberSchemaType>({
    resolver: zodResolver(addMemberSchema),
  });

  const onSubmit = (data: AddMemberSchemaType) => {
    mutate(
      { cooperativeId, farmerId: data.farmerId },
      {
        onSuccess: () => {
          toast.success("Member added successfully.");
          reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Add member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a farmer</DialogTitle>
          <DialogDescription>
            Enter the farmer's ID to add them directly as an active member.
            Farmers can also join by discovering your cooperative and requesting
            membership — those requests appear in the Requests tab.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="farmer-id">Farmer ID</Label>
            <Input
              id="farmer-id"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              autoFocus
              {...register("farmerId")}
            />
            {errors.farmerId && (
              <p className="text-sm text-destructive">{errors.farmerId.message}</p>
            )}
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
