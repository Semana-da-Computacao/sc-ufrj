import About from "./components/About";
import Committee from "./components/Committee";
import EditionsCarousel from "./components/EditionsCarousel";
import Faq from "./components/Faq";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import { useHomeData } from "./data/useHomeData";

export default function HomePage() {
  const { data, isLoading } = useHomeData();

  return (
    <main>
      <Hero data={data.hero} />
      {!isLoading ? (
        <>
          <Stats items={data.stats} />
          <About data={data.about} />
          <EditionsCarousel items={data.featuredEditions} />
          <Committee
            title={data.committee.title}
            subtitle={data.committee.subtitle}
            members={data.committee.members}
          />
          <Faq title={data.faq.title} subtitle={data.faq.subtitle} items={data.faq.items} />
        </>
      ) : (
        <section className="py-16 text-center text-muted-foreground">Carregando conteúdo da página inicial...</section>
      )}
    </main>
  );
}
