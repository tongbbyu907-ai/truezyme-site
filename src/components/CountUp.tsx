"use client";
import { useEffect, useRef, useState } from "react";

/**
 * 스크롤로 화면에 들어왔을 때 0 → 목표값으로 ease-out 카운트업.
 * - 숫자가 아닌 값 ("K · US", "EWG" 등) 은 그대로 표시
 * - "94.5%" / "0.4℃" / "30%" 같은 형식 모두 지원 (소수점 자릿수 자동 유지)
 * - 한 번만 트리거 (페이지당 1회)
 */
export default function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^([+\-]?\d*\.?\d+)(.*)$/);
  const isNumeric = !!match;

  const target = isNumeric ? parseFloat(match[1]) : 0;
  const suffix = isNumeric ? match[2] : "";
  const decimals = isNumeric ? (match[1].split(".")[1] || "").length : 0;

  // 초기값: 숫자면 0(.0..) + suffix, 아니면 원본 그대로
  const initial = isNumeric ? `0${decimals > 0 ? "." + "0".repeat(decimals) : ""}${suffix}` : value;
  const [display, setDisplay] = useState<string>(initial);

  useEffect(() => {
    if (!isNumeric) return;
    const node = ref.current;
    if (!node) return;

    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (started) return;
        if (entries[0].isIntersecting) {
          started = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
            const current = target * eased;
            setDisplay(`${current.toFixed(decimals)}${suffix}`);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isNumeric, target, suffix, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
