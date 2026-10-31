"use client";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { toast } from "react-toastify";
import { Button } from "./ui/button";

const DeleteStudiosDialoge = ({ id }: { id: string }) => {
  const router = useRouter();

  const handleDeleteStudios = async () => {
  try {
    const res = await fetch(
      `http://localhost:8000/exploreStudios/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Delete failed");
    }

    toast.success("Studio deleted successfully!");

    router.push("/explore");

  } catch (error) {
    console.error(error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to delete studio!"
    );
  }
};

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete</Button>}
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This studio will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleDeleteStudios}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStudiosDialoge;