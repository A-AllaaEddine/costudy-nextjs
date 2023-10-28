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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import DeleteTicketModal from '../modals/ticket/DeleteTicketModal';
import TicketDetailsModal from '../modals/ticket/TicketDetails';
import TicketStatusModal from '../modals/ticket/TicketStatusModal';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function TicketsTable<TData, TValue>({
  columns,
  data,
  fetchPreviousPage,
  fetchNextPage,
  isFetching,
  refetchTickets,
}: DataTableProps<TData, TValue> & {
  fetchPreviousPage?: any;
  fetchNextPage?: any;
  refetchTickets?: any;
  isFetching?: any;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // modals
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [ticketId, setTicketId] = useState<string>('');

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
          value={(table.getColumn('subject')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('subject')?.setFilterValue(event.target.value)
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
                          setIsDetailsModalOpen,
                          setIsStatusModalOpen,
                          setIsDeleteModalOpen,
                          setTicketId,
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
      <TicketStatusModal
        isOpen={isStatusModalOpen}
        setIsOpen={setIsStatusModalOpen}
        ticketId={ticketId}
        refetchTickets={refetchTickets}
      />
      <TicketDetailsModal
        isOpen={isDetailsModalOpen}
        setIsOpen={setIsDetailsModalOpen}
        ticketId={ticketId}
        refetchTickets={refetchTickets}
      />
      <DeleteTicketModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        ticketId={ticketId}
        refetchTickets={refetchTickets}
      />
    </div>
  );
}
