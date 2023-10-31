'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EditInfoModal from '../modals/resource/EditInfoModal';
import EditThumbnail from '../modals/resource/EditThumbnail';
import EditFileModal from '../modals/resource/EditFileModal';
import DeleteResourceModal from '../modals/resource/DeleteResourceModal';
import DownloadsModal from '../modals/resource/DownloadsModal';
import ViewsModal from '../modals/resource/ViewsModal';
import { Resource } from '@/types/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IoMdMore } from 'react-icons/io';
import BatchDeleteResourceModal from '../modals/resource/BatchDeleteResourceModal';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ResourcesTable<TData, TValue>({
  columns,
  data,
  fetchPreviousPage,
  fetchNextPage,
  isFetching,
  refetchResources,
  hasNextPage,
}: DataTableProps<TData, TValue> & {
  fetchPreviousPage?: any;
  fetchNextPage?: any;
  refetchResources?: any;
  isFetching?: any;
  hasNextPage?: any;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [userId, setUserId] = useState<string>('');

  // modals
  const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false);
  const [isThumbModalOpen, setIsThumbModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isViewsModalOpen, setIsViewsModalOpen] = useState<boolean>(false);
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] =
    useState<boolean>(false);
  const [isBatchDeleteModalOpen, setIBatchDeleteModalOpen] =
    useState<boolean>(false);

  const [selectedResource, setSelectResource] = useState<Resource | undefined>(
    undefined
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    // getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      // columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="w-full h-10 flex justify-end items-center gap-5">
        {table.getFilteredSelectedRowModel().rows.length ? (
          <div className="w-auto h-8 flex justify-center items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-auto px-2">
                  <span className="">Actions</span>
                  <IoMdMore className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="rounded-md hover:cursor-pointer 
             text-[#ff5e52] font-normal sm:text-md text-sm hover:bg-[#ff5e52]
              hover:text-white"
                  onClick={() => {
                    setIBatchDeleteModalOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
        <div className=" w-auto  h-8 flex items-center text-end text-md font-normal text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
      <div>
        <div className="w-full rounded-md border font-semibold">
          <InfiniteScroll
            className="w-full h-full flex flex-col"
            dataLength={table.getRowModel().rows?.length!}
            hasMore={hasNextPage}
            next={fetchNextPage}
            loader={
              isFetching &&
              Array.from({ length: 2 }, (_, i) => i).map((_, idx) => {
                return (
                  <TableRow key={idx}>
                    {Array.from({ length: 5 }, (_, i) => i).map((_, idx) => {
                      return (
                        <TableCell key={idx}>
                          <Skeleton className="h-6 w-2/3 rounded-md" />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            }
          >
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
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, {
                            ...cell.getContext(),
                            setIsFileModalOpen,
                            setIsThumbModalOpen,
                            setIsInfoModalOpen,
                            setIsDeleteModalOpen,
                            setIsViewsModalOpen,
                            setIsDownloadsModalOpen,
                            setSelectResource,
                          })}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
                {/* {isFetching ? (
                  Array.from({ length: 6 }, (_, i) => i).map((_, idx) => {
                    return (
                      <TableRow key={idx}>
                        {Array.from({ length: 6 }, (_, i) => i).map(
                          (_, idx) => {
                            return (
                              <TableCell key={idx}>
                                <Skeleton className="h-6 w-2/3 rounded-md" />
                              </TableCell>
                            );
                          }
                        )}
                      </TableRow>
                    );
                  })
                ) : table.getRowModel().rows?.length ? (
                 } */}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </div>
        {/* <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
              fetchPreviousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
              fetchNextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div> */}
      </div>
      <ViewsModal
        isOpen={isViewsModalOpen}
        setIsOpen={setIsViewsModalOpen}
        resource={selectedResource!}
      />
      <DownloadsModal
        isOpen={isDownloadsModalOpen}
        setIsOpen={setIsDownloadsModalOpen}
        resource={selectedResource!}
      />
      <DeleteResourceModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        resource={selectedResource!}
        refetchResources={refetchResources}
      />
      <EditFileModal
        isOpen={isFileModalOpen}
        setIsOpen={setIsFileModalOpen}
        resource={selectedResource!}
        refetchResources={refetchResources}
      />
      <EditThumbnail
        isOpen={isThumbModalOpen}
        setIsOpen={setIsThumbModalOpen}
        resource={selectedResource!}
        refetchResources={refetchResources}
      />
      <EditInfoModal
        isOpen={isInfoModalOpen}
        setIsOpen={setIsInfoModalOpen}
        resource={selectedResource!}
        refetchResources={refetchResources}
      />
      <BatchDeleteResourceModal
        isOpen={isBatchDeleteModalOpen}
        setIsOpen={setIBatchDeleteModalOpen}
        resourcesIds={table
          .getSelectedRowModel()
          .rows.map((row) => (row.original as any).id)}
        refetchResources={refetchResources}
      />
    </div>
  );
}
