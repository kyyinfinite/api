export function KOrbitArtwork({
  className,
  viewBox = '842 72 288 350',
}: {
  className?: string
  viewBox?: string
}) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label="Dimensional K mark with orbit ring and floating cubes"
      fill="none"
    >
      <defs>
        <linearGradient id="kr-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2d39"/><stop offset=".55" stopColor="#171a24"/><stop offset="1" stopColor="#10131c"/>
        </linearGradient>
        <linearGradient id="kr-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#173a9a"/><stop offset=".25" stopColor="#132f85"/><stop offset="1" stopColor="#0c1e57"/>
        </linearGradient>
        <linearGradient id="kr-strip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2146b8"/><stop offset="1" stopColor="#17338f"/>
        </linearGradient>
        <linearGradient id="kr-top" x1="853" y1="167" x2="990" y2="132" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3b5ee0"/><stop offset=".45" stopColor="#4a70f8"/><stop offset="1" stopColor="#3c62ee"/>
        </linearGradient>
        <linearGradient id="kr-ghost" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7f9bf5" stopOpacity=".95"/><stop offset="1" stopColor="#4a6cea" stopOpacity=".55"/>
        </linearGradient>
        <linearGradient id="kr-ltop" x1="974" y1="261" x2="1102" y2="293" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2547b8"/><stop offset=".45" stopColor="#3b5fe0"/><stop offset="1" stopColor="#4f72ee"/>
        </linearGradient>
        <linearGradient id="kr-lfront" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#111733"/><stop offset="1" stopColor="#141d3f"/>
        </linearGradient>
        <linearGradient id="kr-lend" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d7ff0"/><stop offset=".5" stopColor="#4b6de6"/><stop offset="1" stopColor="#3a5ad0"/>
        </linearGradient>
        <filter id="kr-blur" x="780" y="300" width="400" height="180" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="10"/>
        </filter>
        <filter id="kr-glow" x="700" y="410" width="50" height="40" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.6"/>
        </filter>
      </defs>

      <g stroke="#2a47c9" strokeWidth=".7" opacity=".32" fill="none">
        <path d="M1034 395 L1112 350"/><path d="M1034 395 L1104 436"/><path d="M1034 395 L968 432"/>
        <path d="M912 410 L990 456"/><path d="M949 372 L1020 330"/>
      </g>
      <path d="M830 400 C880 438 1040 438 1110 392 L1110 380 C1040 410 890 410 830 385Z" fill="#1e3fb0" opacity=".2" filter="url(#kr-blur)"/>

      <path d="M853 168 V155 L967 82 H990 M897 127 V140" stroke="#2b4fd0" strokeWidth=".8" fill="none" opacity=".75"/>
      <path d="M948.3 109.2 L990 84.2 V131.7Z" fill="url(#kr-ghost)"/>

      <path d="M853 167 L896.6 190.6 V409.7 L853 385.3Z" fill="url(#kr-left)"/>
      <path d="M896.6 191.7 L949.2 158.3 V370.3 L896.6 409.7Z" fill="url(#kr-front)"/>
      <path d="M949.2 158.3 L990 132.5 V235 H949.2Z" fill="url(#kr-strip)"/>
      <path d="M853.5 167.5 L896.6 191.2 L990 132.5 L948.3 109.2Z" fill="url(#kr-top)"/>
      <path d="M949.2 109.2 L988.5 130.8" stroke="#15318f" strokeWidth=".9" fill="none"/>

      <path d="M948.8 215.5 L1076.3 123.8 L1118.8 151.3 L1006 236 L974 261 L949 246Z" fill="#12151f"/>
      <path d="M1032.5 153.8 L1076.3 123.8 L1118.8 151.3 L1077.5 180Z" fill="#33353f"/>
      <path d="M992.5 185 L1032.5 153.8 L1077.5 180 L1037.5 208.8Z" fill="#1b1e2a"/>

      <path d="M949 246 L974 261 L1067.6 318.4 V373 L949 304Z" fill="url(#kr-lfront)"/>
      <path d="M974 261 L1006 236 L1102 293.6 L1067.6 318.4Z" fill="url(#kr-ltop)"/>
      <path d="M1067.6 318.4 L1102.4 293.8 V351.6 L1067.6 373Z" fill="url(#kr-lend)"/>

      <g data-k-cube>
        <path d="M1012 369.6 L1032 359 L1054 372 L1034 383Z" fill="#2b49b0"/>
        <path d="M1012 369.6 L1034 383 V395 L1012 383Z" fill="#dcdbe2"/>
        <path d="M1034 383 L1054 372 V387 L1033 395Z" fill="#14255e"/>
      </g>

      <g data-k-cube>
        <path d="M709.2 384.2 L736.7 400.8 L709.2 419.2 L680 400.8Z" fill="#1d202b"/>
        <path d="M680 400.8 L709.2 419.2 V453.3 L680 435.8Z" fill="#10121a"/>
        <path d="M709.2 419.2 L736.7 400.8 V435 L709.2 453.3Z" fill="#1a1d27"/>
        <path d="M715.8 423.3 L728.3 419.2 V430.8 L716.7 436.7Z" fill="#fff" opacity=".95" filter="url(#kr-glow)"/>
      </g>

      <g data-k-sparkle>
        <path d="M715 120 V156 M697 138 H733" stroke="#2458ea" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="715" cy="138" r="2.6" fill="#2458ea"/>
      </g>

      <ellipse cx="949" cy="232" rx="205" ry="61" transform="rotate(-35.3 949 232)" fill="none" stroke="#131a2c" strokeWidth="1.2" opacity=".6"/>
      <circle cx="1077" cy="121" r="2.2" fill="#1e3a9a"/>
    </svg>
  )
}
