import { useCallback } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Intro from "./components/layout/Intro";
import MobileCta from "./components/layout/MobileCta";
import Hero from "./components/sections/Hero";
import Stats from "./components/sections/Stats";
import Learn from "./components/sections/Learn";
import BeyondTech from "./components/sections/BeyondTech";
import Experience from "./components/sections/Experience";
import Inclusion from "./components/sections/Inclusion";
import LocalRoots from "./components/sections/LocalRoots";
import Why from "./components/sections/Why";
import HowItWorks from "./components/sections/HowItWorks";
import ProgramInfo from "./components/sections/ProgramInfo";
import CtaBanner from "./components/sections/CtaBanner";
import ApplicationForm from "./components/form/ApplicationForm";

export default function App() {
  /** Rolagem suave até o formulário de inscrição. */
  const scrollToForm = useCallback(() => {
    document.querySelector("#inscricao")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <Intro />
      <Header onCta={scrollToForm} />

      <main>
        <Hero onCta={scrollToForm} />
        <Stats />
        <Learn />
        <BeyondTech />
        <Inclusion />
        <Experience />
        <LocalRoots />
        <Why />
        <HowItWorks />
        <ProgramInfo />
        <CtaBanner onCta={scrollToForm} />
        <ApplicationForm />
      </main>

      <Footer />
      <MobileCta onCta={scrollToForm} />
    </>
  );
}
