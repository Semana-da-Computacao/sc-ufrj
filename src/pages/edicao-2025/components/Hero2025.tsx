import { Button } from "@/components/ui/button";

export function Hero2025() {
  // URL do ingresso — substituir pela URL real do evento
  const ticketUrl = "/2025/bg-hero.gif";

  return (
    <div className="relative w-full min-h-[75vh] lg:h-screen overflow-hidden">
      <img
        src="/2025/bg-hero.gif"
        alt="Fundo animado - Semana da Computação 2025"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-transparent border-0 text-white p-6 md:p-10 rounded-2xl">
              <div className="text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono">
                  Semana da Computação UFRJ 2025
                </h1>
                <p className="text-md sm:text-lg lg:text-xl text-white/90">
                  5 dias com palestras, workshops e networking para estudantes e
                  profissionais. Vagas limitadas — garanta seu lugar.
                </p>

                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button asChild aria-label="Garanta seu ingresso">
                    <a
                      href={ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3"
                    >
                      Garanta seu ingresso
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    asChild
                    aria-label="Saiba mais sobre programação"
                  >
                    <a href="/edicao-2025" className="px-6 py-3">
                      Ver programação
                    </a>
                  </Button>
                </div>

                <p className="text-sm text-white/70 mt-3">
                  Iniciativa dos estudantes do IC-UFRJ — entrada gratuita para
                  estudantes com comprovante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
