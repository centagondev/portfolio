import { Link } from "react-router-dom";
import { Lockup } from "./Logo";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-[#05070f]">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Link to="/" aria-label="Centagon home">
            <Lockup />
          </Link>

          <nav aria-label="Footer">
            <ul className="flex items-center gap-8">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="mailto:hello@centagon.com"
            className="text-sm text-silk transition-colors duration-300 hover:text-white"
          >
            hello@centagon.com
          </a>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted/60">
            © {new Date().getFullYear()} Centagon — Every Side Matters.
          </p>
          <p className="text-xs text-muted/40">Crafted with care, on every side.</p>
        </div>
      </div>
    </footer>
  );
}
