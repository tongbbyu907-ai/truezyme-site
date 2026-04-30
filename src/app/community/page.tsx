import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { getNavBrands } from "@/lib/nav";
import type { Faq } from "@/types/database";

export const revalidate = 60;

export default async function CommunityPage() {
  const [navBrands, sb] = await Promise.all([getNavBrands(), createClient()]);
  const { data: faqs } = await sb.from("faqs").select("*").eq("is_published", true).order("display_order");

  return (
    <>
      <Header brands={navBrands} />

      <main className="pt-[76px]">
        <section className="py-24 bg-sage-100">
          <div className="container-x text-center">
            <p className="eyebrow text-primary mb-5">COMMUNITY</p>
            <h1 className="display text-[clamp(40px,5vw,72px)] mb-4">자주 묻는 질문</h1>
            <p className="text-[#1F3A35]/80">고객님이 가장 많이 궁금해하시는 내용을 모았습니다.</p>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container-x max-w-3xl">
            {(!faqs || faqs.length === 0) ? (
              <p className="text-center text-mute py-20">등록된 Q&A가 없습니다.</p>
            ) : (
              <div className="border-t border-line">
                {(faqs as Faq[]).map((f) => (
                  <details key={f.id} className="border-b border-line group">
                    <summary className="list-none cursor-pointer py-7 flex items-center gap-4">
                      <span className="font-serif italic text-primary text-2xl">Q.</span>
                      <span className="flex-1 text-base">{f.question}</span>
                      <span className="text-2xl font-light text-mute group-open:rotate-45 transition">+</span>
                    </summary>
                    {f.answer && (
                      <div className="pb-7 pl-11 text-[#1F3A35]/80 leading-[2] text-sm whitespace-pre-line">{f.answer}</div>
                    )}
                  </details>
                ))}
              </div>
            )}

            <div className="mt-20 text-center bg-sage-100 p-14">
              <h3 className="font-serif text-2xl mb-3">원하는 답을 찾지 못하셨나요?</h3>
              <p className="text-[#1F3A35]/80 mb-7">1:1 문의를 통해 더 자세한 상담을 도와드립니다.</p>
              <a href="mailto:hello@truezyme.com" className="btn-primary">1:1 문의하기</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
