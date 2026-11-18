import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScoutLauncherProps {
  open: boolean;
  onOpen: () => void;
}

export function ScoutLauncher({ open, onOpen }: ScoutLauncherProps) {
  const reduced = useReducedMotion();
  if (open) return null;

  return (
    <motion.button
      type="button"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reduced ? undefined : { scale: 1.05, y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 460, damping: 24 }}
      onClick={onOpen}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#121215]/95 backdrop-blur-md text-[#faf8f2] border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-xs font-medium cursor-pointer"
    >
      <Sparkles className="w-4 h-4 text-[#d9b56d]" aria-hidden="true" />
      <span>Research Scout</span>
    </motion.button>
  );
}
