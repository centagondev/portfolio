import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { getLenis, useLenis } from "./hooks/useLenis";
import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { About } from "./pages/About";

const INTRO_KEY = "centagon-intro-seen";

export default function App() {
  const location = useLocation();

  // Run the intro only on the first visit of the session.
  const [introDone, setIntroDone] = useState(
    () => sessionStorage.getItem(INTRO_KEY) === "1"
  );

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, "1");
    setIntroDone(true);
  }, []);

  useLenis(introDone);

  // Jump to top between routes — after the old page has animated out.
  const scrollTop = useCallback(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {!introDone && <Preloader onDone={handleIntroDone} />}
      {/* Film grain over everything — part of the site's texture. */}
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <AnimatePresence mode="wait" onExitComplete={scrollTop}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}
