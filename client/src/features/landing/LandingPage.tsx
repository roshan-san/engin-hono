import GoogleLogin from "@/components/GoogleLogin";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold">E</span>
          </div>
          <span className="text-xl font-semibold">Engin</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Build with{" "}
            <span className="text-primary">founders</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect with startup founders, validate your ideas, and ship products that matter.
          </p>
        </div>
        <GoogleLogin />
      </div>
    </div>
    </>
  );
}

