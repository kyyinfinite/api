import type { ReactNode, SVGProps } from 'react'
import { cn } from '@/utils/cn'

interface IconSpec {
  tone: string
  glyph: ReactNode
}

const line: SVGProps<SVGGElement> = {
  fill: 'none',
  stroke: '#fff',
  strokeWidth: 7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const specs: Record<string, IconSpec> = {
  ai: {
    tone: '#2457E8',
    glyph: (
      <g fill="#fff">
        <path d="M62 28c3 20 14 31 34 34-20 3-31 14-34 34-3-20-14-31-34-34 20-3 31-14 34-34Z" />
        <path d="M98 78c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" />
      </g>
    ),
  },
  downloader: {
    tone: '#101827',
    glyph: (
      <g {...line}>
        <path d="M64 30v46m0 0 18-18M64 76 46 58" />
        <path d="M34 90v8h60v-8" />
      </g>
    ),
  },
  search: {
    tone: '#F47A08',
    glyph: (
      <g {...line} strokeWidth={8}>
        <circle cx="56" cy="55" r="22" />
        <path d="m73 72 22 22" />
      </g>
    ),
  },
  image: {
    tone: '#0F9F8E',
    glyph: (
      <g>
        <rect x="32" y="36" width="64" height="56" rx="9" fill="none" stroke="#fff" strokeWidth="7" />
        <circle cx="52" cy="54" r="6" fill="#fff" />
        <path d="m40 86 18-19 13 13 9-9 14 15H40Z" fill="#fff" />
      </g>
    ),
  },
  whatsapp: {
    tone: '#20C76A',
    glyph: (
      <g>
        <path
          d="M64 30c-19 0-34 14-34 32 0 6 2 12 5 17l-4 15 16-4c5 3 11 4 17 4 19 0 34-14 34-32S83 30 64 30Z"
          fill="none"
          stroke="#fff"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path d="M52 48c0 14 11 26 26 28l5-7-8-5-4 4c-5-2-9-6-11-11l4-4-5-8-7 3Z" fill="#fff" />
      </g>
    ),
  },
  information: {
    tone: '#0E9AD8',
    glyph: (
      <g>
        <circle cx="64" cy="38" r="8" fill="#fff" />
        <path d="M64 56v36" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
      </g>
    ),
  },
  maker: {
    tone: '#9B2FAE',
    glyph: (
      <g>
        <path
          d="M64 32c-18 0-32 13-32 30s13 30 30 30c6 0 9-3 9-7 0-5-4-5-4-10 0-4 3-6 7-6h12c8 0 12-5 12-12 0-14-14-25-34-25Z"
          fill="none"
          stroke="#fff"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="58" r="5" fill="#fff" />
        <circle cx="64" cy="46" r="5" fill="#fff" />
        <circle cx="80" cy="52" r="5" fill="#fff" />
      </g>
    ),
  },
  tools: {
    tone: '#475569',
    glyph: (
      <g {...line}>
        <path d="M48 46 30 64l18 18M80 46l18 18-18 18M70 38 58 90" />
      </g>
    ),
  },
  news: {
    tone: '#D9381E',
    glyph: (
      <g {...line} strokeWidth={6}>
        <rect x="32" y="34" width="64" height="60" rx="8" />
        <path d="M44 50h24M44 62h40M44 74h40M44 86h20" />
      </g>
    ),
  },
  primbon: {
    tone: '#4B3FD1',
    glyph: (
      <g fill="#fff">
        <path d="M78 34a32 32 0 1 0 16 56 26 26 0 0 1-16-56Z" />
        <circle cx="96" cy="44" r="5" />
      </g>
    ),
  },
  random: {
    tone: '#C79A12',
    glyph: (
      <g>
        <rect x="36" y="36" width="56" height="56" rx="12" fill="none" stroke="#fff" strokeWidth="7" />
        <g fill="#fff">
          <circle cx="52" cy="52" r="5" />
          <circle cx="76" cy="52" r="5" />
          <circle cx="64" cy="64" r="5" />
          <circle cx="52" cy="76" r="5" />
          <circle cx="76" cy="76" r="5" />
        </g>
      </g>
    ),
  },
  stalker: {
    tone: '#8B5E34',
    glyph: (
      <g {...line}>
        <circle cx="64" cy="48" r="13" />
        <path d="M36 94c2-17 14-26 28-26s26 9 28 26" />
      </g>
    ),
  },
  anime: {
    tone: '#F0629B',
    glyph: (
      <g {...line}>
        <path d="M28 42q36 8 72 0M38 58h52M48 46v46M80 46v46" />
      </g>
    ),
  },
}

const fallbackTones = ['#64748B', '#0F766E', '#B45309', '#7E22CE']

function fallbackTone(slug: string): string {
  let hash = 0
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return fallbackTones[hash % fallbackTones.length]
}

interface CategoryIconProps {
  slug: string
  label?: string
  className?: string
}

export function CategoryIcon({ slug, label, className }: CategoryIconProps) {
  const spec = specs[slug]
  const tone = spec?.tone ?? fallbackTone(slug)
  const initial = (label ?? slug).trim().charAt(0).toUpperCase() || '?'

  return (
    <svg
      viewBox="0 0 128 128"
      aria-hidden="true"
      focusable="false"
      className={cn('h-11 w-11 shrink-0', className)}
    >
      <rect x="8" y="8" width="112" height="112" rx="28" fill={tone} />
      {spec ? (
        spec.glyph
      ) : (
        <text
          x="64"
          y="82"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Inter, Arial, sans-serif"
          fontSize="56"
          fontWeight="700"
        >
          {initial}
        </text>
      )}
    </svg>
  )
}
