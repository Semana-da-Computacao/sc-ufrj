interface InfoProps {
  date: string;
  location: string;
  about?: string;
}

export default function Info({ date, location, about }: InfoProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Informações Gerais</h2>
      <div className="grid gap-4">
        <div>
          <h3 className="font-medium">Data</h3>
          <p>{date}</p>
        </div>
        <div>
          <h3 className="font-medium">Local</h3>
          <p>{location}</p>
        </div>
        <div>
          <p>{about} </p>
        </div>
      </div>
    </section>
  );
}
