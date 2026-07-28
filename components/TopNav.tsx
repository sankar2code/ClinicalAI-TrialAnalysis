import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import NavSearch from "./NavSearch";
import HomeButton from "./HomeButton";

// design.md `top-nav`: 80px bar, 1px bottom hairline, wordmark left. The
// "how this works" explanation now lives inline on the homepage (see
// HowItWorksSteps) — the right side holds NavSearch (hidden below `md`),
// HomeButton, and the theme toggle, in that order.
export default function TopNav() {
  return (
    <header className="h-20 border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 text-title-md text-ink no-underline">
          <Logo size={24} />
          ClinicalAI-Trial Analysis
        </Link>
        <div className="flex items-center gap-2">
          <NavSearch />
          <HomeButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
