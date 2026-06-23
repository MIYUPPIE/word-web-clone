import { type LucideIcon, ChevronDown } from 'lucide-react';

interface SplitButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  onDropdownClick?: () => void;
  active?: boolean;
  size?: 'md' | 'lg';
}

export default function SplitButton({
  icon: Icon,
  label,
  onClick,
  onDropdownClick,
  active = false,
  size = 'md',
}: SplitButtonProps) {
  if (size === 'lg') {
    return (
      <div className="flex rounded overflow-hidden">
        <button
          onClick={onClick}
          className={`split-btn-main flex flex-col items-center justify-center px-2 py-1.5 gap-0.5 ${active ? 'bg-[#c5c5c5]' : ''}`}
        >
          <Icon className="w-8 h-8" style={{ color: '#323130' }} />
          <span className="text-[9px]" style={{ color: '#323130' }}>
            {label}
          </span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDropdownClick?.();
          }}
          className="split-btn-arrow flex items-end pb-1 px-0.5"
        >
          <ChevronDown className="w-3 h-3" style={{ color: '#605e5c' }} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex rounded overflow-hidden">
      <button
        onClick={onClick}
        className={`split-btn-main flex items-center gap-1 px-1.5 py-1 ${active ? 'bg-[#c5c5c5]' : ''}`}
      >
        <Icon className="w-4 h-4" style={{ color: '#323130' }} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDropdownClick?.();
        }}
        className="split-btn-arrow flex items-center px-0.5"
      >
        <ChevronDown className="w-3 h-3" style={{ color: '#605e5c' }} />
      </button>
    </div>
  );
}
