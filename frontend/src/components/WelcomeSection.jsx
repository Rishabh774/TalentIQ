import { SparklesIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function WelcomeSection() {
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome back, {firstName}!
              </h1>
            </div>
            <p className="text-xl text-base-content/60 ml-16">
              Ready to level up your coding skills? Join an active session below or practice on
              your own.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
