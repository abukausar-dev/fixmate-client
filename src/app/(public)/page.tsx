import { HeroSection } from "@/components/home/HeroSection";
import { CategoryRow } from "@/components/home/CategoryRow";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";

export default function HomePage() {
    return (
        <div className="pb-6">
            <HeroSection />
            <CategoryRow />
            <HowItWorksSection />
            <WhyChooseUsSection />
        </div>
    );
}