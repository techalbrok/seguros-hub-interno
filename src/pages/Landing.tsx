
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingAudience } from "@/components/landing/LandingAudience";
import { LandingBenefits } from "@/components/landing/LandingBenefits";
import { LandingTech } from "@/components/landing/LandingTech";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingContact } from "@/components/landing/LandingContact";

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <LandingHeader />
            <main className="flex-1">
                <LandingHero />
                <LandingFeatures />
                <LandingAudience />
                <LandingBenefits />
                <LandingTech />
                <LandingContact />
            </main>
            <LandingFooter />
        </div>
    );
};

export default LandingPage;
