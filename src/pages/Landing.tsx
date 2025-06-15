
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFooter } from "@/components/landing/LandingFooter";

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <LandingHeader />
            <main className="flex-1">
                <LandingHero />
                <LandingFeatures />
            </main>
            <LandingFooter />
        </div>
    );
};

export default LandingPage;
