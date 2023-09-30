import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { IoMdMore } from 'react-icons/io';

const statusBgColor: Record<string, string> = {
  active: 'bg-green-300',
  suspended: 'bg-yellow-300',
  banned: 'bg-red-300',
};

export const columns: ColumnDef<User>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'accountStatus',
    header: 'Account Status',
    cell: ({ row }) => {
      const accountStatus = row.getValue('accountStatus');
      return (
        <div className="w-[100px] flex justify-center items-center">
          <p
            className={`font-semibold text-md pt-1 pb-1 pr-2 pl-2 w-auto 
          text-center rounded-lg
          ${statusBgColor[accountStatus! as string]}`}
          >
            {accountStatus?.toString().charAt(0).toUpperCase()! +
              accountStatus?.toString().slice(1)!}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'emailVerified',
    header: 'Email Verified',
    cell: ({ row }) => {
      const emailVerified = row.getValue('emailVerified');
      return (
        <div className="w-[100px] flex justify-center items-center">
          <p
            className={`${
              emailVerified?.toString() === 'true'
                ? 'bg-green-300'
                : 'bg-red-300'
            } font-semibold text-md pt-1 pb-1 pr-2 pl-2 w-auto text-center rounded-lg`}
          >
            {emailVerified?.toString().charAt(0).toUpperCase()! +
              emailVerified?.toString().slice(1)!}
          </p>
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'createdAt',
  //   header: 'Created At',
  //   cell: ({ row }) => {
  //     const createdAt = row.getValue('createdAt');
  //     return (
  //       <div className="w-[150px]">
  //         {moment(createdAt as string).format('YYYY-MM-DD : hh:mm')}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'updatedAt',
  //   header: 'Updated At',
  //   cell: ({ row }) => {
  //     const updatedAt = row.getValue('updatedAt');
  //     return (
  //       <div className="w-[150px]">
  //         {moment(updatedAt as string).format('YYYY-MM-DD : hh:mm')}
  //       </div>
  //     );
  //   },
  // },
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
