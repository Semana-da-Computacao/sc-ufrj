interface InfoProps {
  date: string;
  location: string;
}

export default function Info({ date, location }: InfoProps) {
  return (
    <section>
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
      </div>
    </section>
  );
}
