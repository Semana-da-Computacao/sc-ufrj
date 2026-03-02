import { Hero2026 } from "./components/Hero2026";
import Sponsors2026 from "./components/Sponsors2026";
import Info2026 from "./components/Info2026";
import StorySections2026 from "./components/StorySections2026";
import Schedule2026 from "./components/Schedule2026";
import Subscribe2026 from "./components/Subscribe2026";
import { useEvent2026Data } from "./data/useEvent2026Data";
import "./styles-2026.css";

export default function Edicao2026Page() {
  const { data, isLoading } = useEvent2026Data();

  return (
    <main className="edition-2026-root relative bg-zinc-950">
      <Hero2026 data={data} />
      {!isLoading ? (
        <>
          <Info2026 data={data} />
          <Sponsors2026 data={data} />
          <Schedule2026 data={data} />
          <StorySections2026 data={data} />
          <Subscribe2026 data={data} />
        </>
      ) : (
        <section className="py-16 text-center text-stone-300">Preparando o cenário de 2026...</section>
      )}
    </main>
  );
}
