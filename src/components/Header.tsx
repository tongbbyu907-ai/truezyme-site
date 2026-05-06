"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { NavBrand } from "@/lib/nav";

export default function Header({
  brands,
  overlay = false,
}: { brands: NavBrand[]; overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(!overlay);
  const [open, setOpen] = useState(false);
  const [openBrand, setOpenBrand] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenBrand(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // 검색 input 스타일 — 오버레이/솔리드 분기
  const searchClass = scrolled
    ? "bg-sage-50/70 border-line text-ink placeholder:text-mute focus:bg-white focus:border-primary"
    : "bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 text-ink shadow-[0_1px_0_rgba(0,0,0,.05)] backdrop-blur" : "bg-transparent text-white"
      }`}
    >
      <div className="container-x flex h-[76px] items-center gap-6">
        {/* 모바일 햄버거 */}
        <button aria-label="메뉴" className="md:hidden flex flex-col gap-[5px]" onClick={() => setOpen((v) => !v)}>
          <span className="w-5 h-[1.5px] bg-current" />
          <span className="w-5 h-[1.5px] bg-current" />
          <span className="w-5 h-[1.5px] bg-current" />
        </button>

        {/* 로고 — 좌측 */}
        <Link href="/" className="flex items-center" onClick={() => setOpenBrand(null)}>
          <Image
            src="/logo.png"
            alt="Truezyme"
            width={150}
            height={36}
            className={`h-7 w-auto transition ${scrolled ? "" : "brightness-0 invert"}`}
            priority
          />
        </Link>

        {/* 우측 그룹 — 네비 + 검색 */}
        <div className="ml-auto flex items-center gap-6 lg:gap-8">
          {/* 데스크톱 네비 */}
          <nav ref={navRef} className="hidden md:flex items-center gap-7 lg:gap-9 text-[13.5px] tracking-wide">
            <Link href="/about" className="hover:opacity-70 transition py-2">브랜드 스토리</Link>

            {brands.map((b) => (
              <div key={b.id} className="relative">
                <button
                  className={`flex items-center gap-1 py-2 hover:opacity-70 transition ${openBrand === b.slug ? "opacity-70" : ""}`}
                  onClick={() => setOpenBrand(openBrand === b.slug ? null : b.slug)}
                >
                  {b.name_ko}
                  <svg width="9" height="6" viewBox="0 0 9 6" fill="none" className={`transition-transform ${openBrand === b.slug ? "rotate-180" : ""}`}>
                    <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </button>

                {openBrand === b.slug && (
                  <div className="absolute top-full right-0 pt-3 z-50">
                    <div className="bg-white text-ink shadow-xl min-w-[280px] py-3 ring-1 ring-line/60">
                      <div className="px-5 py-2 border-b border-line/60">
                        <p className="text-[10px] uppercase tracking-[.25em] text-mute">{b.name_en}</p>
                        <p className="font-serif text-lg">{b.name_ko}</p>
                      </div>
                      {b.products.length > 0 ? (
                        <ul className="py-2">
                          {b.products.map((p) => (
                            <li key={p.id}>
                              <Link
                                href={`/products/${p.id}`}
                                onClick={() => setOpenBrand(null)}
                                className="block px-5 py-2.5 text-sm hover:bg-sage-50 hover:text-primary transition"
                              >
                                {p.name_ko}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="px-5 py-4 text-sm text-mute">등록된 제품이 없습니다.</p>
                      )}
                      <div className="border-t border-line/60 px-5 py-3">
                        <Link
                          href={`/brands/${b.slug}`}
                          onClick={() => setOpenBrand(null)}
                          className="text-[11px] uppercase tracking-[.2em] text-primary hover:text-primary-dark"
                        >
                          전체 라인 보기 →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link href="/events" className="hover:opacity-70 transition py-2">이벤트 · 혜택</Link>
            <Link href="/community" className="hover:opacity-70 transition py-2">커뮤니티</Link>
          </nav>

          {/* 검색 input — 데스크톱에서 표시되는 실제 입력 칸 */}
          <form action="/search" method="get" className="hidden sm:block relative">
            <input
              type="search"
              name="q"
              placeholder="검색"
              aria-label="검색"
              className={`w-40 lg:w-52 h-9 pl-3.5 pr-9 text-[13px] border rounded-full outline-none transition-colors ${searchClass}`}
            />
            <button type="submit" aria-label="검색 실행" className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" /><path d="m21 21-5-5" />
              </svg>
            </button>
          </form>

          {/* 모바일에선 검색 아이콘만 */}
          <button aria-label="검색" className="sm:hidden w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-black/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-5-5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <div className="md:hidden bg-white text-ink shadow-xl">
          <ul className="px-6 py-4 max-h-[80vh] overflow-y-auto">
            <li className="border-b border-line"><Link href="/about" className="block py-3.5 text-sm" onClick={() => setOpen(false)}>브랜드 스토리</Link></li>
            {brands.map((b) => (
              <li key={b.id} className="border-b border-line py-3">
                <Link href={`/brands/${b.slug}`} className="block font-medium" onClick={() => setOpen(false)}>{b.name_ko}</Link>
                {b.products.length > 0 && (
                  <ul className="mt-2 ml-3 border-l border-line">
                    {b.products.map((p) => (
                      <li key={p.id}>
                        <Link href={`/products/${p.id}`} onClick={() => setOpen(false)} className="block py-1.5 pl-3 text-xs text-mute hover:text-primary">
                          {p.name_ko}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="border-b border-line"><Link href="/events" className="block py-3.5 text-sm" onClick={() => setOpen(false)}>이벤트 · 혜택</Link></li>
            <li><Link href="/community" className="block py-3.5 text-sm" onClick={() => setOpen(false)}>커뮤니티</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
