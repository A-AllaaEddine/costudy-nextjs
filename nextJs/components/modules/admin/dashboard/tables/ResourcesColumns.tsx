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
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const title = row.getValue('title');
      return (
        <div className="w-[120px] font-normal truncate overflow-hidden">
          {title! as string}
        </div>
      );
    },
  },
  {
    accessorKey: 'class',
    header: 'Class',
    cell: ({ row }) => {
      const clas = row.getValue('class');
      return (
        <div className="w-[80px] font-normal truncate overflow-hidden">
          {clas! as string}
        </div>
      );
    },
  },
  {
    accessorKey: 'major',
    header: 'Major',
    cell: ({ row }) => {
      const major = row.getValue('major');
      return (
        <div className="w-[80px] font-normal truncate overflow-hidden">
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
        <div className="w-[80px] font-normal truncate overflow-hidden">
          {degree! as string}
        </div>
      );
    },
  },
  {
    accessorKey: 'year',
    header: 'Year',
    cell: ({ row }) => {
      const year = row.getValue('year');
      return (
        <div className="w-[80px] font-normal truncate overflow-hidden">
          {year! as string}
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
              className="hover:cursor-pointer  font-normal"
              onClick={() => {
                props.setIsFileModalOpen(true);
                props.setSelectResource(props.row.original);
              }}
            >
              Edit File
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer font-normal"
              onClick={() => {
                props.setIsThumbModalOpen(true);
                props.setSelectResource(props.row.original);
              }}
            >
              Edit Thumbnail
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer font-normal"
              onClick={() => {
                props.setIsInfoModalOpen(true);
                props.setSelectResource(props.row.original);
              }}
            >
              Edit Infos
            </DropdownMenuItem>{' '}
            <DropdownMenuItem
              className="hover:cursor-pointer font-normal"
              onClick={() => {
                props.setIsViewsModalOpen(true);
                props.setSelectResource(props.row.original);
              }}
            >
              Views
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer font-normal"
              onClick={() => {
                props.setIsDownloadsModalOpen(true);
                props.setSelectResource(props.row.original);
              }}
            >
              Downloads
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-md hover:cursor-pointer 
             text-[#ff5e52] font-normal sm:text-md text-sm hover:bg-[#ff5e52]
              hover:text-white"
              onClick={() => {
                props.setIsDeleteModalOpen(true);
                props.setSelectResource(props.row.original);
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
