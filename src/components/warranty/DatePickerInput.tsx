import * as React from 'react';
import { format, parse, isValid, isBefore, isAfter } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface DatePickerInputProps {
  id?: string;
  value?: Date;
  onChange: (date?: Date) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const MIN_DATE = new Date(1920, 0, 1);
const MAX_DATE = new Date();
const START_MONTH = new Date(1940, 0);
const END_MONTH = new Date();

export function DatePickerInput({
  id,
  value,
  onChange,
  disabled = false,
  className,
  placeholder = 'dd/mm/yyyy',
}: DatePickerInputProps) {
  const [inputValue, setInputValue] = React.useState(value ? format(value, 'dd/MM/yyyy') : '');
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  // Sync input value when external value changes
  React.useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, 'dd/MM/yyyy'));
    } else if (!value) {
      setInputValue('');
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Filter non-digit and non-slash characters
    raw = raw.replace(/[^\d/]/g, '');

    // Auto-insert slashes for raw digit sequences
    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly.length > 0 && !raw.includes('/')) {
      if (digitsOnly.length <= 2) {
        raw = digitsOnly;
      } else if (digitsOnly.length <= 4) {
        raw = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
      } else {
        raw = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4, 8)}`;
      }
    }

    if (raw.length > 10) {
      raw = raw.slice(0, 10);
    }

    setInputValue(raw);

    if (raw.length === 10) {
      const parsedDate = parse(raw, 'dd/MM/yyyy', new Date());
      if (
        isValid(parsedDate) &&
        !isBefore(parsedDate, MIN_DATE) &&
        !isAfter(parsedDate, MAX_DATE)
      ) {
        onChange(parsedDate);
        return;
      }
    }

    if (raw === '') {
      onChange(undefined);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim() === '') {
      onChange(undefined);
      return;
    }

    const parsedDate = parse(inputValue, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate) && !isBefore(parsedDate, MIN_DATE) && !isAfter(parsedDate, MAX_DATE)) {
      setInputValue(format(parsedDate, 'dd/MM/yyyy'));
      onChange(parsedDate);
    } else {
      // Revert to current valid value
      setInputValue(value ? format(value, 'dd/MM/yyyy') : '');
    }
  };

  const handleCalendarSelect = (date?: Date) => {
    onChange(date);
    if (date) {
      setInputValue(format(date, 'dd/MM/yyyy'));
      setPopoverOpen(false);
    } else {
      setInputValue('');
    }
  };

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        disabled={disabled}
        maxLength={10}
        className="h-11 pr-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076] bg-white text-zinc-900 text-sm"
      />
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger
          type="button"
          tabIndex={-1}
          disabled={disabled}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 p-0 flex items-center justify-center text-zinc-500 hover:text-[#4B0076] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
          aria-label="Mở lịch chọn ngày"
        >
          <CalendarIcon className="w-4 h-4" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[100]" align="end">
          {popoverOpen ? (
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleCalendarSelect}
              disabled={(date) => isAfter(date, MAX_DATE) || isBefore(date, MIN_DATE)}
              initialFocus
              captionLayout="dropdown"
              startMonth={START_MONTH}
              endMonth={END_MONTH}
            />
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}
