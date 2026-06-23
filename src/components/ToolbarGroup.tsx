import { type ReactNode } from 'react';

interface ToolbarGroupProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ToolbarGroup({
  title,
  children,
  className = '',
}: ToolbarGroupProps) {
  return (
    <div
      className={`flex flex-col items-center px-2 py-1 border-r border-[#d5d5d5] last:border-r-0 ${className}`}
    >
      <div className="flex items-center gap-0.5 flex-wrap">{children}</div>
      <span
        className="text-[9px] mt-0.5 tracking-wide uppercase"
        style={{ color: 'var(--group-title)' }}
      >
        {title}
      </span>
    </div>
  );
}
