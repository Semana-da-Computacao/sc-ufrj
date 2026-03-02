import Header2026 from "../components/Header2026";

interface Layout2026Props {
  children: React.ReactNode;
}

export default function Layout2026({ children }: Layout2026Props) {
  return (
    <div className="dark">
      <Header2026 />
      {children}
    </div>
  );
}
