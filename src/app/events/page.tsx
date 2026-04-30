import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { getNavBrands } from "@/lib/nav";
import type { Event } from "@/types/database";

export const revalidate = 60;

export default async function EventsPage() {
  const [navBrands, sb] = await Promise.all([getNavBrands(), createClient()]);
  const { data: events } = await sb.from("events").select("*").eq("is_published", true).order("display_order");

  return (
    <>
      <Header brands={navBrands} />

      <main className="pt-[76px]">
        <section className="py-24 bg-sage-100">
          <div className="container-x text-center">
            <p className="eyebrow text-primary mb-5">EVENTS</p>
            <h1 className="display text-[clamp(40px,5vw,72px)]">이벤트 · 혜택</h1>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container-x">
            {(!events || events.length === 0) ? (
              <p className="text-center text-mute py-20">진행 중인 이벤트가 없습니다.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {(events as Event[]).map((e) => (
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
                      <h2 className="font-serif text-3xl mb-2">{e.title}</h2>
                      {(e.start_date || e.end_date) && (
                        <p className="text-xs opacity-80">
                          {e.start_date} {e.end_date && `— ${e.end_date}`}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
