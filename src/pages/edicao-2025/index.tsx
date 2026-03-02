import { Hero2025 } from "./components/Hero2025";
import Info from "./components/Info";
import Sponsors2025 from "./components/Sponsors2025";
import Schedule from "./components/Schedule";
import Subscribe from "./components/Subscribe";
import { useEvent2025Data } from "./data/useEvent2025Data";

export default function Edicao2025Page() {
  const { data, isLoading } = useEvent2025Data();

  return (
    <main className="relative">
      <Hero2025 />
      {!isLoading ? (
        <>
          <Info
            date={data.eventInfo.date}
            location={data.eventInfo.location}
            about={data.eventInfo.about}
          />
          <Sponsors2025 data={data} />
          <Schedule schedule={data.schedule} />
        </>
      ) : (
        <section className="py-12 text-center text-muted-foreground">Carregando edição 2025...</section>
      )}
      <Subscribe />
    </main>
  );
}
