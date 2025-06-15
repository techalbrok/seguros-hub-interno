
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingAudience } from "@/components/landing/LandingAudience";
import { LandingBenefits } from "@/components/landing/LandingBenefits";
import { LandingTech } from "@/components/landing/LandingTech";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingContact } from "@/components/landing/LandingContact";
import { useState } from "react";
import { LegalModal, LegalContentType } from "@/components/landing/LegalModal";

const LandingPage = () => {
    const [modalContentKey, setModalContentKey] = useState<LegalContentType | null>(null);
    
    const openModal = (contentKey: LegalContentType) => setModalContentKey(contentKey);
    const closeModal = () => setModalContentKey(null);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <LandingHeader />
            <main className="flex-1">
                <LandingHero />
                <LandingFeatures />
                <LandingAudience />
                <LandingBenefits />
                <LandingTech />
                <LandingContact onOpenLegalModal={openModal} />
            </main>
            <LandingFooter onOpenLegalModal={openModal} />
            {modalContentKey && <LegalModal contentKey={modalContentKey} onClose={closeModal} />}
        </div>
    );
};

export default LandingPage;
