import Header2025 from "../components/Header20205";

interface Layout2025Props {
  children: React.ReactNode;
}

export default function Layout2025({ children }: Layout2025Props) {
  return (
    <>
      <Header2025 />
      {children}
    </>
  );
}
