import About from "./components/About";
import Hero from "./components/Hero";
import Sponsors from "./components/Sponsors";
import Stats from "./components/Stats";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <About />
      <Sponsors />
    </main>
  );
}
