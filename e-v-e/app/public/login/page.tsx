"use client";
import LoginForm from "@/components/LoginForm";


export default function LoginPage() {

  return (
    <main className="bg-background text-on-surface min-h-screen flex items-center justify-center bg-nebula p-margin-mobile md:p-margin-desktop overflow-hidden">
        {/* Background Stars Effect */}
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Login Container */}
        <main className="w-full max-w-md relative z-10">

          {/* Brand Header */}
          <div className="text-center mb-stack-lg">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-widest uppercase mb-stack-sm drop-shadow-[0_0_15px_rgba(173,198,255,0.3)]">
              E-V-E
            </h1>

            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
              Chào mừng trở lại
            </h2>

            <p className="font-body-md text-body-md text-on-surface-variant">
              Tiếp tục hành trình khám phá tri thức của bạn.
            </p>
          </div>

          <LoginForm />
        </main>
    </main>
  );
}
