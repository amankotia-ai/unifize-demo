import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import LogoMarquee from "@/components/sections/LogoMarquee";
import WhyUnifizeSection from "@/components/sections/WhyUnifizeSection";
import ProductsSection from "@/components/sections/ProductsSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import BenefitsTabsSection from "@/components/sections/BenefitsTabsSection";
import CustomerTestimonialsSection from "@/components/sections/CustomerTestimonialsSection";
import Footer from "@/components/sections/Footer";

function App() {
  return (
    <div className="min-h-screen bg-[#F9FBFF]">
      <Navbar />
      <main className="bg-[#F9FBFF]">
        <HeroSection />
        <div className="section-frame-range">
          <div aria-hidden className="section-frame-rails">
            <span className="section-frame-rail section-frame-rail-left" />
            <span className="section-frame-rail section-frame-rail-right" />
          </div>

          <div className="section-frame-block section-frame-block-logo">
            <span aria-hidden className="section-frame-divider" />
            <LogoMarquee />
          </div>

          <div className="section-frame-block">
            <span aria-hidden className="section-frame-divider" />
            <WhyUnifizeSection />
          </div>

          <div className="section-frame-block">
            <span aria-hidden className="section-frame-divider" />
            <ProductsSection />
          </div>

          <div className="section-frame-block">
            <span aria-hidden className="section-frame-divider" />
            <IndustriesSection />
          </div>

          <div className="section-frame-block">
            <span aria-hidden className="section-frame-divider" />
            <BenefitsTabsSection />
          </div>

          <div className="section-frame-block section-frame-block-last">
            <span aria-hidden className="section-frame-divider" />
            <CustomerTestimonialsSection />
            <span aria-hidden className="section-frame-bottom-dots" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
