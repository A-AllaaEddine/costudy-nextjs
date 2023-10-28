'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const path = usePathname();

  const routes = [
    {
      href: '/admin/dashboard/overview',
      label: 'Overview',
      active: path === '/admin/dashboard/overview',
    },
    {
      href: '/admin/dashboard/users',
      label: 'Users',
      active: path === '/admin/dashboard/users',
    },
    {
      href: '/admin/dashboard/resources',
      label: 'Resources',
      active: path === '/admin/dashboard/resources',
    },
    {
      href: '/admin/dashboard/reports',
      label: 'Reports',
      active: path === '/admin/dashboard/reports',
    },
    {
      href: '/admin/dashboard/tickets',
      label: 'Tickets',
      active: path === '/admin/dashboard/tickets',
    },
  ];
  return (
    <div className="w-44 h-auto  flex flex-col justify-start items-start  font-[500] gap-2">
      {routes.map(({ href, label, active }, index) => {
        return (
          <Link
            key={index}
            href={href}
            className={`text-start w-full h-10 rounded-md p-2  hover:bg-slate-100
                ${active ? 'bg-slate-100' : 'bg-white'}`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export default NavBar;
