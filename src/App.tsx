import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
// Home and HomeEnterprise statically import lottie-react via
// HeroSection / inline import. lottie-react@2.4.1 has a Vite
// optimizer bug that crashes the dev server. Lazy-loading isolates
// the import so other routes (notably /v2-page) never touch it.
const Home = lazy(() => import("@/pages/Home"));
const HomeEnterprise = lazy(() => import("@/pages/HomeEnterprise"));
import DesignLibrary from "@/pages/DesignLibrary";
import EnterpriseDesignSystem from "@/pages/EnterpriseDesignSystem";
import HomeLinear from "@/pages/HomeLinear";
import HomeLinearFlow from "@/pages/HomeLinearFlow";
import HomeLinearStudio from "@/pages/HomeLinearStudio";
import HomeLinearStudioGap from "@/pages/HomeLinearStudioGap";
import HomeLinearNodes from "@/pages/HomeLinearNodes";
import HomeLinearV2 from "@/pages/HomeLinearV2";
import HomeLinearV3 from "@/pages/HomeLinearV3";
import HomeLinearIso from "@/pages/HomeLinearIso";
import HomeLinearConcept from "@/pages/HomeLinearConcept";
import HomeV1 from "@/pages/HomeV1";
import HomeDirectionA from "@/pages/HomeDirectionA";
import HomeDirectionB from "@/pages/HomeDirectionB";
import HomeDirectionC from "@/pages/HomeDirectionC";
import HomeDirectionD from "@/pages/HomeDirectionD";
import HomeSplitWorld from "@/pages/HomeSplitWorld";
import HomeIceberg from "@/pages/HomeIceberg";
import HomeTwoTimelines from "@/pages/HomeTwoTimelines";
import HomeDataArt from "@/pages/HomeDataArt";
import HomeOptionA from "@/pages/HomeOptionA";
import HomeOptionB from "@/pages/HomeOptionB";
import HomeOptionC from "@/pages/HomeOptionC";
import HomeOptionD from "@/pages/HomeOptionD";
import HomeConceptA from "@/pages/HomeConceptA";
import HomeConceptB from "@/pages/HomeConceptB";
import HomeConceptBV1 from "@/pages/HomeConceptBV1";
import HomeConceptC from "@/pages/HomeConceptC";
import HomeConceptD from "@/pages/HomeConceptD";
import HomeConceptAnimation from "@/pages/HomeConceptAnimation";
import HomeSoRSoCGapV2 from "@/pages/HomeSoRSoCGapV2";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import IsoDoss from "@/pages/IsoDoss";
import Blank from "@/pages/Blank";
import BlankAC from "@/pages/BlankAC";
import BlankConcrete from "@/pages/BlankConcrete";
import E1Decompose from "@/pages/E1Decompose";
import DocLayered from "@/pages/DocLayered";
import OneDocument from "@/pages/OneDocument";
import Courtyard from "@/pages/Courtyard";
import Iso from "@/pages/iso";
import Isometric from "@/pages/isometric";
import V1 from "@/pages/v1";
import V2 from "@/pages/v2";
import V3 from "@/pages/v3";
import V4 from "@/pages/v4";
import IsoKit from "@/pages/IsoKit";

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0b]" />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/design-library" element={<DesignLibrary />} />
      <Route path="/design-system" element={<EnterpriseDesignSystem />} />
      <Route path="/enterprise" element={<HomeEnterprise />} />
      <Route path="/linear" element={<HomeLinear />} />
      <Route path="/linear-flow" element={<HomeLinearFlow />} />
      <Route path="/linear-studio" element={<HomeLinearStudio />} />
      <Route path="/linear-studio-gap" element={<HomeLinearStudioGap />} />
      <Route path="/linear-nodes" element={<HomeLinearNodes />} />
      <Route path="/linear-v2" element={<HomeLinearV2 />} />
      <Route path="/linear-v3" element={<HomeLinearV3 />} />
      <Route path="/linear-iso" element={<HomeLinearIso />} />
      <Route path="/linear-concept" element={<HomeLinearConcept />} />
      <Route path="/v1" element={<HomeV1 />} />
      <Route path="/direction-a" element={<HomeDirectionA />} />
      <Route path="/direction-b" element={<HomeDirectionB />} />
      <Route path="/direction-c" element={<HomeDirectionC />} />
      <Route path="/direction-d" element={<HomeDirectionD />} />
      <Route path="/split-world" element={<HomeSplitWorld />} />
      <Route path="/iceberg" element={<HomeIceberg />} />
      <Route path="/two-timelines" element={<HomeTwoTimelines />} />
      <Route path="/data-art" element={<HomeDataArt />} />
      <Route path="/option-a" element={<HomeOptionA />} />
      <Route path="/option-b" element={<HomeOptionB />} />
      <Route path="/option-c" element={<HomeOptionC />} />
      <Route path="/option-d" element={<HomeOptionD />} />
      <Route path="/concept-a" element={<HomeConceptA />} />
      <Route path="/concept-a-animated" element={<HomeConceptAnimation />} />
      <Route path="/concept-b" element={<HomeConceptB />} />
      <Route path="/concept-b-v1" element={<HomeConceptBV1 />} />
      <Route path="/concept-c" element={<HomeConceptC />} />
      <Route path="/concept-d" element={<HomeConceptD />} />
      <Route path="/sor-soc-gap-v2" element={<HomeSoRSoCGapV2 />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/iso-doss" element={<IsoDoss />} />
      <Route path="/blank" element={<Blank />} />
      <Route path="/blank-ac" element={<BlankAC />} />
      <Route path="/blank-concrete" element={<BlankConcrete />} />
      <Route path="/e1-decompose" element={<E1Decompose />} />
      <Route path="/doc-layered" element={<DocLayered />} />
      <Route path="/one-document" element={<OneDocument />} />
      <Route path="/courtyard" element={<Courtyard />} />
      <Route path="/iso" element={<Iso />} />
      <Route path="/isometric" element={<Isometric />} />
      <Route path="/v1-page" element={<V1 />} />
      <Route path="/v2-page" element={<V2 />} />
      <Route path="/v3-page" element={<V3 />} />
      <Route path="/v4-page" element={<V4 />} />
      <Route path="/iso-kit" element={<IsoKit />} />
    </Routes>
    </Suspense>
  );
}

export default App;
