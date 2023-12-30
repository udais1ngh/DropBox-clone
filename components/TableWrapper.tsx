"use client";
import { FileType } from "@/typings";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DataTable } from "./table/Table";
import { columns } from "./table/columns";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const TableWrapper = ({ skeleton }: { skeleton: FileType[] }) => {
  const { user } = useUser();
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [initialFiles, setInitialFiles] = useState<FileType[]>([]);

  const [docs, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user.id, "files"),
        orderBy("timestamp", sort)
      )
  );

  useEffect(() => {
    if (!docs) return;
    const files: FileType[] = docs.docs.map((doc) => ({
      id: doc.id,
      filename: doc.data().filename || doc.id,
      timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
      fullname: doc.data().fullName,
      downloadURL: doc.data().downloadURL,
      type: doc.data().type,
      size: doc.data().size,
    }));

    setInitialFiles(files);
  }, [docs]);

  if (docs?.docs.length === undefined)
    return (
      <div>
        <Button variant={"outline"} className="w-36 h-10 mb-5">
          <Skeleton className="h-6 w-full" />
        </Button>

        <div className="border rounded-lg">
          <div>
            {skeleton.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-4 p-5 w-full"
              >
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
            {skeleton.length === 0 && (
              <div className="flex items-center space-x-4 p-5 w-full">
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-12 w-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <Button
        variant={"outline"}
        className="mb-3"
        onClick={() => setSort(sort == "desc" ? "asc" : "desc")}
      >
        Sort By {sort === "desc" ? "Newest" : "Oldest"}
      </Button>
      <DataTable columns={columns} data={initialFiles} />
    </div>
  );
};

export default TableWrapper;
