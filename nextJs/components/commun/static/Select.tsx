import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';

const CustomSelect = ({
  onChange,
  options,
  className,
  contenClassName,
  value,
}: {
  onChange: (type: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  contenClassName?: string;
  value?: string;
}) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          `h-8 w-36 truncate pl-4 pr-4 text-black font-semibold   bg-[#C8ADE4] bg-opacity-50 drop-shadow-none shadow-none rounded-full 
          `,
          className
        )}
      >
        <div
          className="w-5/6  overflow-hidden
                  flex justify-start"
        >
          <p
            className={`${
              value?.length! > 11 && 'whitespace-nowrap animate-filter'
            }`}
          >
            <SelectValue placeholder={options[0].label} />
          </p>
        </div>
      </SelectTrigger>
      <SelectContent className={cn('h-56', contenClassName)}>
        {options.map((option, idx) => {
          return (
            <SelectItem
              key={idx}
              className={`w-full h-10 text-sm font-semibold
                      hover:bg-[#C8ADE4]  hover:cursor-pointer `}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
