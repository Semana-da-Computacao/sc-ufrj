import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Sponsors() {
  return (
    <section id="parceiros" className="bg-muted py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Parceiros</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Adicione aqui os logos dos patrocinadores */}
          <div className="aspect-square bg-background rounded-lg flex items-center justify-center p-4">
            Logo Patrocinador 1
          </div>
          <div className="aspect-square bg-background rounded-lg flex items-center justify-center p-4">
            Logo Patrocinador 2
          </div>
          <div className="aspect-square bg-background rounded-lg flex items-center justify-center p-4">
            Logo Patrocinador 3
          </div>
          <div className="aspect-square bg-background rounded-lg flex items-center justify-center p-4">
            Logo Patrocinador 4
          </div>
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/parceiros">Conheça Todos os Nossos Parceiros</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
