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
import moment from 'moment';
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
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const title = row.getValue('title');
      return (
        <div className="w-[120px] truncate overflow-hidden">
          {title! as string}
        </div>
      );
    },
  },
  {
    accessorKey: 'class',
    header: 'Class',
  },
  {
    accessorKey: 'major',
    header: 'Majpr',
    cell: ({ row }) => {
      const major = row.getValue('major');
      return (
        <div className="w-[80px] truncate overflow-hidden">
          {major! as string}
        </div>
      );
    },
  },
  {
    accessorKey: 'degree',
    header: 'Degree',
    cell: ({ row }) => {
      const degree = row.getValue('degree');
      return (
        <div className="w-[80px] truncate overflow-hidden">
          {degree! as string}
        </div>
      );
    },
  },
  {
    accessorKey: 'year',
    header: 'Year',
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:cursor-pointer  font-semibold"
              onClick={() => {
                props.setIsEditModalOpen(true);
                props.setUserId(props.row.original.id);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer font-semibold"
              onClick={() => {
                props.setIsResetModalOpen(true);
                props.setUserId(props.row.original.id);
              }}
            >
              Change password
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer font-semibold"
              onClick={() => {
                props.setIsStatusModalOpen(true);
                props.setUserId(props.row.original.id);
              }}
            >
              Change status
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-md hover:cursor-pointer 
             text-[#ff5e52] font-semibold sm:text-md text-sm hover:bg-[#ff5e52]
              hover:text-white"
              onClick={() => {
                props.setIsDeleteModalOpen(true);
                props.setUserId(props.row.original.id);
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
