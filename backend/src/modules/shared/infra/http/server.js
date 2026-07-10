import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 3001;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `A porta ${PORT} já está em uso. Encerre o outro processo e tente de novo.`,
    );
  } else {
    console.error("Erro ao iniciar o servidor:", error);
  }
  process.exit(1);
});
