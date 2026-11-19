import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteData } from '@/context/SiteDataContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { springPop } from '@/lib/motion';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { SectionIndex } from '@/components/ui/SectionIndex';
import { KineticHeading } from '@/components/ui/KineticHeading';

export function Team() {
  const { team } = useSiteData();
  const reduced = useReducedMotion();

  const founders = team.members.filter((m) => Boolean(m.image));

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

        {/* Clean 3-Card Layout: Card 1 Gaurav Koya | Card 2 Shlok Jain | Card 3 Join Founding Team */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {founders.slice(0, 2).map((member, index) => (
            <motion.div
              key={member.id}
              initial={reduced ? false : { opacity: 0, y: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ ...springPop, delay: index * 0.08 }}
              className="h-full"
            >
              <SpotlightCard
                spotlightColor="#93c5fd"
                intensity={0.12}
                spotlightSize={260}
                borderGlow={0.72}
                grain={0.06}
                className="group h-full flex flex-col justify-between rounded-2xl bg-[#121215]/78 backdrop-blur-md border border-white/[0.1] p-6"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#93c5fd]/40 bg-zinc-900 shrink-0 shadow-[0_0_24px_rgba(96,165,250,0.2)]">
                        <img
                          src={member.image}
                          alt={`${member.name} — ${member.role}`}
                          className="w-full h-full object-cover object-top scale-115"
                          loading="lazy"
                        />
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

          {/* Card 3: Join the Founding Team (Open Roles & Recruitment Call) */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ ...springPop, delay: 0.16 }}
            className="h-full"
          >
            <SpotlightCard
              spotlightColor="#60a5fa"
              intensity={0.14}
              spotlightSize={270}
              borderGlow={0.8}
              grain={0.06}
              className="group h-full flex flex-col justify-between rounded-2xl bg-[#121215]/82 backdrop-blur-md border border-[#93c5fd]/25 p-6"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#60a5fa]/15 border border-[#93c5fd]/30 font-mono text-[10px] uppercase tracking-[0.14em] text-[#93c5fd]">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    <span>Open Roles</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400">
                    03
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white tracking-[-0.025em]">
                  We’re Building the Founding Team
                </h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  No prior experience required — we care most about initiative, consistency, and making a real difference for students.
                </p>

                <ul className="mt-4 space-y-2.5">
                  {team.pillars.map((track) => (
                    <li
                      key={track.key}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02]"
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

                <p className="mt-3 font-mono text-[10px] text-[#e6c98b]/90">
                  ★ Priority need: Content Head — designed by Shlok because we need you!
                </p>
              </div>

              <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08]">
                <a
                  href={team.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-white text-[#09090b] text-xs font-semibold uppercase tracking-[0.1em] hover:bg-[#e0f2fe] transition-colors"
                >
                  <span>Apply for a founding role</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
