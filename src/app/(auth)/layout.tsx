import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Ambient brand glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(255,184,0,0.16) 0%, rgba(5,5,5,0) 60%), radial-gradient(40% 40% at 100% 100%, rgba(255,107,0,0.12) 0%, rgba(5,5,5,0) 60%)",
        }}
      />

      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <span className="text-2xl font-extrabold tracking-tight text-brand-gradient">
            زیرەک ستریم
          </span>
        </Link>

        <div className="glass-panel-raised rounded-[var(--radius-card)] p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
