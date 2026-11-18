import { getDeadlineStatus, statusLabel } from '@/lib/date';

interface DeadlineChipProps {
  deadlineLabel: string;
  deadlineISO: string | null;
}

export function DeadlineChip({ deadlineLabel, deadlineISO }: DeadlineChipProps) {
  const status = getDeadlineStatus(deadlineISO);
  const label = statusLabel(status);

  const badgeStyle =
    status.kind === 'rolling' || status.kind === 'open'
      ? 'bg-emerald-500/10 border-emerald-400/25 text-emerald-300'
      : status.kind === 'closing-soon'
      ? 'bg-amber-500/15 border-amber-400/35 text-amber-300'
      : 'bg-white/[0.04] border-white/[0.1] text-zinc-400';

  const dotStyle =
    status.kind === 'rolling' || status.kind === 'open'
      ? 'bg-emerald-400'
      : status.kind === 'closing-soon'
      ? 'bg-amber-400 animate-pulse'
      : 'bg-zinc-500';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono ${badgeStyle}`}
      title={`Listed deadline: ${deadlineLabel}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} aria-hidden="true" />
      <span>{status.kind === 'closed' ? 'Closed' : label}</span>
    </span>
  );
}
