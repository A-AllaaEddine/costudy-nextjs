'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const NavBar = () => {
  const params = useSearchParams();

  const routes = [
    {
      href: '/settings?tab=account',
      label: 'Account',
      active: params.get('tab') === 'account',
    },
    {
      href: '/settings?tab=security',
      label: 'Security',
      active: params.get('tab') === 'security',
    },
    {
      href: '/settings?tab=danger-zone',
      label: 'Danger Zone',
      active: params.get('tab') === 'danger-zone',
    },
  ];
  return (
    <div className="w-44 h-auto  flex flex-col justify-start items-start  font-[500] gap-2">
      {routes.map(({ href, label, active },index) => {
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
