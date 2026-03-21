/**
 * Entry point do servidor
 * Inicia o Express e conecta ao banco de dados
 */
import app from "./app";
import prisma from "./lib/prisma";

const PORT = Number(process.env.PORT) || 3001;

async function bootstrap() {
  try {
    // Testa conexão com o banco
    await prisma.$connect();
    console.log("✅ Banco de dados conectado");

    app.listen(PORT, () => {
      console.log(`🚀 API rodando em http://localhost:${PORT}`);
      console.log(`📚 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("❌ Falha ao iniciar servidor:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
