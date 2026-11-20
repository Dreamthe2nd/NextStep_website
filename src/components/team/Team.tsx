import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteData } from '@/context/SiteDataContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { springPop } from '@/lib/motion';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { SectionIndex } from '@/components/ui/SectionIndex';
import { KineticHeading } from '@/components/ui/KineticHeading';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Team() {
  const { team } = useSiteData();
  const reduced = useReducedMotion();

  const leaders = team.members.filter((m) => m.status === 'Founding Team');
  const joinIndexLabel = `0${leaders.length + 1}`;

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="relative bg-transparent py-24 sm:py-28 border-b border-[var(--hairline)] overflow-x-clip"
    >
      <div className="mx-auto w-full max-w-[1140px] px-5 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <SectionIndex index="03" label="MEET & JOIN THE TEAM" className="mb-3" />
            <KineticHeading
              id="team-heading"
              text="Good things grow when"
              italicTail="we build them together."
              className="text-3xl sm:text-5xl font-semibold tracking-[-0.045em] text-[var(--fg)]"
              italicClassName="text-[var(--muted-fg)]"
            />
          </div>

          <a
            href={team.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black text-xs uppercase tracking-[0.12em] font-semibold hover:bg-[#e0f2fe] transition-all self-start lg:self-auto"
          >
            <span>Join the founding team</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Unified Team Grid: 01–04 Leadership Cards + 05 Join Founding Team (2-col span on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {leaders.map((member, index) => (
            <motion.div
              key={member.id}
              initial={reduced ? false : { opacity: 0, y: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ ...springPop, delay: index * 0.07 }}
              className="h-full"
            >
              <SpotlightCard
                spotlightColor="#93c5fd"
                intensity={0.12}
                spotlightSize={270}
                borderGlow={0.74}
                grain={0.06}
                className="group h-full flex flex-col justify-between rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/[0.1] p-6"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#93c5fd]/40 bg-zinc-900 shrink-0 shadow-[0_0_24px_rgba(96,165,250,0.2)] flex items-center justify-center">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={`${member.name} — ${member.role}`}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="w-full h-full flex items-center justify-center font-serif italic text-xl text-[#e0f2fe] bg-[radial-gradient(circle_at_30%_25%,rgba(147,197,253,0.24),rgba(18,18,21,0.95)_72%)]"
                          >
                            {getInitials(member.name)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white tracking-[-0.025em]">
                          {member.name}
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#93c5fd] mt-0.5">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400 shrink-0">
                      0{index + 1}
                    </span>
                  </div>

                  {member.motto && (
                    <p className="font-serif italic text-lg text-[#e0f2fe] leading-snug mb-3">
                      “{member.motto}”
                    </p>
                  )}

                  <p className="text-sm text-zinc-300 leading-relaxed">{member.focus}</p>

                  {member.quote && (
                    <blockquote className="mt-4 pt-3.5 border-t border-white/[0.08] font-mono text-[11px] text-[#e6c98b]/90 leading-relaxed">
                      “{member.quote}”
                    </blockquote>
                  )}
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="font-mono text-[11px] text-zinc-400">{member.status}</span>
                  <a
                    href={member.linkUrl || team.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.1em] text-white hover:text-[#93c5fd] transition-colors"
                  >
                    <span>{member.linkLabel || '@nextstep.hyderabad'}</span>
                    <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}

          {/* Card 05: Join the Founding Team (unified card language, spans 2 cols on md/lg) */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ ...springPop, delay: leaders.length * 0.07 }}
            className="h-full md:col-span-2 lg:col-span-2"
          >
            <SpotlightCard
              spotlightColor="#93c5fd"
              intensity={0.12}
              spotlightSize={270}
              borderGlow={0.74}
              grain={0.06}
              className="group h-full flex flex-col justify-between rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/[0.1] p-6"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#93c5fd]/40 bg-[radial-gradient(circle_at_30%_25%,rgba(147,197,253,0.24),rgba(18,18,21,0.95)_72%)] shrink-0 shadow-[0_0_24px_rgba(96,165,250,0.2)] flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#e0f2fe]" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-[-0.025em]">
                        Build With Us
                      </h3>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#93c5fd] mt-0.5">
                        Open Roles · Recruiting
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400 shrink-0">
                    {joinIndexLabel}
                  </span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  No prior experience required — we care most about initiative, consistency, and making a real difference for Hyderabad students.
                </p>

                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {team.pillars.map((track) => (
                    <li
                      key={track.key}
                      className="flex items-start gap-2.5 p-3 rounded-xl border border-white/[0.08] bg-white/[0.02]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#93c5fd] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <span className="text-xs font-semibold text-white block leading-tight">
                          {track.key}
                        </span>
                        <span className="text-[11px] text-zinc-400 mt-0.5 block leading-snug">
                          {track.note}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="font-mono text-[11px] text-zinc-400">Open Applications</span>
                <a
                  href={team.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.1em] text-white hover:text-[#93c5fd] transition-colors"
                >
                  <span>Apply for a role</span>
                  <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
