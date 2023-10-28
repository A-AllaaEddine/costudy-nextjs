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
}: DataTableProps<TData, TValue> & {
  fetchPreviousPage?: any;
  fetchNextPage?: any;
  refetchResources?: any;
  isFetching?: any;
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

  const [selectedResource, setSelectResource] = useState<Resource | undefined>(
    undefined
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter resources..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="flex-1 w-full h-8 text-end text-md font-normal text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div>
        <div className="w-full rounded-md border font-semibold">
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
              {isFetching ? (
                Array.from({ length: 6 }, (_, i) => i).map((_, idx) => {
                  return (
                    <TableRow key={idx}>
                      {Array.from({ length: 6 }, (_, i) => i).map((_, idx) => {
                        return (
                          <TableCell key={idx}>
                            <Skeleton className="h-6 w-2/3 rounded-md" />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : table.getRowModel().rows?.length ? (
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
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
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
        </div>
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
    </div>
  );
}
