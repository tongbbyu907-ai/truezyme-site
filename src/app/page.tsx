import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getNavBrands } from "@/lib/nav";

export const revalidate = 60;

const KEYWORDS = [
  "PHYTOGENICA™",
  "RESTORE",
  "SKIN ECOSYSTEM",
  "FERMENTATION",
  "SELF-RENEWING",
  "EWG GREEN",
  "K · US PATENT",
  "JEJU",
];

export default async function HomePage() {
  const brands = await getNavBrands();

  return (
    <>
      <Header brands={brands} />

      {/* ============ HERO — 좌(텍스트) / 우(사진) 분리 + 강한 다크 그라디언트 ============ */}
      <section className="relative h-screen min-h-[680px] overflow-hidden bg-primary-900 text-white">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-12">
          {/* 좌: 다크 그린 패널 */}
          <div className="hidden md:block md:col-span-5 bg-primary-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,.08),transparent_60%)]" />
          </div>
          {/* 우: 사진 */}
          <div className="md:col-span-7 relative">
            <div className="absolute inset-0 bg-[url('/photos/shampoo/Gemini_Generated_Image_glw1v3glw1v3glw1.png')] bg-cover bg-center" />
            {/* 좌→우 페이드로 텍스트 영역 보호 (모바일에서) */}
            <div className="absolute inset-0 md:hidden bg-gradient-to-r from-primary-900/85 via-primary-900/55 to-transparent" />
            <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-primary-900 via-primary-900/40 to-transparent w-1/3" />
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="relative h-full flex items-center">
          <div className="container-x max-w-5xl">
            <p className="eyebrow opacity-90 mb-7">SKIN · ECOSYSTEM · RESTORATION</p>
            <h1 className="display text-[clamp(48px,8vw,128px)] mb-8">
              Restore.<br />The Skin Ecosystem.
            </h1>
            <p className="text-base md:text-lg font-light max-w-md leading-relaxed mb-10 opacity-95">
              피부가 스스로 살아나는 방식, 트루자임.<br />
              발효를 원료가 아닌 시스템으로 재정의합니다.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/about" className="btn-light">브랜드 스토리</Link>
              <Link href="/brands/truezyme" className="btn-ghost">제품 보러가기 →</Link>
            </div>
          </div>
        </div>

        {/* 하단 마키 */}
        <div className="absolute bottom-0 inset-x-0 border-y border-white/15 bg-primary-900/40 backdrop-blur-sm overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-4">
            {[...KEYWORDS, ...KEYWORDS].map((k, i) => (
              <span key={i} className="mx-8 text-xs tracking-[.3em] opacity-90">
                {k} <span className="opacity-40 ml-8">●</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section className="section bg-sage-100">
        <div className="container-x grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <p className="eyebrow text-primary mb-6">OUR PHILOSOPHY</p>
            <h2 className="display text-[clamp(40px,5.5vw,72px)] text-primary-dark">
              피부는 표면이 아닙니다.
            </h2>
          </div>
          <div className="md:col-span-7 space-y-7 text-[#1F3A35] leading-[2] text-[15.5px]">
            <p>
              피부는 수분, 장벽, 면역, 미생물이 공존하는 <strong className="text-primary font-semibold">하나의 생태계</strong>입니다.
              우리는 그동안 피부를 '관리'해왔습니다 — 보습하고, 진정시키고, 덮어주고, 차단하면서.
            </p>
            <p>
              그러나 관리만으로는 무너진 피부의 균형을 되돌릴 수 없습니다.
              피부가 스스로 회복하려면, 그 안의 생태계가 먼저 바로 서야 합니다.
            </p>
            <p className="display text-2xl text-primary leading-snug pt-4 border-t border-primary/30">
              We don't treat skin.<br />We restore its ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* ============ PHYTOGENICA — 베이지 톤 ============ */}
      <section className="relative bg-cream py-32 md:py-40 overflow-hidden">
        <div className="container-x grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="eyebrow text-earth mb-6">PHYTOGENICA™</p>
            <h2 className="display text-[clamp(40px,5vw,68px)] text-earth mb-8">
              자연 발효 원액,<br />피토제니카
            </h2>
            <p className="leading-[2] text-[15px] text-earth/85 mb-8">
              한국·미국 특허 보유 독자 발효 공법으로 추출한 트루자임의 핵심 자산.
              제품당 함유량 <strong className="text-earth font-semibold">최대 90%+</strong>, 전 성분 EWG Green 등급.
              피부의 미세 환경에 반응하며, 균형을 설계합니다.
            </p>
            <ul className="space-y-3 text-[14px] text-earth/90">
              <Bullet>단순 진정이 아니라 구조를 다시 세우는 발효</Bullet>
              <Bullet>피부 환경에 반응하는 발효 — 표면이 아닌 미세 환경</Bullet>
              <Bullet>성분을 만드는 발효가 아닌, 균형을 설계하는 발효</Bullet>
            </ul>
          </div>
          <div className="aspect-square bg-[url('/photos/multi-tonic/Gemini_Generated_Image_2liacl2liacl2lia.png')] bg-cover bg-center" />
        </div>
      </section>

      {/* ============ 강점 4 ============ */}
      <section className="section">
        <div className="container-x">
          <div className="text-center mb-20">
            <p className="eyebrow text-primary mb-4">WHY TRUEZYME</p>
            <h2 className="display text-[clamp(36px,4.5vw,56px)]">기술이 만든 차이.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            <Stat n="K · US" t="독자 기술력" b="한국·미국 특허 발효 공법" />
            <Stat n="90%+" t="고함량 원액" b="제품당 발효 원액 최대 90% 이상" />
            <Stat n="EWG" t="Green 등급" b="전 성분 EWG Green, 무 석유계" />
            <Stat n="MD" t="전문가 자문" b="한·양·약·대체의 자문단 참여" />
          </div>
        </div>
      </section>

      {/* ============ 브랜드 ============ */}
      <section className="section bg-sage-50">
        <div className="container-x">
          <div className="flex items-end justify-between mb-16 pb-6 border-b border-sage-200">
            <div>
              <p className="eyebrow text-primary mb-4">OUR BRANDS</p>
              <h2 className="display text-[clamp(36px,4.5vw,56px)]">하나의 발효 기술,<br />여러 가지 결.</h2>
            </div>
            <p className="hidden md:block text-mute text-sm max-w-xs leading-relaxed">
              피부, 두피, 바디, 스페셜 케어. 각자 다른 결로 피부 자생력을 회복합니다.
            </p>
          </div>

          {brands.length === 0 ? (
            <p className="text-center py-16 text-mute border border-dashed border-sage-200">
              아직 등록된 브랜드가 없습니다.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {brands.map((b, i) => (
                <Link key={b.id} href={`/brands/${b.slug}`} className="group relative aspect-[4/5] overflow-hidden block bg-primary-900">
                  <div
                    className="absolute inset-0 opacity-60 group-hover:opacity-80 transition duration-700 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        i === 0
                          ? "/photos/shampoo/Gemini_Generated_Image_2pq9on2pq9on2pq9.png"
                          : "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&q=80"
                      })`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-primary-900/10" />
                  <div className="absolute inset-x-0 bottom-0 p-10 md:p-14 text-white">
                    <p className="text-[10px] tracking-[.3em] opacity-80 mb-4">0{i + 1} · {b.name_en}</p>
                    <h3 className="display text-5xl md:text-6xl mb-5">{b.name_ko}</h3>
                    <span className="inline-flex items-center gap-3 text-xs tracking-[.2em] uppercase border-b border-white/50 pb-1 group-hover:border-white">
                      라인 보기 →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-earth/60 flex-none" />
      <span>{children}</span>
    </li>
  );
}

function Stat({ n, t, b }: { n: string; t: string; b: string }) {
  return (
    <div className="text-center md:text-left border-t-2 border-primary pt-6">
      <p className="num-xl text-primary text-3xl md:text-4xl mb-3">{n}</p>
      <h3 className="font-medium mb-2">{t}</h3>
      <p className="text-sm text-mute leading-relaxed">{b}</p>
    </div>
  );
}
