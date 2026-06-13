import Link from "next/link";
import { PixelSprite } from "@/components/ui/PixelSprite";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[720px] flex-col items-start justify-center px-6">
      <PixelSprite name="ghost" size={72} className="mb-2" />
      <span className="font-display text-[7rem] italic leading-none text-faint">
        404
      </span>
      <p className="mt-4 font-display text-2xl italic text-text">
        Page not found.
      </p>
      <Link
        href="/"
        className="smallcaps mt-6 text-sm text-accent underline decoration-accent underline-offset-[5px] transition-colors duration-150 hover:text-accent-hover"
      >
        Back to writing
      </Link>
    </div>
  );
}
