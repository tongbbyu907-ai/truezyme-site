import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import LogoutButton from "./_components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // 로그인 페이지는 sidebar 없이 children만
  // (이 layout은 /admin/login에도 적용되지만 session 없으면 그대로 children 패스)
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-sage-50">
      <aside className="w-60 bg-primary-900 text-cream/80 flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Truezyme" width={120} height={30} className="h-6 w-auto brightness-0 invert" />
          </Link>
          <p className="text-[11px] uppercase tracking-[.2em] mt-2 opacity-60">Admin</p>
        </div>
        <nav className="flex-1 py-6 text-sm">
          <NavLink href="/admin">대시보드</NavLink>
          <NavLink href="/admin/products">제품 관리</NavLink>
          <NavLink href="/admin/events">이벤트</NavLink>
          <NavLink href="/admin/faqs">Q&A</NavLink>
        </nav>
        <div className="p-4 border-t border-white/10 text-xs">
          <p className="opacity-60 mb-2">{session.sub as string}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="px-10 py-8 max-w-5xl">{children}</div>
      </main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block px-6 py-2.5 hover:bg-white/5 hover:text-white transition">
      {children}
    </Link>
  );
}
