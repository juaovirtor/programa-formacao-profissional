import { useCallback } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Intro from "./components/layout/Intro";
import MobileCta from "./components/layout/MobileCta";
import Hero from "./components/sections/Hero";
import Fatos from "./components/sections/Fatos";
import Historia from "./components/sections/Historia";
import Formacao from "./components/sections/Formacao";
import Galeria from "./components/sections/Galeria";
import Convidados from "./components/sections/Convidados";
import PrimeiraTurma from "./components/sections/PrimeiraTurma";
import Certificacao from "./components/sections/Certificacao";
import Instagram from "./components/sections/Instagram";
import Compromisso from "./components/sections/Compromisso";
import Transparencia from "./components/sections/Transparencia";
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
        <Fatos />
        <Historia />
        <Formacao />
        <Galeria />
        <Convidados />
        <PrimeiraTurma />
        <Certificacao />
        <ApplicationForm />
        <Instagram />
        <Compromisso />
        <Transparencia />
      </main>

      <Footer />
      <MobileCta onCta={scrollToForm} />
    </>
  );
}
