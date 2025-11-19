interface ScheduleDay {
  day: string;
  theme: string;
  highlights: string[];
}

interface ScheduleProps {
  schedule: ScheduleDay[];
}

export default function Schedule({ schedule }: ScheduleProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Programação</h2>
      <div className="grid gap-6">
        {schedule.map((day, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              {day.day} - {day.theme}
            </h3>
            <ul className="list-disc list-inside">
              {day.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
