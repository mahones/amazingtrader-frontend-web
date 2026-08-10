const SOCIAL_LINKS = [
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@amazing.traders",
    icon: (
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.14-1.39 4.28 4.28 0 0 1-1.11-2.93h-3.4v13.75a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1-2.59-2.59 2.59 2.59 0 0 1 2.59-2.59c.24 0 .48.03.7.1v-3.45a5.94 5.94 0 0 0-.7-.04A5.99 5.99 0 0 0 .38 17.68a5.99 5.99 0 0 0 5.99 5.99 5.99 5.99 0 0 0 5.99-5.99V9.42a7.63 7.63 0 0 0 4.46 1.43V7.4a4.25 4.25 0 0 1-.22-1.58z" />
    ),
  },
  {
    name: "Twitter",
    href: "https://x.com/TradersAmazing?t=RMc_bwHaAddV7XazeKPY0w&s=09",
    icon: (
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.6-6.9L4.2 22H1l8.1-9.3L.9 2H8.2l5 6.3L18.9 2Zm-1.2 18h1.9L6.4 4H4.4L17.7 20Z" />
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@amazing.traders",
    icon: (
      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/amazing.traders",
    icon: (
      <path d="M12 2c2.7 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43C21.99 8.94 22 9.3 22 12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47C15.06 21.99 14.7 22 12 22s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.7 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.44.54C6.08.29 6.81.12 7.87.07 8.94.01 9.3 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 0 0-2.34 1.17 1.17 0 0 0 0 2.34Z" />
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/+Y27TJtoHhdNlZDQ0",
    icon: (
      <path d="m21.9 4.3-3.1 15.2c-.2 1-.9 1.3-1.7.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8.1c.4-.3-.1-.5-.6-.2L6.3 12.7l-4.8-1.5c-1-.3-1-1 .2-1.5L20.5 2.7c.9-.3 1.6.2 1.4 1.6Z" />
    ),
  },
];

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="transition-colors text-[#0E0E0E] hover:text-white"
        >
          <span className="bg-primary w-7 h-7 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
              {social.icon}
            </svg>
          </span>
        </a>
      ))}
    </div>
  );
}
