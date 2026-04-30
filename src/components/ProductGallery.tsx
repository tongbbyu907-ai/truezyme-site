"use client";
import { useState } from "react";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];
  return (
    <div className="md:sticky md:top-24 self-start">
      <div className="aspect-square bg-sage-50 overflow-hidden mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={main} alt={alt} className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden bg-sage-50 transition ${
                active === i ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`${alt} 이미지 ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
