interface SectionIndexProps {
  index: string;
  label: string;
  className?: string;
}

export function SectionIndex({ index, label, className = '' }: SectionIndexProps) {
  return (
    <p
      data-index-roll
      className={`text-xs font-mono tracking-[0.2em] uppercase text-[#e6c98b] ${className}`}
    >
      <span className="inline-block tabular-nums">{index}</span> / {label}
    </p>
  );
}
