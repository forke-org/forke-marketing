import type { CSSProperties, ReactNode } from 'react'
import {
  RiAngularjsFill,
  RiFirebaseFill,
  RiFlutterFill,
  RiGithubFill,
  RiGitlabFill,
  RiJavaFill,
  RiJavascriptFill,
  RiNextjsFill,
  RiNodejsFill,
  RiPhpFill,
  RiReactjsFill,
  RiRemixRunFill,
  RiSupabaseFill,
  RiSvelteFill,
  RiTailwindCssFill,
  RiVercelFill,
  RiVuejsFill,
} from '@remixicon/react'
import { Eyebrow, Reveal, Section } from './primitives'
import { SIMPLE_ICONS } from './simple-icons'

/* ── the stack: only things you'd actually ship a bounty in ──────────────── */

type IconProps = { className?: string; style?: CSSProperties }
type Tech = { name: string; color: string; icon: (props: IconProps) => ReactNode }

const ri = (Icon: typeof RiGithubFill) => {
  const C = (p: IconProps) => <Icon {...p} />
  return C
}
const si = (key: keyof typeof SIMPLE_ICONS) => {
  const C = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d={SIMPLE_ICONS[key].path} />
    </svg>
  )
  return C
}

const ROWS: Tech[][] = [
  [
    { name: 'TypeScript', color: SIMPLE_ICONS.typescript.hex, icon: si('typescript') },
    { name: 'JavaScript', color: '#f7df1e', icon: ri(RiJavascriptFill) },
    { name: 'Python', color: '#4b8bbe', icon: si('python') },
    { name: 'Go', color: SIMPLE_ICONS.go.hex, icon: si('go') },
    { name: 'Rust', color: '#dea584', icon: si('rust') },
    { name: 'Java', color: '#f89820', icon: ri(RiJavaFill) },
    { name: 'PHP', color: '#8892bf', icon: ri(RiPhpFill) },
    { name: 'Node.js', color: '#5fa04e', icon: ri(RiNodejsFill) },
  ],
  [
    { name: 'React', color: '#61dafb', icon: ri(RiReactjsFill) },
    { name: 'Next.js', color: '#f4f4f5', icon: ri(RiNextjsFill) },
    { name: 'Vue', color: '#42b883', icon: ri(RiVuejsFill) },
    { name: 'Svelte', color: '#ff3e00', icon: ri(RiSvelteFill) },
    { name: 'Angular', color: '#dd0031', icon: ri(RiAngularjsFill) },
    { name: 'Remix', color: '#f4f4f5', icon: ri(RiRemixRunFill) },
    { name: 'Flutter', color: '#54c5f8', icon: ri(RiFlutterFill) },
    { name: 'Tailwind', color: '#38bdf8', icon: ri(RiTailwindCssFill) },
  ],
  [
    { name: 'Docker', color: SIMPLE_ICONS.docker.hex, icon: si('docker') },
    { name: 'PostgreSQL', color: '#6b8fe8', icon: si('postgresql') },
    { name: 'Redis', color: SIMPLE_ICONS.redis.hex, icon: si('redis') },
    { name: 'GraphQL', color: SIMPLE_ICONS.graphql.hex, icon: si('graphql') },
    { name: 'Supabase', color: '#3ecf8e', icon: ri(RiSupabaseFill) },
    { name: 'Firebase', color: '#ffca28', icon: ri(RiFirebaseFill) },
    { name: 'GitHub', color: '#f4f4f5', icon: ri(RiGithubFill) },
    { name: 'Vercel', color: '#f4f4f5', icon: ri(RiVercelFill) },
    { name: 'GitLab', color: '#fc6d26', icon: ri(RiGitlabFill) },
  ],
]

/* ── tile: logo in brand colour plus its name, like a stack tag ─────────── */

function Chip({ tech }: { tech: Tech }) {
  const Icon = tech.icon
  return (
    <div className="flex h-[64px] shrink-0 items-center gap-3 rounded-[12px] border border-white/[0.08] bg-[#1a1918] pl-4 pr-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_3px_0_rgba(0,0,0,0.35)]">
      <Icon className="h-7 w-7" style={{ color: tech.color }} />
      <span className="whitespace-nowrap text-[17px] font-medium tracking-[-0.01em] text-white/85">{tech.name}</span>
    </div>
  )
}

/**
 * The wall is a single plane tilted back in perspective (Aside-style): stack
 * chips foreshorten and lean toward a vanishing point, each row drifting sideways.
 */
function IconWall() {
  return (
    <div
      className="relative mt-12 overflow-hidden pb-10 [perspective:620px] [perspective-origin:50%_0%]"
      style={{
        maskImage:
          'linear-gradient(180deg,#000 45%,transparent 100%), linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in',
      }}
    >
      <div className="space-y-6 pt-4 [transform:rotateX(38deg)] [transform-origin:50%_0%]">
        {ROWS.map((row, r) => (
          <div key={r} className="flex w-max">
            <div className={r % 2 ? 'animate-marquee-rev flex gap-5 pr-5' : 'animate-marquee flex gap-5 pr-5'}>
              {[...row, ...row].map((tech, i) => (
                <Chip key={i} tech={tech} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Capability() {
  return (
    <Section className="bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_55%)]">
      <div id="use-cases" className="pt-16 text-center sm:pt-24">
        <Eyebrow>Unlimited capability</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-[800px] px-6 text-[32px] font-[450] leading-[1.1] tracking-[-0.01em] text-ink sm:text-[44px] sm:leading-[48px]">
          Anything you can build in a repo,
          <br className="max-sm:hidden" /> Forke can pay you for.
        </h2>
      </div>

      <IconWall />

      <Reveal className="mx-auto mt-14 max-w-[560px] px-6 pb-20 text-lg leading-7 text-ink sm:pb-28">
        Unlike other platforms that rely on proposals and bidding, Forke scopes work straight from real repositories,
        just like a team lead would. That means you can pick up any task that matches your stack, anytime you want. The
        only limit is what you can ship.
      </Reveal>
    </Section>
  )
}
