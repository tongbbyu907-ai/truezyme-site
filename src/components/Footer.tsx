import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-cream/70 pt-20 pb-8 text-[13px]">
      <div className="container-x">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          <div className="col-span-2 md:col-span-1">
            <Image src="/logo.png" alt="Truezyme" width={140} height={36} className="h-7 w-auto brightness-0 invert mb-3" />
            <p className="italic opacity-70">Restore. The Skin Ecosystem.</p>
            <p className="opacity-60 mt-2 text-xs">피부가 스스로 살아나는 방식, 트루자임</p>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-[.15em] mb-5 font-medium">고객센터</h4>
            <p>1588-0000</p>
            <p>월–금 09:00–18:00</p>
            <p>점심 12:00–13:00</p>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-[.15em] mb-5 font-medium">안내</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white">브랜드 스토리</Link></li>
              <li><Link href="/events" className="hover:text-white">이벤트</Link></li>
              <li><Link href="/community" className="hover:text-white">커뮤니티</Link></li>
              <li><Link href="#" className="hover:text-white">개인정보처리방침</Link></li>
              <li><Link href="#" className="hover:text-white">이용약관</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-[.15em] mb-5 font-medium">SNS</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Instagram</Link></li>
              <li><Link href="#" className="hover:text-white">YouTube</Link></li>
              <li><Link href="#" className="hover:text-white">Facebook</Link></li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs opacity-50 pt-7">
          © {new Date().getFullYear()} Truezyme.{" "}
          <Link href="/admin/login" className="text-inherit no-underline hover:no-underline" aria-label="Admin">All</Link>{" "}
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
