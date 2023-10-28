import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { IoMdMore } from 'react-icons/io';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => {
      const reason = row.getValue('reason');
      return (
        <div className="w-[120px] font-normal truncate overflow-hidden">
          {reason! as string}
        </div>
      );
    },
  },
  {
    accessorKey: 'tag',
    header: 'Tag',
    cell: ({ row }) => {
      const tag = row.getValue('tag');
      return (
        <div className="w-[80px] font-normal truncate overflow-hidden">
          {tag! as string}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      return (
        <div
          className={`${
            bgReport[status as string]
          } w-[80px] font-normal truncate overflow-hidden`}
        >
          {status! as string}
        </div>
      );
    },
  },

  {
    id: 'actions',
    cell: (props: any) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IoMdMore className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="hover:cursor-pointer font-normal"
              onClick={() => {
                props.setIsStatusModalOpen(true);
                props.setReportId(props.row.original.id);
              }}
            >
              Change status
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-md hover:cursor-pointer 
             text-[#ff5e52] font-normal sm:text-md text-sm hover:bg-[#ff5e52]
              hover:text-white"
              onClick={() => {
                props.setIsDeleteModalOpen(true);
                props.setReportId(props.row.original.id);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const bgReport: Record<string, string> = {
  New: 'bg-yellow-300',
  Assigned: 'bg-purple-300',
  'In Progress': 'bg-purple-300',
  Resolved: 'bg-green-300',
  Closed: 'bg-purple-300',
  Reopened: 'bg-purple-300',
  Deferred: 'bg-purple-300',
  Duplicate: 'bg-orange-300',
};
