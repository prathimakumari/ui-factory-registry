import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/registry.css";
export const metadata: Metadata = {
  title: { default: "UI Factory — A foundation for what comes next", template: "%s · UI Factory" },
  description:
    "An independent design registry. Explore 50 templates, 20 styles, 24 themes, and 16 motion profiles. Compose, preview, and export reusable interfaces.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
