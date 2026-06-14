export function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="14" fill="#06150E" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="12.5" fill="none" stroke="#C9A84C" strokeWidth=".8" opacity=".38" />
      <defs>
        <clipPath id="lm">
          <rect width="64" height="64" rx="14" />
        </clipPath>
      </defs>
      <g clipPath="url(#lm)">
        <ellipse cx="32" cy="20" rx="6.5" ry="9" fill="#D8BD6E" />
        <ellipse cx="30.2" cy="17.5" rx="2.2" ry="3.2" fill="#E3CE8C" opacity=".55" />
        <ellipse cx="17" cy="44" rx="6.5" ry="9" fill="#C9A84C" transform="rotate(-17 17 44)" />
        <ellipse cx="15.5" cy="41.5" rx="2.2" ry="3.2" fill="#D8BD6E" opacity=".55" transform="rotate(-17 15.5 41.5)" />
        <ellipse cx="47" cy="44" rx="6.5" ry="9" fill="#C9A84C" transform="rotate(17 47 44)" />
        <ellipse cx="45.5" cy="41.5" rx="2.2" ry="3.2" fill="#D8BD6E" opacity=".55" transform="rotate(17 45.5 41.5)" />
        <path d="M32 29 L18 39 M32 29 L46 39 M32 11 L32 29" stroke="#163A2B" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M32 11 C27.5 6 21 8 19 12 C23.5 11.5 27.5 11 32 11Z" fill="#1B4332" />
        <path d="M32 11 C36.5 6 43 8 45 12 C40.5 11.5 36.5 11 32 11Z" fill="#1B4332" />
      </g>
    </svg>
  )
}
