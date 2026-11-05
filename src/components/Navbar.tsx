import Link from "next/link";
import { useRouter } from "next/router";

const links = [
  { href: "/drive/my-drive", label: "My Drive", match: ["/drive/my-drive", "/drive/[...Folder]"] },
  { href: "/drive/starred", label: "Starred", match: ["/drive/starred"] },
  { href: "/drive/trash", label: "Bin", match: ["/drive/trash"] },
];

function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex items-end gap-7 border-b border-[#F0EEEB] px-8">
      {links.map((link) => {
        const active = link.match.includes(router.pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`-mb-px border-b-2 pb-3 pt-1 text-sm transition ${
              active
                ? "border-[#EA580C] font-semibold text-[#111827]"
                : "border-transparent font-medium text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default Navbar;
