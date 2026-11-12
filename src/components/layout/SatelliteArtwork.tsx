export function SatelliteArtwork({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 480"
      className={className}
      role="img"
      aria-label="Satellite orbiting Earth illustration"
      fill="none"
    >
      <defs>
        <radialGradient id="earthGlow" cx="0.72" cy="0.28" r="0.9">
          <stop offset="0" stopColor="#274FC7" />
          <stop offset="0.55" stopColor="#12295F" />
          <stop offset="1" stopColor="#0A142E" />
        </radialGradient>
        <linearGradient id="terminator" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0A142E" stopOpacity="0" />
          <stop offset="1" stopColor="#050A18" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5B82F0" />
          <stop offset="1" stopColor="#1746D5" />
        </linearGradient>
        <linearGradient id="panelGrad2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4E79EA" />
          <stop offset="1" stopColor="#123A9E" />
        </linearGradient>
      </defs>

      <g data-sat-orbit>
        <ellipse
          cx="360"
          cy="280"
          rx="170"
          ry="170"
          transform="rotate(-14 360 280)"
          stroke="#3E6BEF"
          strokeOpacity="0.55"
          strokeWidth="1.8"
          strokeDasharray="4 7"
        />
        <ellipse
          cx="360"
          cy="280"
          rx="238"
          ry="238"
          transform="rotate(-14 360 280)"
          stroke="#3E6BEF"
          strokeOpacity="0.3"
          strokeWidth="1.4"
        />
        <ellipse
          cx="360"
          cy="280"
          rx="300"
          ry="300"
          transform="rotate(-14 360 280)"
          stroke="#3E6BEF"
          strokeOpacity="0.16"
          strokeWidth="1.2"
        />
      </g>

      <g data-sat-earth>
        <circle cx="360" cy="280" r="140" fill="url(#earthGlow)" />
        <circle cx="360" cy="280" r="140" fill="url(#terminator)" />
        <circle cx="360" cy="280" r="140" stroke="#2E5BE6" strokeOpacity="0.6" strokeWidth="1.6" />
        <path
          d="M282 224c36-18 72-6 92 12s56 22 80 4"
          stroke="#3E6BEF"
          strokeOpacity="0.55"
          strokeWidth="2.2"
        />
        <path
          d="M268 296c44-20 84-8 108 12s64 18 92-2"
          stroke="#3E6BEF"
          strokeOpacity="0.45"
          strokeWidth="2"
        />
        <path
          d="M308 348c32-14 62-4 80 10"
          stroke="#3E6BEF"
          strokeOpacity="0.35"
          strokeWidth="1.8"
        />
        <ellipse cx="318" cy="252" rx="28" ry="15" transform="rotate(-14 318 252)" fill="#4E79EA" opacity="0.28" />
        <ellipse cx="390" cy="318" rx="36" ry="17" transform="rotate(-14 390 318)" fill="#4E79EA" opacity="0.2" />
        <ellipse cx="352" cy="352" rx="24" ry="12" transform="rotate(-14 352 352)" fill="#4E79EA" opacity="0.16" />
      </g>

      <g data-sat-body transform="translate(120 62) rotate(-16 66 66)">
        <rect x="38" y="54" width="52" height="18" rx="3" fill="url(#panelGrad)" />
        <g stroke="#0A142E" strokeOpacity="0.45" strokeWidth="1">
          <line x1="51" y1="54" x2="51" y2="72" />
          <line x1="64" y1="54" x2="64" y2="72" />
          <line x1="77" y1="54" x2="77" y2="72" />
        </g>
        <rect x="38" y="76" width="52" height="18" rx="3" fill="url(#panelGrad2)" />
        <g stroke="#0A142E" strokeOpacity="0.45" strokeWidth="1">
          <line x1="51" y1="76" x2="51" y2="94" />
          <line x1="64" y1="76" x2="64" y2="94" />
          <line x1="77" y1="76" x2="77" y2="94" />
        </g>
        <rect x="90" y="60" width="20" height="26" rx="3" fill="#202A40" stroke="#3A4660" strokeWidth="1.2" />
        <rect x="110" y="64" width="11" height="18" rx="2" fill="#171E2C" stroke="#3A4660" strokeWidth="1.2" />
        <circle cx="115.5" cy="73" r="2.6" fill="#20C76A" />
        <path d="M64 94v10" stroke="#3A4660" strokeWidth="2.2" />
        <path d="M55 104h18l-9 15-9-15z" fill="#171E2C" stroke="#3A4660" strokeWidth="1.2" />
      </g>

      <path d="M190 118l64 38" stroke="#3E6BEF" strokeOpacity="0.6" strokeWidth="1.6" />
      <circle cx="258" cy="158" r="3.4" fill="#8BAAFF" />

      <g data-sat-sparkle stroke="#2458EA" strokeLinecap="round">
        <path d="M470 150h30m-15-15v30" strokeWidth="3" />
        <path d="M96 300h24m-12-12v24" strokeWidth="2.4" opacity="0.85" />
        <path d="M560 320h20m-10-10v20" strokeWidth="2" opacity="0.7" />
        <path d="M150 140h18m-9-9v18" strokeWidth="2" opacity="0.6" />
      </g>

      <g data-sat-stars fill="#8C98BE">
        <circle cx="52" cy="72" r="1.8" />
        <circle cx="140" cy="36" r="2.2" />
        <circle cx="236" cy="66" r="1.5" />
        <circle cx="330" cy="30" r="1.9" />
        <circle cx="428" cy="52" r="1.4" />
        <circle cx="516" cy="96" r="2" />
        <circle cx="590" cy="188" r="1.5" />
        <circle cx="614" cy="290" r="1.9" />
        <circle cx="560" cy="408" r="1.6" />
        <circle cx="440" cy="448" r="1.4" />
        <circle cx="180" cy="420" r="1.7" />
        <circle cx="66" cy="352" r="1.5" />
        <circle cx="30" cy="216" r="1.8" />
        <circle cx="100" cy="180" r="1.2" />
        <circle cx="300" cy="120" r="1.3" />
        <circle cx="380" cy="86" r="1.6" />
        <circle cx="500" cy="260" r="1.2" />
        <circle cx="240" cy="380" r="1.4" />
        <circle cx="120" cy="440" r="1.9" />
        <circle cx="620" cy="60" r="1.4" />
      </g>
    </svg>
  )
}
