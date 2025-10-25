export default function Stats() {
  const stats = [
    { number: "15+", label: "Edições" },
    { number: "1000+", label: "Participantes por Edição" },
    { number: "50+", label: "Palestras e Workshops" },
    { number: "30+", label: "Empresas Parceiras" },
  ];

  return (
    <section className="bg-muted py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Números</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
