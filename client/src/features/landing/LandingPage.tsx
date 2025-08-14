import GoogleLogin from "@/components/GoogleLogin";
import { ModeToggle } from "@/components/ModeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
              <span className="text-xl font-bold">Engin</span>
            <div className="flex items-center">
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Build with{" "}
              <span className="text-primary">founders</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-base-content/70 mb-8">
              Connect with startup founders, validate your ideas, and ship products that matter.
            </p>
            <div className="flex justify-center">
              <GoogleLogin />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

