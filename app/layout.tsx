import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";
import FooterLight from "@/components/FooterLight";

export const metadata: Metadata = {
  title: "ClinicalAI-Trial Analysis",
  description:
    "Paste an NCT ID and get ranked, source-linked, honestly-labeled hypotheses for why a clinical trial failed.",
};

// Sets the `.dark` class before first paint, synchronously, so there's no
// flash of the wrong theme while React hydrates. Must run as a plain
// blocking <script> (no async/defer, no next/script) placed ahead of
// body content — that's the only reliable point in the document lifecycle
// this can run at. Reads localStorage first, falls back to the OS
// preference for a first-time visitor.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <TopNav />
        <div className="flex-1">{children}</div>
        <FooterLight />
      </body>
    </html>
  );
}
