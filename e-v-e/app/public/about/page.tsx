import Link from "next/link";
import HeaderEffect from "../../components/HeaderEffect";

export default function AboutPage() {
  return (
    <>
      <HeaderEffect />
      {/* TopNavBar */}
      <header
        className="fixed top-0 w-full z-50 bg-surface-glass backdrop-blur-md border-b border-ice shadow-glow-primary transition-all duration-300"
        id="main-header"
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto">
          <Link
            className="font-headline-md text-headline-md text-primary tracking-widest flex items-center gap-2"
            href="/"
          >
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              public
            </span>
            E-V-E
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-on-surface-variant font-label-md hover:text-secondary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#audiences"
              className="text-on-surface-variant font-label-md hover:text-secondary transition-colors"
            >
              Đối Tượng
            </Link>
            <Link
              href="/#features"
              className="text-on-surface-variant font-label-md hover:text-secondary transition-colors"
            >
              Tính Năng
            </Link>
            <Link
              href="/public/about"
              className="text-primary border-b-2 border-primary pb-1 font-label-md hover:text-secondary transition-colors"
            >
              About
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/public/login">
              <button className="text-on-surface-variant font-label-md hover:text-primary transition-colors px-4 py-2">
                Login
              </button>
            </Link>
            <Link href="/public/register">
              <button className="btn-primary font-label-md rounded px-6 py-2">
                Register
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop">
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ice bg-surface-glass mb-6">
            <span className="material-symbols-outlined text-secondary text-sm">
              info
            </span>
            <span className="font-label-sm text-secondary">
              Về Hệ Sinh Thái E-V-E
            </span>
          </div>
          <h1 className="font-headline-lg text-4xl md:text-6xl stellar-text mb-6">
            Sứ Mệnh Khai Phóng Tri Thức
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            E-V-E (Cosmic Knowledge Platform) được xây dựng với mục tiêu định hình
            tương lai giáo dục số. Chúng tôi kết hợp trí tuệ nhân tạo (AI) tiên
            tiến và trải nghiệm người dùng hiện đại để mang đến hành trình học tập
            cá nhân hóa, khơi gợi trí tò mò và niềm yêu thích khám phá tri thức.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glass-card rounded-2xl p-6 text-center">
            <span className="material-symbols-outlined text-secondary text-4xl mb-4">
              psychology
            </span>
            <h3 className="font-headline-md text-lg text-primary mb-2">
              AI Cá Nhân Hóa
            </h3>
            <p className="font-body-sm text-on-surface-variant">
              Tự động phân tích năng lực và xây dựng lộ trình học tập tối ưu cho
              từng học sinh.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <span className="material-symbols-outlined text-secondary text-4xl mb-4">
              hub
            </span>
            <h3 className="font-headline-md text-lg text-primary mb-2">
              Hệ Sinh Thái Tích Hợp
            </h3>
            <p className="font-body-sm text-on-surface-variant">
              Gắn kết Nhà trường, Giáo viên, Học sinh và Phụ huynh trên một nền
              tảng dữ liệu thống nhất.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <span className="material-symbols-outlined text-secondary text-4xl mb-4">
              auto_awesome
            </span>
            <h3 className="font-headline-md text-lg text-primary mb-2">
              Giao Diện Tương Lai
            </h3>
            <p className="font-body-sm text-on-surface-variant">
              Thiết kế trực quan, mượt mà giúp duy trì sự tập trung tối đa trong
              quá trình tiếp thu tri thức.
            </p>
          </div>
        </section>

        <div className="text-center">
          <Link href="/">
            <button className="btn-primary rounded-lg px-8 py-3 font-headline-sm">
              Trở Về Trang Chủ
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
