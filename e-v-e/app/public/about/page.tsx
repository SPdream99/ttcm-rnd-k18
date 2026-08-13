import HeaderEffect from "@/components/HeaderEffect";
import Link from "next/link";

export default function AboutPage() {
    return (
        <>
            <HeaderEffect />
            {/*TopNavBar (From Shared Components) */}
            <header className="fixed top-0 w-full z-50 bg-surface-glass backdrop-blur-md border-b border-ice shadow-glow-primary transition-all duration-300" id="main-header">
                <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto">
                    {/* Brand */}
                    <a className="font-headline-md text-headline-md text-primary tracking-widest flex items-center gap-2" href="#">
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}
                        >public</span>
                        E-V-E
                    </a>
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-4">
                        <Link href="/"><div className="text-primary border-b-2 border-primary pb-1 font-label-md text-label-md hover:text-secondary transition-colors duration-300 active:scale-95" >Home</div></Link>
                    </nav>
                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-stack-md">
                        <Link href="/public/login"><button className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors active:scale-95 px-4 py-2">Login</button></Link>
                        <Link href="/public/register"><button className="btn-primary font-label-md text-label-md rounded px-6 py-2 active:scale-95 transition-transform">Register</button></Link>
                    </div>
                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-primary p-2">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </header >
            <main className="pt-24 md:pt-32 pb-stack-lg">
                {/* 1. Hero Section */}
                <section className="relative w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop min-h-[80vh] flex flex-col justify-center items-center text-center mb-24">
                    {/* Background Visual Placeholder */}
                    <div className="absolute inset-0 z-[-1] opacity-40 rounded-3xl overflow-hidden pointer-events-none">
                        <div className="w-full h-full bg-cover bg-center mix-blend-screen" data-alt="A mesmerizing, high-fidelity deep space nebula scene in dark navy and vibrant ice blue. Glowing cosmic dust and subtle starfields create a sense of infinite depth. The aesthetic is advanced, serene, and technologically sophisticated, fitting a high-end educational platform's hero background." style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ')",
                        }}></div>
                    </div>
                    {/* Floating AI Orb Element */}
                    <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-primary-container/20 blur-2xl pulse-anim pointer-events-none"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
                    <div className="max-w-4xl z-10 glass-card p-8 md:p-12 rounded-2xl flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ice bg-surface-glass mb-6">
                            <span className="material-symbols-outlined text-secondary text-sm">auto_awesome</span>
                            <span className="font-label-sm text-label-sm text-secondary">Hệ Sinh Thái E-V-E Cosmic Knowledge</span>
                        </div>
                        <h1 className="font-headline-lg text-4xl md:text-6xl lg:text-7xl mb-6 stellar-text tracking-tight">
                            Nâng Tầm Giáo Dục<br />Trong Kỷ Nguyên Số
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
                            Trải nghiệm lộ trình học tập cá nhân hóa được dẫn dắt bởi AI. Khám phá vũ trụ tri thức với giao diện tương lai, nơi sự tập trung và khơi gợi trí tò mò hòa quyện trong một không gian thanh tĩnh.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button className="btn-primary rounded-lg px-8 py-4 font-headline-sm text-headline-sm flex items-center justify-center gap-2 group">
                                Khám Phá Ngay
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            <button className="glass-card rounded-lg px-8 py-4 font-headline-sm text-headline-sm text-on-surface flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                                <span className="material-symbols-outlined text-secondary">play_circle</span>
                                Xem Demo
                            </button>
                        </div>
                    </div>
                </section>
                {/* 2. Target Audiences (Bento Grid Style) */}
                <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop mb-24" id="audiences">
                    <div className="text-center mb-12">
                        <h2 className="font-headline-lg text-3xl md:text-4xl text-primary mb-4">Vũ Trụ Tri Thức Cho Mọi Đối Tượng</h2>
                        <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">Thiết kế tinh xảo để phục vụ từng mắt xích trong hệ sinh thái giáo dục, mang lại giá trị tối đa qua lăng kính công nghệ.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Card 1: Schools */}
                        <div className="glass-card rounded-xl p-6 glass-hover group flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                            <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-ice flex items-center justify-center mb-6 shadow-glow-primary">
                                <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
                                </svg></span>
                            </div>
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Nhà Trường</h3>
                            <p className="font-body-md text-on-surface-variant grow">Quản lý toàn diện, tối ưu hóa nguồn lực và nâng cao chất lượng giảng dạy thông qua dữ liệu phân tích sâu sắc từ hệ thống.</p>
                        </div>
                        {/* Card 2: Teachers */}
                        <div className="glass-card rounded-xl p-6 glass-hover group flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                            <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-ice flex items-center justify-center mb-6 shadow-glow-primary">
                                <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 20v-9l-4 1.125V20h4Zm0 0h8m-8 0V6.66667M16 20v-9l4 1.125V20h-4Zm0 0V6.66667M18 8l-6-4-6 4m5 1h2m-2 3h2" />
                                </svg>
                                </span>
                            </div>
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Giáo Viên</h3>
                            <p className="font-body-md text-on-surface-variant grow">Giảm tải công việc hành chính, dễ dàng tạo bài giảng sinh động và theo dõi sát sao tiến độ học tập của từng cá nhân học sinh.</p>
                        </div>
                        {/* Card 3: Students */}
                        <div className="glass-card rounded-xl p-6 glass-hover group flex flex-col h-full relative overflow-hidden lg:col-span-2 lg:bg-surface-glass/80">
                            {/* Larger feature image for the primary user */}
                            <div className="absolute inset-0 z-[-1] opacity-20 mask-image: linear-gradient(to bottom, black, transparent);">
                                <div className="w-full h-full bg-cover bg-center" data-alt="A highly stylized, futuristic holographic projection of a DNA strand or atomic structure floating above a minimalist dark blue desk. Soft ice-blue light illuminates the scene, representing advanced student learning tools in a serene, high-tech environment." style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAk-pfjflS3EjBlEHovdjkW8RWvgU2ppYjzoRvk3Jb0mpvJafHbIkF0VXpcWaL3eNFMpKFgoOSs-LMLQc5IvOWPTFe61WV5OuV7ssu_Nj4qlGeF1Ljw0_Wc6aNlmdUfsDvaS1ohv8d5oMsTY6H2DiIdurwMhWZrRYf6LbVdVPvcfRUlmelLwIMjczzRt-BFKmTKSwIs78CvH8ApQBIs64hQK_kGY9GhYeEg5ivYq2XqE9VJB6GXUT-3')",
                                }}></div>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-primary-container border border-ice flex items-center justify-center mb-6 shadow-glow-primary pulse-anim">
                                <span className="material-symbols-outlined text-on-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.05 3.00002v5C7.33127 8.93351 5.05005 11.2392 5.05005 14.2c0 3.7555 3.13401 6.8 6.99995 6.8 3.866 0 7-3.0445 7-6.8 0-2.9608-2.2812-5.26649-5-6.19998v-5m-4 0h4m-4 0H8.05005m5.99995 0h2M5.09798 15H19.0021" />
                                </svg>
                                </span>
                            </div>
                            <h3 className="font-headline-md text-headline-md text-primary mb-3">Học Sinh</h3>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-4">Trải nghiệm học tập cá nhân hóa 100%. Trợ lý AI E-V-E đồng hành 24/7, biến những khái niệm phức tạp thành hành trình khám phá đầy mê hoặc.</p>
                            <div className="mt-auto flex flex-wrap gap-2">
                                <span className="px-3 py-1 rounded-full bg-surface/50 border border-ice font-label-sm text-secondary">Lộ trình riêng biệt</span>
                                <span className="px-3 py-1 rounded-full bg-surface/50 border border-ice font-label-sm text-secondary">Học qua Gamification</span>
                            </div>
                        </div>
                        {/* Card 4: Parents (Moves below on small screens, beside on large) */}
                        <div className="glass-card rounded-xl p-6 glass-hover group flex flex-col h-full relative overflow-hidden lg:col-start-2 lg:col-span-2">
                            <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-ice flex items-center justify-center mb-6 shadow-glow-primary">
                                <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10.5785 19 4.2979-10.92966c.0369-.09379.1674-.09379.2042 0L19.3785 19m-8.8 0H9.47851m1.09999 0h1.65m7.15 0h-1.65m1.65 0h1.1m-7.7-3.9846h4.4M3 16l1.56685-3.9846m0 0 2.73102-6.94506c.03688-.09379.16738-.09379.20426 0l2.50367 6.94506H4.56685Z" />
                                </svg>
                                </span>
                            </div>
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Phụ Huynh</h3>
                            <p className="font-body-md text-on-surface-variant grow">Kết nối liền mạch với hành trình của con. Nhận báo cáo thông minh, gợi ý hỗ trợ kịp thời và an tâm với môi trường số an toàn.</p>
                        </div>
                    </div>
                </section>
                {/* 3. Key Features (Asymmetric Layout) */}
                <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop mb-24" id="features">
                    <div className="text-center mb-16">
                        <h2 className="font-headline-lg text-3xl md:text-4xl text-primary mb-4">Công Nghệ Định Hình Tương Lai</h2>
                        <div className="w-24 h-1 bg-secondary/30 mx-auto rounded-full"></div>
                    </div>
                    <div className="flex flex-col gap-16">
                        {/* Feature 1: AI Learning Path */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="w-full md:w-1/2 order-2 md:order-1">
                                <div className="glass-card p-2 rounded-2xl overflow-hidden aspect-video relative group">
                                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors z-10"></div>
                                    <div className="w-full h-full bg-cover bg-center rounded-xl" data-alt="A glowing, branching neural network or skill tree interface displayed on a sleek, dark glass screen. The nodes are connected by luminous ice-blue lines against a deep space navy background, illustrating an AI-driven personalized learning path in a premium, high-tech aesthetic." style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S')",
                                    }}></div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 order-1 md:order-2">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/30 mb-4 text-primary">01</div>
                                <h3 className="font-headline-lg text-2xl md:text-3xl text-on-surface mb-4">Lộ Trình Trí Tuệ Nhân Tạo (AI Path)</h3>
                                <p className="font-body-md text-on-surface-variant mb-6">Hệ thống phân tích hàng nghìn điểm dữ liệu từ thói quen, tốc độ và sở thích học tập để kiến tạo một quỹ đạo tri thức độc nhất cho mỗi cá nhân. Không ai học giống ai, vì không ai giống ai.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                                        <span className="text-on-surface-variant">Tự động điều chỉnh độ khó theo thời gian thực</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                                        <span className="text-on-surface-variant">Phát hiện và lấp lỗ hổng kiến thức chuẩn xác</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* Feature 2: AI Assistant */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="w-full md:w-1/2">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary/10 border border-secondary/30 mb-4 text-secondary">02</div>
                                <h3 className="font-headline-lg text-2xl md:text-3xl text-on-surface mb-4">Trợ Lý Ảo E-V-E Mentor</h3>
                                <p className="font-body-md text-on-surface-variant mb-6">Một thực thể AI luôn hiện diện, sẵn sàng giải đáp mọi thắc mắc 24/7. E-V-E không chỉ cung cấp đáp án, mà còn hướng dẫn tư duy phản biện qua phương pháp truy vấn Socrates.</p>
                                <button className="text-secondary font-label-md flex items-center gap-1 hover:text-primary transition-colors">
                                    Trò chuyện thử với E-V-E
                                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                </button>
                            </div>
                            <div className="w-full md:w-1/2 relative">
                                {/* Simulated Assistant Chat UI */}
                                <div className="glass-card rounded-2xl p-6 relative z-10 border-l-4 border-l-secondary">
                                    <div className="flex gap-4 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-on-surface text-sm">person</span>
                                        </div>
                                        <div className="bg-surface-container p-3 rounded-lg rounded-tl-none font-body-sm text-sm text-on-surface-variant">
                                            Lỗ đen vũ trụ hình thành như thế nào vậy E-V-E?
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0 shadow-glow-primary pulse-anim">
                                            <span className="material-symbols-outlined text-on-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                                        </div>
                                        <div className="glass-card p-4 rounded-lg rounded-tl-none font-body-sm text-sm text-on-surface">
                                            Hãy tưởng tượng một ngôi sao khổng lồ như một quả bóng bay khổng lồ... Khi nó cạn kiệt năng lượng, lực hấp dẫn ép nó lại thành một điểm vô cùng nhỏ bé nhưng cực kỳ nặng. Cậu muốn tìm hiểu thêm về "chân trời sự kiện" không?
                                        </div>
                                    </div>
                                </div>
                                {/* Background glow effect */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/20 blur-[80px] rounded-full z-0"></div>
                            </div>
                        </div>
                        {/* Feature 3: Integrated System */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="w-full md:w-1/2 order-2 md:order-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 glass-hover">
                                        <span className="material-symbols-outlined text-secondary text-3xl">quiz</span>
                                        <span className="font-label-md text-on-surface">Kho Trắc Nghiệm</span>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 glass-hover translate-y-4">
                                        <span className="material-symbols-outlined text-secondary text-3xl">video_library</span>
                                        <span className="font-label-md text-on-surface">Video Bài Giảng</span>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 glass-hover -translate-y-4">
                                        <span className="material-symbols-outlined text-secondary text-3xl">library_books</span>
                                        <span className="font-label-md text-on-surface">Tài Liệu Số</span>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 glass-hover">
                                        <span className="material-symbols-outlined text-secondary text-3xl">analytics</span>
                                        <span className="font-label-md text-on-surface">Báo Cáo Tiến Độ</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 order-1 md:order-2">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/30 mb-4 text-primary">03</div>
                                <h3 className="font-headline-lg text-2xl md:text-3xl text-on-surface mb-4">Hệ Sinh Thái Tích Hợp Toàn Diện</h3>
                                <p className="font-body-md text-on-surface-variant mb-6">Mọi tài nguyên từ bài kiểm tra, thư viện học liệu đến báo cáo phân tích đều được quy tụ trên một giao diện duy nhất. Xóa bỏ sự phân mảnh, tập trung tối đa cho việc thẩm thấu kiến thức.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* 4. Call to Action */}
                <section className="w-full max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop">
                    <div className="glass-card rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
                        {/* Ambient background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[60px] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[60px] rounded-full"></div>
                        <div className="relative z-10">
                            <span className="material-symbols-outlined text-5xl text-primary mb-6 block">rocket_launch</span>
                            <h2 className="font-headline-lg text-3xl md:text-5xl text-on-surface mb-6">Sẵn Sàng Khởi Hành?</h2>
                            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">Tham gia cùng hàng ngàn học sinh và giáo viên đã chuyển đổi số thành công. Trải nghiệm tương lai của giáo dục ngay hôm nay.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button className="btn-primary rounded-lg px-8 py-4 font-headline-sm text-headline-sm shadow-glow-primary hover:-translate-y-1 transition-transform">
                                    Đăng Ký Tài Khoản Miễn Phí
                                </button>
                                <button className="border border-ice rounded-lg px-8 py-4 font-headline-sm text-headline-sm text-on-surface hover:bg-surface-variant/50 transition-colors">
                                    Liên Hệ Tư Vấn
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main >
            {/* Footer (From Shared Components) */}
            < footer className="w-full mt-stack-lg bg-surface-container-lowest border-t border-ice py-stack-lg px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center" >
                <div className="mb-6 md:mb-0 flex flex-col items-center md:items-start">
                    <span className="font-headline-sm text-headline-sm text-on-surface mb-2 flex items-center gap-2">
                        <span
                            className="material-symbols-outlined text-secondary text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            public
                        </span>
                        E-V-E
                    </span>

                    <p className="font-label-sm text-label-sm text-secondary">
                        © 2024 E-V-E Cosmic Knowledge. All rights reserved.
                    </p>
                </div>

                <nav className="flex flex-wrap justify-center gap-6">
                    <a
                        href="#"
                        className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors"
                    >
                        Privacy Policy
                    </a>

                    <a
                        href="#"
                        className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors"
                    >
                        Terms of Service
                    </a>

                    <a
                        href="#"
                        className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors"
                    >
                        Contact Us
                    </a>

                    <a
                        href="#"
                        className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors"
                    >
                        Careers
                    </a>
                </nav>
            </footer >
        </>
    );
}
