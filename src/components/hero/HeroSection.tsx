import { useRouter } from "next/navigation";

// components/HeroSection.tsx
export default function HeroSection() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-cover bg-center">
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 text-center text-white dark:text-neutral-100">
        <div className="max-w-xl">
          <h1 className="mb-5 text-4xl md:text-5xl font-bold">مرحبًا بك!</h1>
          <p className="mb-5 text-base md:text-lg leading-relaxed">
            في السوق السوري{" "}
            <span className="text-secondary-light font-bold">syria store</span>{" "}
            يمكنك البدء بتصفح المنتجات والشراء مباشرة بعد تسجيل الدخول
          </p>
          <button
            onClick={() => router.push("/register")}
            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary/90 transition"
          >
            ابدأ الآن
          </button>
        </div>
      </div>
    </div>
  );
}
