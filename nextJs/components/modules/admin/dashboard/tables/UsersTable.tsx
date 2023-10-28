'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
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
import DeleteUserModal from '../modals/user/DeleteUserModal';

import { Button } from '@/components/ui/button';
import EditUserModal from '../modals/user/EditUserModal';
import ResetPasswordModal from '../modals/user/ResetPasswordModal';
import UserStatusModal from '../modals/user/UserStatusModal';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function UsersTable<TData, TValue>({
  columns,
  data,
  refetchUsers,
  fetchPreviousPage,
  fetchNextPage,
  isFetching,
  hasNextPage,
  hasPreviousPage,
}: DataTableProps<TData, TValue> & {
  refetchUsers?: any;
  fetchPreviousPage?: any;
  fetchNextPage?: any;
  isFetching?: any;
  hasNextPage?: any;
  hasPreviousPage?: any;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [userId, setUserId] = useState<string>('');

  // modals
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      rowSelection,
      sorting,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
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
                          setIsEditModalOpen,
                          setIsDeleteModalOpen,
                          setIsResetModalOpen,
                          setIsStatusModalOpen,
                          setUserId,
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
              // table.previousPage();
              fetchPreviousPage();
            }}
            disabled={!hasPreviousPage}
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
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
      <EditUserModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        userId={userId}
        refetchUsers={refetchUsers}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        userId={userId}
        refetchUsers={refetchUsers}
      />

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        setIsOpen={setIsResetModalOpen}
        userId={userId}
        //   refetchUsers={refetchUsers}
      />

      <UserStatusModal
        isOpen={isStatusModalOpen}
        setIsOpen={setIsStatusModalOpen}
        userId={userId}
        refetchUsers={refetchUsers}
      />
    </div>
  );
}
