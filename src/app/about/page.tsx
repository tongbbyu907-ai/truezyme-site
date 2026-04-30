import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getNavBrands } from "@/lib/nav";

export const revalidate = 60;

export default async function AboutPage() {
  const brands = await getNavBrands();

  return (
    <>
      <Header brands={brands} />

      {/* HERO — 강한 그라디언트 + 좌측 텍스트 안전 영역 */}
      <section className="relative h-[80vh] min-h-[560px] flex items-end text-white overflow-hidden bg-primary-900">
        <div className="absolute inset-0 bg-[url('/photos/shampoo/Gemini_Generated_Image_uaymecuaymecuaym.png')] bg-cover bg-center opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/60 to-primary-900/20" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary-900 to-transparent" />
        <div className="container-x relative z-10 pb-24">
          <p className="eyebrow opacity-90 mb-6">BRAND STORY</p>
          <h1 className="display text-[clamp(48px,8vw,120px)]">
            Restore.<br />The Skin Ecosystem.
          </h1>
          <p className="mt-8 text-lg md:text-xl opacity-90 max-w-xl">
            피부가 스스로 살아나는 방식, 트루자임.
          </p>
        </div>
      </section>

      {/* 6단 내러티브 */}
      <section className="section bg-sage-100">
        <div className="container-x">
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-20">
            <Step n="01" tag="문제 제기" title="진정은 반복되지만, 회복은 돌아오지 않습니다.">
              그동안 피부는 관리의 대상이었습니다. 우리는 보습하고, 진정시키고, 덮어주고, 차단해왔습니다.
              하지만 같은 문제는 다음 계절에 다시 돌아옵니다.
            </Step>
            <Step n="02" tag="피부 재정의" title="피부는 하나의 에코시스템입니다.">
              장벽 · 수분 · 면역 · 미생물의 균형이 필요한 살아 있는 시스템.
              피부의 결과는 표면이 아니라 환경에서 시작됩니다.
            </Step>
            <Step n="03" tag="기존 방식의 한계" title="증상은 완화되지만, 환경은 무너진 채입니다.">
              관리만으로는 무너진 피부의 균형을 되돌릴 수 없습니다.
              유효 성분을 더하는 것만으로는 부족합니다.
            </Step>
            <Step n="04" tag="새로운 관점" title="피부는 스스로 회복할 수 있습니다.">
              단, 균형 잡힌 환경이 갖춰졌을 때.
              우리의 역할은 더해주는 것이 아니라, <strong className="text-primary font-semibold">바로 세우는 것</strong>입니다.
            </Step>
            <Step n="05" tag="트루자임의 역할" title="장벽 복원 · 수분 유지력 강화 · 생태계 균형 안정화.">
              한·미 특허 발효 공법으로 추출한 PhytoGenica™가
              피부 미세 환경에 반응하며, 자생 환경을 설계합니다.
            </Step>
            <Step n="06" tag="브랜드 약속" title="우리는 피부를 관리하지 않습니다. 환경을 만듭니다.">
              자극하지 않고, 덮지 않고, 억지로 바꾸지 않습니다.
              피부가 본래의 힘을 되찾도록 돕습니다.
            </Step>
          </div>
        </div>
      </section>

      {/* 강점 */}
      <section className="section">
        <div className="container-x">
          <div className="text-center mb-16">
            <p className="eyebrow text-primary mb-4">WHY TRUEZYME</p>
            <h2 className="display text-[clamp(36px,4.5vw,56px)]">기술이 만든 차이.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            <Strength tag="독자 기술력" title="K · US Patent">
              특수 발효 원액 PhytoGenica™ — 한국과 미국에서 특허 보유한 독자 발효 공법.
            </Strength>
            <Strength tag="고함량 원료" title="90%+">
              제품당 발효 원액 함유량이 최대 90% 이상으로, 미량 함유 타사 대비 압도적 차별성.
            </Strength>
            <Strength tag="안전성" title="EWG Green">
              전 성분 EWG Green 등급. 석유계 화학 성분이 전혀 없는 친환경 발효 화장품.
            </Strength>
            <Strength tag="전문성" title="Medical">
              한의학 · 의학 · 약학 · 대체의학 · 미용 분야 전문가 자문단 참여.
            </Strength>
          </div>
        </div>
      </section>

      {/* PhytoGenica — 베이지 톤 */}
      <section className="bg-cream py-32 md:py-40">
        <div className="container-x grid md:grid-cols-2 gap-16 items-center">
          <div className="aspect-[4/5] bg-[url('/photos/multi-tonic/Gemini_Generated_Image_apvv0rapvv0rapvv.png')] bg-cover bg-center" />
          <div>
            <p className="eyebrow text-earth mb-6">PHYTOGENICA™</p>
            <h2 className="display text-[clamp(40px,5vw,68px)] text-earth mb-8">
              발효는 시스템이다.
            </h2>
            <div className="space-y-5 text-earth/85 leading-[2] text-[15px]">
              <p>이미 많은 발효 화장품이 있습니다. 트루자임은 발효를 <strong className="text-earth font-semibold">'원료 추출 방식'이 아니라 '피부 자생 환경 설계'</strong>로 재정의합니다.</p>
              <p>성분 중심 발효가 아닌 환경 설계 발효, 흡수 기술이 아닌 생태계 복원 기술, 유효 성분 강화가 아닌 균형 회복 메커니즘.</p>
              <p className="display text-2xl text-earth pt-5 border-t border-earth/20 leading-snug">
                발효를 '원료'로 말하면 경쟁,<br />'시스템'으로 말하면 카테고리를 만든다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 적용 영역 */}
      <section className="section bg-sage-50">
        <div className="container-x">
          <div className="text-center mb-16">
            <p className="eyebrow text-primary mb-4">APPLICATION</p>
            <h2 className="display text-[clamp(36px,4.5vw,56px)]">자생 환경,<br />하나의 논리로 연결됩니다.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <Apply title="피부" desc="피부 자생력 회복" />
            <Apply title="아토피" desc="장벽 붕괴 회복" />
            <Apply title="두피" desc="두피 자생력 회복" />
            <Apply title="베이비" desc="초기 생태계 보호" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Step({ n, tag, title, children }: { n: string; tag: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="num-xl text-primary text-5xl mb-5">{n}</p>
      <p className="eyebrow text-primary mb-3">{tag}</p>
      <h3 className="display text-[clamp(22px,2.6vw,30px)] mb-5 text-[#1F3A35]">{title}</h3>
      <p className="text-[#1F3A35]/80 leading-[1.95] text-[15px]">{children}</p>
    </div>
  );
}

function Strength({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t-2 border-primary pt-6">
      <p className="eyebrow text-primary mb-4">{tag}</p>
      <h3 className="display text-2xl mb-4">{title}</h3>
      <p className="text-sm text-mute leading-[1.9]">{children}</p>
    </div>
  );
}

function Apply({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="text-center bg-white py-12 px-6 border-t-2 border-primary">
      <p className="display text-3xl text-primary mb-3">{title}</p>
      <p className="text-sm text-mute">= {desc}</p>
    </div>
  );
}
