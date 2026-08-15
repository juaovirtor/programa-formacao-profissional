import { realpathSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// O nome da pasta tem acento e espaço. Dependendo de como o processo é iniciado,
// o Windows entrega o caminho no formato curto 8.3 (…/PROGRA~1) e o allow-list do
// dev server passa a rejeitar os próprios arquivos do projeto. Detectamos esse
// caso e relaxamos a checagem apenas nele — em caminho normal, o padrão do Vite
// (strict) continua valendo. Afeta somente o servidor de desenvolvimento.
const here = dirname(fileURLToPath(import.meta.url));
const real = realpathSync.native(here);
const shortPath = here !== real;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    fs: shortPath ? { strict: false } : { allow: [here] },
    // /api → servidor Express local (npm run api)
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.API_PORT ?? 3001}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "es2020",
    cssMinify: true,
  },
});
