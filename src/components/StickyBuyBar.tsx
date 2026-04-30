"use client";
import { useEffect, useState } from "react";

export default function StickyBuyBar({
  name,
  price,
  externalUrl,
}: {
  name: string;
  price?: number | null;
  externalUrl?: string | null;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line transition-transform duration-300 shadow-[0_-2px_20px_rgba(0,0,0,0.04)] ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="container-x flex items-center justify-between gap-4 py-4">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium truncate">{name}</p>
          {price && <p className="num-bold text-base text-primary">₩ {price.toLocaleString()}</p>}
        </div>
        {externalUrl ? (
          <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            지금 구매하기
          </a>
        ) : (
          <button className="btn-primary opacity-90" disabled title="구매 링크 등록 예정">
            지금 구매하기
          </button>
        )}
      </div>
    </div>
  );
}
