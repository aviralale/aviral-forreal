import { Github, Instagram, Twitter } from "lucide-react";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { PixelSprite } from "@/components/ui/PixelSprite";

const socials = [
  { href: "https://twitter.com/aviralale", label: "Twitter", Icon: Twitter },
  { href: "https://github.com/aviralale", label: "GitHub", Icon: Github },
  {
    href: "https://instagram.com/aviralale",
    label: "Instagram",
    Icon: Instagram,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-8 text-center">
        <PixelSprite name="cat" size={44} className="mb-3" />

        <SiteLogo className="h-8" />
        <span className="smallcaps mt-1 text-xs text-muted">
          <a className="underline text-primary" href="https://buymemomo.com/aviral" target="_blank" rel="noreferrer noopener">
            Buy me momo
          </a>
          · {new Date().getFullYear()}
        </span>

        <div className="mt-5 flex items-center gap-5">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="text-muted transition-colors duration-150 hover:text-accent"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
