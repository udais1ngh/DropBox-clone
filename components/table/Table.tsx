"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileType } from "@/typings";
import { Button } from "../ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { DeleteModal } from "../DeleteModel";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [fileId, setFileId, isDeleteModel, setIsDeleteModal] = useAppStore(
    (state) => [
      state.fileId,
      state.setFileId,
      state.isDeleteModel,
      state.setIsDeleteModal,
    ]
  );

  const openDeleteModel = (fileId: string) => {
    setFileId(fileId);
    setIsDeleteModal(true);
  };

  

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                <DeleteModal/>
                
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === "timestamp" ? (
                      <div className=" flex flex-col">
                        <div>
                          {(cell.getValue() as Date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(cell.getValue() as Date).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : cell.column.id === "filename" ? (
                      <p className="underline flex items-center text-blue-500 hover:cursor-pointer">
                        {cell.getValue() as string}{" "}
                      </p>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}

                <TableCell key={(row.original as FileType).id}>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      openDeleteModel((row.original as FileType).id);
                    }}
                  >
                    <TrashIcon size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
