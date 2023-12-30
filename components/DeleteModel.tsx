"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db, storage } from "@/firebase";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

export function DeleteModal() {
  const [fileId, setFileId, isDeleteModel, setIsDeleteModal] = useAppStore(
    (state) => [
      state.fileId,
      state.setFileId,
      state.isDeleteModel,
      state.setIsDeleteModal,
    ]
  );

  const { user } = useUser();

  async function deleteFile() {
    if (!user || !fileId) return;

    const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);

    await deleteObject(fileRef).then(async () => {
      console.log("Deleted File");
      deleteDoc(doc(db, "users", user.id, "files", fileId));
    });

    setIsDeleteModal(false);
  }

  return (
    <Dialog
      open={isDeleteModel}
      onOpenChange={(isOpen) => {
        setIsDeleteModal(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            You will permanently delete your file!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Button
            className="px-3 flex-1 "
            size="sm"
            variant={"ghost"}
            onClick={() => setIsDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="px-3 flex-1"
            size="sm"
            type="submit"
            onClick={() => deleteFile()}
          >
            Delete
          </Button>

        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
