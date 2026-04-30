import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { getNavBrands } from "@/lib/nav";
import type { Faq } from "@/types/database";

export const revalidate = 60;

export default async function CommunityPage() {
  const [navBrands, sb] = await Promise.all([getNavBrands(), createClient()]);
  const { data: faqs } = await sb.from("faqs").select("*").eq("is_published", true).order("display_order");
  const list = (faqs ?? []) as Faq[];

  return (
    <>
      <Header brands={navBrands} overlay />

      {/* HERO */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(19,48,44,.4),rgba(19,48,44,.75)),url('/photos/shampoo/Gemini_Generated_Image_glw1v3glw1v3glw1.png')] bg-cover bg-center" />
        <div className="container-x relative z-10 pb-20">
          <p className="eyebrow opacity-90 mb-5">COMMUNITY</p>
          <h1 className="display text-[clamp(48px,7vw,96px)]">자주 묻는 질문</h1>
          <p className="mt-6 text-base md:text-lg opacity-90 max-w-lg">
            고객님이 가장 많이 궁금해하시는 내용을 모았습니다.
          </p>
        </div>
      </section>

      <main>
        {/* FAQ LIST */}
        <section className="section bg-white">
          <div className="container-x max-w-3xl">
            {list.length === 0 ? (
              <EmptyFaq />
            ) : (
              <div className="border-t border-line">
                {list.map((f) => (
                  <details key={f.id} className="border-b border-line group">
                    <summary className="list-none cursor-pointer py-7 flex items-center gap-4">
                      <span className="display text-primary text-2xl">Q.</span>
                      <span className="flex-1 text-base font-medium">{f.question}</span>
                      <span className="text-2xl font-light text-mute group-open:rotate-45 transition">+</span>
                    </summary>
                    {f.answer && (
                      <div className="pb-7 pl-11 text-[#1F3A35]/80 leading-[2] text-sm whitespace-pre-line">{f.answer}</div>
                    )}
                  </details>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CONTACT — 사진 + CTA */}
        <section className="bg-sage-100 py-28 md:py-36">
          <div className="container-x grid md:grid-cols-2 gap-14 items-center">
            <div className="aspect-[4/5] bg-[url('/photos/multi-tonic/Gemini_Generated_Image_apvv0rapvv0rapvv.png')] bg-cover bg-center" />
            <div>
              <p className="eyebrow text-primary mb-6">1:1 INQUIRY</p>
              <h2 className="display text-[clamp(28px,4vw,46px)] mb-7 leading-[1.25]">
                원하는 답을<br />찾지 못하셨나요?
              </h2>
              <p className="text-[15px] leading-[1.95] mb-8 text-[#1F3A35]/85">
                제품 사용·배송·멤버십 등 어떤 문의도 1:1로 정성껏 답변드립니다.
                평일 09:00–18:00 (점심 12:00–13:00 제외) 응답 드립니다.
              </p>
              <a href="mailto:hello@truezyme.com" className="btn-primary">1:1 문의하기 →</a>

              <div className="mt-10 pt-8 border-t border-sage-300/40 grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[.2em] text-mute mb-2">고객센터</p>
                  <p className="font-medium">1588-0000</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[.2em] text-mute mb-2">이메일</p>
                  <p className="font-medium">hello@truezyme.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL — 인스타 갤러리 스타일 */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container-x">
            <div className="text-center mb-12">
              <p className="eyebrow text-primary mb-5">FOLLOW US</p>
              <h2 className="display text-[clamp(26px,3.4vw,40px)] mb-3">@truezyme</h2>
              <p className="text-mute text-sm">소셜에서 더 많은 트루자임을 만나보세요.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-6xl mx-auto">
              <SocialTile src="/photos/shampoo/Gemini_Generated_Image_uaymecuaymecuaym.png" />
              <SocialTile src="/photos/scalp-tonic/Gemini_Generated_Image_qtvupyqtvupyqtvu.png" />
              <SocialTile src="/photos/multi-tonic/Gemini_Generated_Image_kwzi5rkwzi5rkwzi.png" />
              <SocialTile src="/photos/scalp-tonic/Gemini_Generated_Image_2ilp2v2ilp2v2ilp.png" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function EmptyFaq() {
  return (
    <div className="text-center py-20">
      <p className="display text-2xl mb-4 text-mute">곧 자주 묻는 질문이 업데이트됩니다.</p>
      <p className="text-sm text-mute mb-10">궁금한 사항은 1:1 문의로 알려주세요.</p>
      <a href="mailto:hello@truezyme.com" className="btn-outline">1:1 문의하기 →</a>
    </div>
  );
}

function SocialTile({ src }: { src: string }) {
  return (
    <a href="#" className="group relative aspect-square overflow-hidden bg-sage-50">
      <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${src})` }} />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center text-white opacity-0 group-hover:opacity-100">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
        </svg>
      </div>
    </a>
  );
}
