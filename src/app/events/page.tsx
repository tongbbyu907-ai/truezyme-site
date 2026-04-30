import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { getNavBrands } from "@/lib/nav";
import type { Event } from "@/types/database";

export const revalidate = 60;

export default async function EventsPage() {
  const [navBrands, sb] = await Promise.all([getNavBrands(), createClient()]);
  const { data: events } = await sb.from("events").select("*").eq("is_published", true).order("display_order");
  const list = (events ?? []) as Event[];

  return (
    <>
      <Header brands={navBrands} overlay />

      {/* HERO */}
      <section className="relative h-[60vh] min-h-[440px] flex items-end text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(19,48,44,.4),rgba(19,48,44,.75)),url('/photos/multi-tonic/Gemini_Generated_Image_apvv0rapvv0rapvv.png')] bg-cover bg-center" />
        <div className="container-x relative z-10 pb-20">
          <p className="eyebrow opacity-90 mb-5">EVENTS</p>
          <h1 className="display text-[clamp(48px,7vw,96px)]">이벤트 · 혜택</h1>
          <p className="mt-6 text-base md:text-lg opacity-90 max-w-md">
            트루자임이 준비한 시즌별 혜택과 신제품 소식을 만나보세요.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main>
        <section className="section bg-white">
          <div className="container-x">
            {list.length === 0 ? (
              // EMPTY STATE — Coming soon 비주얼 콜라주
              <ComingSoon />
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {list.map((e) => (
                  <a
                    key={e.id}
                    href={e.link || "#"}
                    className="group relative aspect-[4/3] overflow-hidden text-white flex items-end"
                    style={{
                      backgroundImage: e.cover_image
                        ? `linear-gradient(rgba(19,48,44,.25),rgba(19,48,44,.6)),url(${e.cover_image})`
                        : "linear-gradient(135deg, #2A5F58, #4A7B75)",
                      backgroundSize: "cover",
                    }}
                  >
                    <div className="p-10 w-full">
                      {e.subtitle && <p className="eyebrow opacity-90 mb-3">{e.subtitle}</p>}
                      <h2 className="display text-3xl mb-2">{e.title}</h2>
                      {(e.start_date || e.end_date) && (
                        <p className="text-xs opacity-80">{e.start_date} {e.end_date && `— ${e.end_date}`}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SUBSCRIBE CTA */}
        <section className="bg-sage-100 py-28 md:py-36">
          <div className="container-x grid md:grid-cols-2 gap-14 items-center">
            <div className="aspect-[4/5] bg-[url('/photos/shampoo/Gemini_Generated_Image_2pq9on2pq9on2pq9.png')] bg-cover bg-center" />
            <div>
              <p className="eyebrow text-primary mb-6">STAY CONNECTED</p>
              <h2 className="display text-[clamp(28px,4vw,46px)] mb-7 leading-[1.25]">
                새로운 혜택을<br />가장 먼저 받아보세요
              </h2>
              <p className="text-[15px] leading-[1.95] mb-8 text-[#1F3A35]/85">
                신제품 소식 · 시즌 한정 혜택 · 멤버십 전용 이벤트를 이메일로 안내해드립니다.
              </p>
              <a href="mailto:hello@truezyme.com?subject=뉴스레터 구독 신청" className="btn-primary">
                뉴스레터 구독하기 →
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function ComingSoon() {
  return (
    <div>
      <div className="text-center mb-16">
        <p className="eyebrow text-primary mb-5">COMING SOON</p>
        <h2 className="display text-[clamp(28px,4vw,46px)] mb-5">곧 새로운 혜택이 시작됩니다</h2>
        <p className="text-mute max-w-lg mx-auto leading-relaxed">
          트루자임이 준비 중인 시즌 캠페인과 멤버십 혜택을 곧 만나보실 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
        <Tile src="/photos/shampoo/Gemini_Generated_Image_5phney5phney5phn.png" tag="GIFT" label="시즌 기프트 세트" />
        <Tile src="/photos/scalp-tonic/Gemini_Generated_Image_aluugqaluugqaluu.png" tag="MEMBER" label="멤버십 혜택" />
        <Tile src="/photos/multi-tonic/Gemini_Generated_Image_kwzi5rkwzi5rkwzi.png" tag="LAUNCH" label="신제품 출시" />
        <Tile src="/photos/scalp-tonic/Gemini_Generated_Image_iue4l1iue4l1iue4.png" tag="EXCLUSIVE" label="단독 프로모션" />
      </div>
    </div>
  );
}

function Tile({ src, tag, label }: { src: string; tag: string; label: string }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-sage-50">
      <div className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-105" style={{ backgroundImage: `url(${src})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-[10px] tracking-[.3em] opacity-90 mb-2">{tag}</p>
        <p className="text-sm font-medium">{label}</p>
      </div>
    </div>
  );
}
