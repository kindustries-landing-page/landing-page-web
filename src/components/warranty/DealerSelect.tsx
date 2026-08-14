import * as React from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Dealer {
  id: string;
  name: string;
}

interface DealerSelectProps {
  id?: string;
  dealers: Dealer[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DealerSelect({
  id = 'dealer',
  dealers,
  value,
  onChange,
  placeholder = '-- Chọn đại lý --',
}: DealerSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const selectedDealer = React.useMemo(() => dealers.find((d) => d.id === value), [dealers, value]);

  const filteredDealers = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return dealers;
    return dealers.filter(
      (d) => d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)
    );
  }, [dealers, search]);

  // Click outside to close
  React.useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when opening
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSelect = (dealerId: string) => {
    onChange(dealerId);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        role="combobox"
        aria-label="Đại lý kích hoạt"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full h-11 px-4 border border-zinc-300 rounded-xl bg-white text-sm text-left flex items-center justify-between transition-all outline-none cursor-pointer',
          'focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076]',
          isOpen && 'border-[#4B0076] ring-1 ring-[#4B0076]',
          !selectedDealer && 'text-zinc-400',
          selectedDealer && 'text-zinc-900 font-medium'
        )}
      >
        <span className="truncate">
          {selectedDealer ? `${selectedDealer.id} - ${selectedDealer.name}` : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ml-2',
            isOpen && 'transform rotate-180 text-[#4B0076]'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[100] bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden p-1.5 animate-in fade-in-0 zoom-in-95 duration-100">
          {/* Search box */}
          <div className="relative mb-1.5 px-1 pt-1">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo mã hoặc tên đại lý..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#4B0076] focus:bg-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* List of dealers */}
          <div className="max-h-[180px] overflow-y-auto space-y-0.5" role="listbox">
            {filteredDealers.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400">Không tìm thấy đại lý.</div>
            ) : (
              filteredDealers.map((d) => {
                const isSelected = d.id === value;
                return (
                  <div
                    key={d.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(d.id)}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors duration-75',
                      isSelected
                        ? 'bg-purple-50 text-[#4B0076] font-semibold'
                        : 'text-zinc-700 hover:bg-purple-50/70 hover:text-[#4B0076]'
                    )}
                  >
                    <span className="truncate">
                      {d.id} - {d.name}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#4B0076] shrink-0 ml-2" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
