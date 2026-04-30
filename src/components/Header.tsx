"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { NavBrand } from "@/lib/nav";

export default function Header({ brands }: { brands: NavBrand[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);                 // 모바일 메뉴
  const [openBrand, setOpenBrand] = useState<string | null>(null); // 데스크톱 드롭다운
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenBrand(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 text-ink shadow-[0_1px_0_rgba(0,0,0,.05)] backdrop-blur" : "bg-transparent text-white"
      }`}
    >
      <div className="container-x flex h-[76px] items-center justify-between gap-6">
        {/* 모바일 햄버거 */}
        <button aria-label="메뉴" className="md:hidden flex flex-col gap-[5px]" onClick={() => setOpen((v) => !v)}>
          <span className="w-5 h-[1.5px] bg-current" />
          <span className="w-5 h-[1.5px] bg-current" />
          <span className="w-5 h-[1.5px] bg-current" />
        </button>

        {/* 로고 */}
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

        {/* 데스크톱 네비 — 사용자 지정 순서 */}
        <nav ref={navRef} className="hidden md:flex items-center gap-10 text-[13.5px] tracking-wide">
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
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

        {/* 우측 액션 */}
        <div className="flex items-center gap-2">
          <button aria-label="검색" className="w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-black/5">
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
