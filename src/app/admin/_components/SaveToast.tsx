"use client";
import { useEffect, useState } from "react";

const MESSAGES: Record<string, string> = {
  product: "제품이 저장되었습니다",
  product_new: "새 제품이 추가되었습니다",
  product_deleted: "제품이 삭제되었습니다",
  event: "이벤트가 저장되었습니다",
  event_deleted: "이벤트가 삭제되었습니다",
  faq: "Q&A가 저장되었습니다",
  faq_deleted: "Q&A가 삭제되었습니다",
};

export default function SaveToast({ kind }: { kind?: string }) {
  const [show, setShow] = useState(!!kind);

  useEffect(() => {
    if (!kind) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 2800);
    return () => clearTimeout(t);
  }, [kind]);

  if (!kind || !show) return null;
  const msg = MESSAGES[kind] || "저장되었습니다";

  return (
    <div className="fixed top-6 right-6 z-50 animate-[fadeInUp_0.25s_ease-out]">
      <div className="flex items-center gap-3 bg-primary text-white pl-5 pr-6 py-3.5 rounded-full shadow-lg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span className="text-sm font-medium">{msg}</span>
      </div>
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
