import { ImSpinner9 } from 'react-icons/im';

import { cn } from '@/lib/utils';

const Spinner = ({ className }: { className?: string }) => {
  return (
    <ImSpinner9
      className={cn(`w-12 h-12 text-[#FFFFFF] animate-spin `, className)}
    />
  );
};

export default Spinner;
