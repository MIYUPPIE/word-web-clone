import { type LucideIcon } from 'lucide-react';

interface ToolButtonProps {
  icon: LucideIcon;
  label?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  tooltip?: string;
  size?: 'sm' | 'md' | 'lg';
  dropdown?: boolean;
  className?: string;
}

export default function ToolButton({
  icon: Icon,
  label,
  active = false,
  disabled = false,
  onClick,
  tooltip,
  size = 'md',
  dropdown = false,
  className = '',
}: ToolButtonProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 p-0.5',
    md: 'w-7 h-7 p-1',
    lg: 'w-10 h-10 p-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`tool-btn flex flex-col items-center justify-center rounded ${sizeClasses[size]} ${active ? 'active' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <Icon className={iconSizes[size]} style={{ color: '#323130' }} />
        {dropdown && (
          <svg
            className="absolute -bottom-0.5 -right-1 w-2 h-2"
            viewBox="0 0 8 4"
            fill="#605e5c"
          >
            <path d="M0 0h8L4 4z" />
          </svg>
        )}
      </div>
      {label && (
        <span className="text-[9px] mt-0.5" style={{ color: '#323130' }}>
          {label}
        </span>
      )}
    </button>
  );
}
